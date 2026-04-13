import { generateResume } from '../../lib/claude';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';
import pdfParse from 'pdf-parse';

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

          // Get content after double newline
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

    // Save temp file and extract text
    const tmpPath = path.join(os.tmpdir(), `resume_${Date.now()}.pdf`);
    fs.writeFileSync(tmpPath, file.buffer);

    // Extract text from PDF
    let pdfText = '';
    try {
      const dataBuffer = fs.readFileSync(tmpPath);
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text;
    } catch (pdfErr) {
      console.error('PDF parse error:', pdfErr);
      return res.status(400).json({
        success: false,
        error: 'PDF read failed. Please ensure it is a valid PDF with text (not scanned image).'
      });
    } finally {
      // Cleanup temp file
      try { fs.unlinkSync(tmpPath); } catch {}
    }

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'PDF માંથી text extract ના થયો. Scanned/image PDF supported નથી. Text-based PDF upload કરો.'
      });
    }

    const orderId = uuidv4();

    // Send extracted text to Claude
    const userData = {
      rawText: pdfText,
      targetRole: targetRole,
      instruction: 'This is extracted text from the user\'s old resume. Restructure and enhance it into a professional resume.'
    };

    const resume = await generateResume(userData);

    return res.status(200).json({
      success: true,
      resume,
      orderId
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.'
    });
  }
}
