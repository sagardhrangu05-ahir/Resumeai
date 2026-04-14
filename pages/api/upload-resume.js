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

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    if (file.buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File size 10MB થી ઓછી હોવી જોઈએ!' });
    }

    const fileType = getFileType(file.filename || '');

    if (!fileType) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. PDF, Word (.docx), JPG અથવા PNG upload કરો.'
      });
    }

    const orderId = uuidv4();
    let resume;

    // ── IMAGE (JPG / PNG / WEBP) ──────────────────────────────────────────
    if (fileType.startsWith('image/')) {
      try {
        resume = await generateResumeFromImage(file.buffer, fileType, targetRole);
      } catch (imgErr) {
        console.error('Image parse error:', imgErr);
        return res.status(400).json({
          success: false,
          error: 'Image read failed. Clear, good-quality resume image upload કરો.'
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
          error: 'Word file read failed. Valid .docx file upload કરો.'
        });
      }

      if (!docText || docText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Word file માંથી text extract ના થયો. Valid resume .docx upload કરો.'
        });
      }

      resume = await generateResume({
        rawText: docText,
        targetRole,
        instruction: "This is extracted text from the user's Word (.docx) resume. Restructure and enhance it into a professional resume."
      });

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
          error: 'PDF read failed. Valid text-based PDF upload કરો.'
        });
      } finally {
        try { fs.unlinkSync(tmpPath); } catch {}
      }

      if (!pdfText || pdfText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          error: 'PDF માંથી text extract ના થયો. Scanned/image PDF supported નથી — text-based PDF upload કરો.'
        });
      }

      resume = await generateResume({
        rawText: pdfText,
        targetRole,
        instruction: "This is extracted text from the user's old resume. Restructure and enhance it into a professional resume."
      });
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
