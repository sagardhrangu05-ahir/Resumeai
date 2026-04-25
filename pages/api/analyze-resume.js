import { analyzeResume, analyzeResumeFromImage } from '../../lib/claude';
import { rateLimit } from '../../lib/rate-limit';
const path = require('path');
const fs   = require('fs');
const os   = require('os');

export const config = { api: { bodyParser: false } };

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buffer      = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const boundary    = contentType.split('boundary=')[1]?.split(';')[0]?.trim();
      if (!boundary) { reject(new Error('Missing boundary')); return; }

      const parts = {};
      const raw   = buffer.toString('binary');
      for (const section of raw.split('--' + boundary)) {
        if (!section.includes('Content-Disposition')) continue;
        const nameMatch     = section.match(/name="([^"]+)"/);
        const filenameMatch = section.match(/filename="([^"]+)"/);
        const name          = nameMatch?.[1];
        if (!name) continue;
        const start   = section.indexOf('\r\n\r\n') + 4;
        const end     = section.lastIndexOf('\r\n');
        const content = section.substring(start, end);
        parts[name] = filenameMatch
          ? { filename: filenameMatch[1], buffer: Buffer.from(content, 'binary') }
          : content;
      }
      resolve(parts);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!rateLimit(ip, { windowMs: 60_000, max: 10 })) {
    return res.status(429).json({ error: 'Too many requests. Please wait.' });
  }

  // JSON body path — called from preview page with already-generated resume object
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    try {
      const rawBody = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', c => chunks.push(c));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
      });
      const { resume, targetRole = '' } = JSON.parse(rawBody);
      if (!resume || typeof resume !== 'object') return res.status(400).json({ error: 'Invalid resume data' });
      const text = [
        resume.name,
        resume.summary,
        ...(resume.experience || []).flatMap(e => [e.title, e.company, ...(e.bullets || [])]),
        ...(resume.skills?.technical || []),
        ...(resume.skills?.soft || []),
        ...(resume.projects || []).map(p => p.name + ' ' + p.description),
        ...(resume.education || []).map(e => e.degree + ' ' + e.institution),
        ...(resume.certifications || []),
        ...(resume.achievements || []),
      ].filter(Boolean).join('\n');
      const analysis = await analyzeResume(text, targetRole);
      return res.status(200).json({ success: true, analysis });
    } catch (err) {
      console.error('Analyze (JSON) error:', err);
      return res.status(500).json({ error: 'Analysis failed.' });
    }
  }

  try {
    const parts     = await parseMultipart(req);
    const file      = parts.resume;
    const targetRole = parts.targetRole || '';

    if (!file?.buffer) return res.status(400).json({ error: 'No file uploaded' });
    if (file.buffer.length > 10 * 1024 * 1024) return res.status(400).json({ error: 'File too large (max 10MB)' });

    const ext = path.extname(file.filename || '').toLowerCase();
    let analysis;

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      analysis = await analyzeResumeFromImage(file.buffer, mime, targetRole);

    } else if (ext === '.docx' || ext === '.doc') {
      const mammoth = require('mammoth');
      const { value: text } = await mammoth.extractRawText({ buffer: file.buffer });
      if (!text || text.trim().length < 50) return res.status(400).json({ error: 'Could not read Word file.' });
      analysis = await analyzeResume(text, targetRole);

    } else if (ext === '.pdf') {
      const tmpPath = path.join(os.tmpdir(), `analyze_${Date.now()}.pdf`);
      fs.writeFileSync(tmpPath, file.buffer);
      let text = '';
      try {
        const pdfParse = require('pdf-parse');
        const data     = await pdfParse(fs.readFileSync(tmpPath));
        text = data.text;
      } finally {
        try { fs.unlinkSync(tmpPath); } catch {}
      }
      if (!text || text.trim().length < 50) return res.status(400).json({ error: 'Could not read PDF text.' });
      analysis = await analyzeResume(text, targetRole);

    } else {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    return res.status(200).json({ success: true, analysis });

  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
}
