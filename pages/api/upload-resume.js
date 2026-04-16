import { generateResume, generateResumeFromImage } from '../../lib/claude';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const os = require('os');

export const config = {
  api: { bodyParser: false }
};

// Simple multipart parser for Next.js
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'];
      const boundary = contentType.split('boundary=')[1];

      const parts = {};
      const raw = buffer.toString('binary');
      const sections = raw.split('--' + boundary);

      for (const section of sections) {
        if (section.includes('Content-Disposition')) {
          const nameMatch = section.match(/name="([^"]+)"/);
          const filenameMatch = section.match(/filename="([^"]+)"/);
          const name = nameMatch ? nameMatch[1] : null;

          if (!name) continue;

          const contentStart = section.indexOf('\r\n\r\n') + 4;
          const contentEnd = section.lastIndexOf('\r\n');
          const content = section.substring(contentStart, contentEnd);

          if (filenameMatch) {
            parts[name] = {
              filename: filenameMatch[1],
              buffer: Buffer.from(content, 'binary')
            };
          } else {
            parts[name] = content;
          }
        }
      }
      resolve(parts);
    });
    req.on('error', reject);
  });
}

// Detect file type from filename extension
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.docx' || ext === '.doc') return 'docx';
  if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parts = await parseMultipart(req);
    const file = parts.resume;
    const targetRole = parts.targetRole || '';
    const resumeType = parts.resumeType || 'fresher';

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (file.buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File size must be under 10 MB.' });
    }

    const fileType = getFileType(file.filename || '');

    if (!fileType) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload PDF, Word (.docx), JPG or PNG.'
      });
    }

    const orderId = uuidv4();
    let resume;

    // ── IMAGE (JPG / PNG / WEBP) ──────────────────────────────────────────
    if (fileType.startsWith('image/')) {
      try {
        resume = await generateResumeFromImage(file.buffer, fileType, targetRole, resumeType);
      } catch (imgErr) {
        console.error('Image parse error:', imgErr);
        return res.status(400).json({
          success: false,
          error: 'Image read failed. Please upload a clear, good-quality resume image.'
        });
      }

    // ── WORD (.docx) ──────────────────────────────────────────────────────
    } else if (fileType === 'docx') {
      let docText = '';
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        docText = result.value;
      } catch (docErr) {
        console.error('DOCX parse error:', docErr);
        return res.status(400).json({
          success: false,
          error: 'Word file read failed. Please upload a valid .docx file.'
        });
      }

      if (!docText || docText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Could not extract text from the Word file. Please upload a valid resume .docx.'
        });
      }

      resume = await generateResume({
        rawText: docText,
        targetRole,
        instruction: "This is extracted text from the user's Word (.docx) resume. Restructure and enhance it into a professional resume."
      }, resumeType);

    // ── PDF ───────────────────────────────────────────────────────────────
    } else {
      const tmpPath = path.join(os.tmpdir(), `resume_${Date.now()}.pdf`);
      fs.writeFileSync(tmpPath, file.buffer);

      let pdfText = '';
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(tmpPath);
        const pdfData = await pdfParse(dataBuffer);
        pdfText = pdfData.text;
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr);
        return res.status(400).json({
          success: false,
          error: 'PDF read failed. Please upload a valid text-based PDF.'
        });
      } finally {
        try { fs.unlinkSync(tmpPath); } catch {}
      }

      if (!pdfText || pdfText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Could not extract text from PDF. Scanned/image PDFs are not supported — please upload a text-based PDF.'
        });
      }

      resume = await generateResume({
        rawText: pdfText,
        targetRole,
        instruction: "This is extracted text from the user's old resume. Restructure and enhance it into a professional resume."
      }, resumeType);
    }

    return res.status(200).json({ success: true, resume, orderId });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.'
    });
  }
}
