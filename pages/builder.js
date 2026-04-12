import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

const emptyExp = { title: '', company: '', duration: '', description: '' };
const emptyEdu = { degree: '', institution: '', year: '', score: '' };
const emptyProject = { name: '', description: '', tech_used: '' };

export default function Builder() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [tab, setTab] = useState('form'); // 'form' or 'upload'
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '',
    summary: '', targetRole: '',
    experience: [{ ...emptyExp }],
    education: [{ ...emptyEdu }],
    skills: '',
    projects: [{ ...emptyProject }],
    certifications: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, empty) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], { ...empty }] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // ===== FORM SUBMIT =====
  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email) {
      alert('Name અને Email required છે!');
      return;
    }

    setLoading(true);
    setLoadingText('AI તારો resume generate કરી રહ્યું છે... (30 sec)');

    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'form', data: formData })
      });

      const result = await res.json();
      if (result.success) {
        // Store resume data in sessionStorage and go to preview
        sessionStorage.setItem('resumeData', JSON.stringify(result.resume));
        sessionStorage.setItem('orderId', result.orderId);
        router.push('/preview');
      } else {
        alert('Error: ' + (result.error || 'Something went wrong'));
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== FILE UPLOAD =====
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files accepted!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size 5MB થી ઓછી હોવી જોઈએ!');
      return;
    }

    setUploadedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!uploadedFile) {
      alert('Please upload a PDF file first!');
      return;
    }

    setLoading(true);
    setLoadingText('PDF read કરી રહ્યા છીએ + AI resume generate કરી રહ્યું છે... (45 sec)');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', uploadedFile);
      formDataUpload.append('targetRole', targetRole);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formDataUpload
      });

      const result = await res.json();
      if (result.success) {
        sessionStorage.setItem('resumeData', JSON.stringify(result.resume));
        sessionStorage.setItem('orderId', result.orderId);
        router.push('/preview');
      } else {
        alert('Error: ' + (result.error || 'Something went wrong'));
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING OVERLAY =====
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">{loadingText}</p>
        <p style={{ color: '#6B6B8D', fontSize: 12, marginTop: 8 }}>
          Page close ના કરો — processing ચાલુ છે
        </p>
      </div>
    );
  }

  return (
    <div className="builder-page">
      {/* Header */}
      <div className="builder-header">
        <div style={{ cursor: 'pointer', marginBottom: 16 }} onClick={() => router.push('/')}>
          <span style={{ color: '#FFD700', fontSize: 20, fontWeight: 800 }}>Resume</span>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>AI</span>
        </div>
        <h1>Resume Build કરો</h1>
        <p>Data ભરો અથવા old resume upload કરો</p>
      </div>

      {/* Tab Selector */}
      <div className="tab-selector">
        <button className={`tab-btn ${tab === 'form' ? 'active' : ''}`}
          onClick={() => setTab('form')}>
          ✍️ Data ભરો
        </button>
        <button className={`tab-btn ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => setTab('upload')}>
          📄 PDF Upload
        </button>
      </div>

      {/* ===== FORM TAB ===== */}
      {tab === 'form' && (
        <div className="form-card">
          {/* Personal Info */}
          <div className="form-section">
            <h3>👤 Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Rahul Sharma"
                  value={formData.name} onChange={e => updateField('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="rahul@email.com"
                  value={formData.email} onChange={e => updateField('email', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="+91 98765 43210"
                  value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="Mumbai, India"
                  value={formData.location} onChange={e => updateField('location', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>LinkedIn URL (optional)</label>
              <input type="text" placeholder="linkedin.com/in/your-name"
                value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Target Job Role (optional but recommended)</label>
              <input type="text" placeholder="e.g., Software Engineer, Data Analyst, Marketing Manager"
                value={formData.targetRole} onChange={e => updateField('targetRole', e.target.value)} />
            </div>
          </div>

          {/* Experience */}
          <div className="form-section">
            <h3>💼 Work Experience</h3>
            {formData.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 20, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" placeholder="Software Developer"
                      value={exp.title} onChange={e => updateArrayItem('experience', i, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" placeholder="TCS"
                      value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" placeholder="Jan 2023 - Present"
                    value={exp.duration} onChange={e => updateArrayItem('experience', i, 'duration', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Responsibilities (comma separated or paragraph)</label>
                  <textarea placeholder="Built REST APIs using Node.js, Managed team of 5 developers, Increased app performance by 40%..."
                    value={exp.description} onChange={e => updateArrayItem('experience', i, 'description', e.target.value)} />
                </div>
                {formData.experience.length > 1 && (
                  <button className="remove-btn" onClick={() => removeArrayItem('experience', i)}>
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={() => addArrayItem('experience', emptyExp)}>
              + Add More Experience
            </button>
          </div>

          {/* Education */}
          <div className="form-section">
            <h3>🎓 Education</h3>
            {formData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree</label>
                    <input type="text" placeholder="B.Tech Computer Science"
                      value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input type="text" placeholder="IIT Mumbai"
                      value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year</label>
                    <input type="text" placeholder="2020 - 2024"
                      value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Score/CGPA</label>
                    <input type="text" placeholder="8.5 CGPA"
                      value={edu.score} onChange={e => updateArrayItem('education', i, 'score', e.target.value)} />
                  </div>
                </div>
                {formData.education.length > 1 && (
                  <button className="remove-btn" onClick={() => removeArrayItem('education', i)}>
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={() => addArrayItem('education', emptyEdu)}>
              + Add More Education
            </button>
          </div>

          {/* Skills */}
          <div className="form-section">
            <h3>🛠️ Skills</h3>
            <div className="form-group">
              <label>All skills (comma separated)</label>
              <textarea placeholder="Python, JavaScript, React, SQL, Data Analysis, Project Management, Communication, Leadership..."
                value={formData.skills} onChange={e => updateField('skills', e.target.value)} />
            </div>
          </div>

          {/* Projects */}
          <div className="form-section">
            <h3>🚀 Projects (Optional)</h3>
            {formData.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input type="text" placeholder="E-commerce Website"
                    value={proj.name} onChange={e => updateArrayItem('projects', i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Built a full-stack e-commerce platform with payment integration..."
                    value={proj.description} onChange={e => updateArrayItem('projects', i, 'description', e.target.value)}
                    style={{ minHeight: 70 }} />
                </div>
                <div className="form-group">
                  <label>Technologies Used</label>
                  <input type="text" placeholder="React, Node.js, MongoDB"
                    value={proj.tech_used} onChange={e => updateArrayItem('projects', i, 'tech_used', e.target.value)} />
                </div>
                {formData.projects.length > 1 && (
                  <button className="remove-btn" onClick={() => removeArrayItem('projects', i)}>
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={() => addArrayItem('projects', emptyProject)}>
              + Add More Projects
            </button>
          </div>

          {/* Certifications */}
          <div className="form-section">
            <h3>🏆 Certifications (Optional)</h3>
            <div className="form-group">
              <label>Certifications (one per line)</label>
              <textarea placeholder="AWS Certified Cloud Practitioner&#10;Google Data Analytics Certificate&#10;PMP Certification"
                value={formData.certifications} onChange={e => updateField('certifications', e.target.value)} />
            </div>
          </div>

          {/* Submit */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn-primary" onClick={handleFormSubmit}
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              🤖 AI Resume Generate કરો
            </button>
            <p style={{ color: '#6B6B8D', fontSize: 12, marginTop: 8 }}>
              Preview free છે — Payment later
            </p>
          </div>
        </div>
      )}

      {/* ===== UPLOAD TAB ===== */}
      {tab === 'upload' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className={`upload-area ${uploadedFile ? 'upload-success' : ''}`}
            onClick={() => fileRef.current?.click()}>
            <input type="file" ref={fileRef} accept=".pdf"
              onChange={handleFileUpload} style={{ display: 'none' }} />

            {uploadedFile ? (
              <>
                <div className="icon">✅</div>
                <h3 style={{ color: '#00E676' }}>File Uploaded!</h3>
                <p>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(0)} KB)</p>
                <p style={{ color: '#B0B0D0', fontSize: 12, marginTop: 8 }}>
                  Click to change file
                </p>
              </>
            ) : (
              <>
                <div className="icon">📄</div>
                <h3>Old Resume PDF Upload કરો</h3>
                <p>Click here or drag & drop • PDF only • Max 5MB</p>
              </>
            )}
          </div>

          <div className="form-card" style={{ marginTop: 24 }}>
            <div className="form-group">
              <label>Target Job Role (optional but recommended)</label>
              <input type="text" placeholder="e.g., Software Engineer, Data Analyst"
                value={targetRole} onChange={e => setTargetRole(e.target.value)} />
            </div>

            <button className="btn-primary" onClick={handleUploadSubmit}
              disabled={!uploadedFile}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 16 }}>
              🤖 AI Resume Upgrade કરો
            </button>
            <p style={{ color: '#6B6B8D', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
              AI old resume read કરીને better version બનાવશે • Preview free
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
