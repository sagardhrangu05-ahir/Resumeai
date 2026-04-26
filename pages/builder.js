import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FileText, Upload, User, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
import { RESUME_TYPES } from '../config/resumeTypes';
import { saveSession } from '../lib/credits';

const emptyExp     = { title: '', company: '', duration: '', description: '' };
const emptyEdu     = { degree: '', institution: '', year: '', score: '' };
const defaultEdu   = [
  { degree: '', institution: '', year: '', score: '', _label: 'School (10th / 12th)' },
  { degree: '', institution: '', year: '', score: '', _label: 'College / University' }
];
const emptyProject = { name: '', description: '', tech_used: '' };
const emptyIntern  = { role: '', company: '', duration: '', description: '' };

const ACCEPTED_RESUME_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
const ACCEPTED_PHOTO_TYPES  = 'image/jpeg,image/png,image/webp';
const MAX_FILE_SIZE          = 10 * 1024 * 1024;

export default function Builder() {
  const router   = useRouter();
  const { type: typeSlug, design } = router.query;
  const fileRef  = useRef(null);
  const photoRef = useRef(null);
  const toast    = useToast();

  const resumeType = RESUME_TYPES.find(t => t.slug === typeSlug) || RESUME_TYPES[0];
  const fields     = resumeType?.fields || [];
  const has        = (f) => fields.includes(f);

  const [tab,          setTab         ] = useState('form');
  const [loading,      setLoading     ] = useState(false);
  const [loadingText,  setLoadingText ] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [targetRole,   setTargetRole  ] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dragOver,     setDragOver    ] = useState(false);
  const [errors,       setErrors      ] = useState({});
  const [analysis,     setAnalysis    ] = useState(null);
  const [analyzing,    setAnalyzing   ] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '', github: '',
    summary: '', targetRole: '', jobDescription: '',
    techStack: '',
    experience:     [{ ...emptyExp }],
    education:      defaultEdu.map(e => ({ ...e })),
    internships:    [{ ...emptyIntern }],
    skills: '',
    projects:       [{ ...emptyProject }],
    achievements:   '',
    certifications: ''
  });

  const DRAFT_KEY = 'resumejet_draft';

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const { formData: savedForm, profilePhoto: savedPhoto, savedAt } = JSON.parse(saved);
      const ageMin = (Date.now() - savedAt) / 60000;
      if (ageMin > 60 * 24) { localStorage.removeItem(DRAFT_KEY); return; } // discard drafts > 1 day
      if (savedForm && window.confirm('Resume draft found. Restore your previous data?')) {
        setFormData(prev => ({ ...prev, ...savedForm }));
        if (savedPhoto) setProfilePhoto(savedPhoto);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const hasData = formData.name.trim() || formData.email.trim();
        if (!hasData) return;
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, profilePhoto, savedAt: Date.now() }));
      } catch { /* ignore */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData, profilePhoto]);

  // Clear draft after successful submission
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } };

  const updateField     = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updateArrayItem = (field, index, key, value) =>
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });

  const addArrayItem    = (field, empty) =>
    setFormData(prev => ({ ...prev, [field]: [...prev[field], { ...empty }] }));

  const removeArrayItem = (field, index) =>
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));

  // ── Profile Photo ──────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Only JPG / PNG / WebP images allowed!', 'error');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast('Photo must be under 3 MB!', 'error');
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 300;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
      else        { if (h > MAX) { w = w * MAX / h; h = MAX; } }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      setProfilePhoto(canvas.toDataURL('image/jpeg', 0.85));
      URL.revokeObjectURL(objectUrl);
      toast('Photo uploaded!', 'success');
    };
    img.src = objectUrl;
  };

  // ── Validation ─────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())  newErrors.name  = 'Name required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (has('jobDescription') && !formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Paste job description for ATS optimization';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Form Submit ────────────────────────────────────────────────────────
  const handleFormSubmit = async () => {
    if (!validateForm()) {
      toast('Please fill required fields!', 'error');
      setTimeout(() => {
        const el = document.querySelector('input.error, textarea.error');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 80);
      return;
    }
    setLoading(true);
    setLoadingText('AI is generating your resume… (30 sec)');
    try {
      const res    = await fetch('/api/generate-resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'form', data: formData, resumeType: typeSlug, design })
      });
      const result = await res.json();
      if (result.success) {
        clearDraft();
        const resumeData = JSON.stringify(result.resume);
        sessionStorage.setItem('resumeData',    resumeData);
        sessionStorage.setItem('orderId',       result.orderId);
        sessionStorage.setItem('selectedType',  typeSlug || 'fresher');
        sessionStorage.setItem('selectedDesign', design   || 'classic-pro');
        if (profilePhoto) sessionStorage.setItem('profilePhoto', profilePhoto);
        else              sessionStorage.removeItem('profilePhoto');
        saveSession({
          resumeData,
          orderId: result.orderId,
          profilePhoto,
          selectedDesign: design || 'classic-pro'
        });
        router.push('/preview');
      } else {
        toast('Error: ' + (result.error || 'Something went wrong'), 'error');
      }
    } catch (err) {
      toast('Network error. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── File Upload ────────────────────────────────────────────────────────
  const validateAndSetFile = (file) => {
    if (!file) return;
    const name        = file.name.toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExts.some(ext => name.endsWith(ext))) {
      toast('Unsupported file. Please upload PDF, Word (.docx) or Image (JPG/PNG).', 'error');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast('File size must be under 10 MB!', 'error');
      return;
    }
    setUploadedFile(file);
    toast(`${file.name} selected!`, 'success');
  };

  const handleFileUpload = (e) => validateAndSetFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) { toast('Please upload a file first!', 'error'); return; }
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const fd = new FormData();
      fd.append('resume', uploadedFile);
      fd.append('targetRole', targetRole);
      const res  = await fetch('/api/analyze-resume', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data.analysis);
    } catch (err) {
      toast(err.message || 'Analysis failed. Try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadedFile) {
      toast('Please upload a file first!', 'error');
      return;
    }
    const name    = uploadedFile.name.toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].some(ext => name.endsWith(ext));
    setLoading(true);
    setLoadingText(
      isImage ? 'Scanning image + AI generating resume… (45 sec)'
              : 'Reading file + AI generating resume… (45 sec)'
    );
    try {
      const fd = new FormData();
      fd.append('resume', uploadedFile);
      fd.append('targetRole', targetRole);
      fd.append('resumeType', typeSlug || 'fresher');
      fd.append('design', design || 'classic-pro');
      const res    = await fetch('/api/upload-resume', { method: 'POST', body: fd });
      const result = await res.json();
      if (result.success) {
        clearDraft();
        const resumeData = JSON.stringify(result.resume);
        sessionStorage.setItem('resumeData',    resumeData);
        sessionStorage.setItem('orderId',       result.orderId);
        sessionStorage.setItem('selectedType',  typeSlug  || 'fresher');
        sessionStorage.setItem('selectedDesign', design   || 'classic-pro');
        if (profilePhoto) sessionStorage.setItem('profilePhoto', profilePhoto);
        else              sessionStorage.removeItem('profilePhoto');
        saveSession({
          resumeData,
          orderId: result.orderId,
          profilePhoto,
          selectedDesign: design || 'classic-pro'
        });
        router.push('/preview');
      } else {
        toast('Error: ' + (result.error || 'Something went wrong'), 'error');
      }
    } catch (err) {
      toast('Network error. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fileIcon  = () => {
    if (!uploadedFile) return <Upload size={48} color="#8080A0" />;
    const n = uploadedFile.name.toLowerCase();
    if (n.endsWith('.pdf'))                         return <FileText size={48} color="#00E676" />;
    if (n.endsWith('.docx') || n.endsWith('.doc'))  return <FileText size={48} color="#448AFF" />;
    return <FileText size={48} color="#FFD700" />;
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p className="loading-text">{loadingText}</p>
        <p style={{ color: '#8080A0', fontSize: 12, marginTop: 8 }}>
          Do not close the page — processing is in progress
        </p>
      </div>
    );
  }

  return (
    <div className="builder-page" style={{ paddingTop: 80 }}>
      <Head>
        <title>Build Your Resume — ResumeJet</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar showCTA={false} />

      {/* Progress Stepper */}
      <div className="progress-stepper">
        <div className="step-item completed">
          <div className="step-dot" style={{ background: '#00E676', border: 'none' }}>✓</div>
          <span>Resume Type</span>
        </div>
        <div className="step-line" style={{ background: '#00E676' }}></div>
        <div className="step-item completed">
          <div className="step-dot" style={{ background: '#00E676', border: 'none' }}>✓</div>
          <span>Design</span>
        </div>
        <div className="step-line" style={{ background: '#00E676' }}></div>
        <div className="step-item active">
          <div className="step-dot">3</div>
          <span>Your Info</span>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-dot">4</div>
          <span>Download</span>
        </div>
      </div>

      {/* Header */}
      <div className="builder-header">
        <h1>
          {resumeType?.icon} {resumeType?.title || 'Build Your Resume'}
        </h1>
        <p>Fill in your details or upload your old resume</p>
      </div>

      {/* Breadcrumb back */}
      {typeSlug && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => router.push(`/select-design?type=${typeSlug}`)}
            style={{
              background: 'transparent', border: 'none', color: '#8080A0',
              fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
            }}
          >
            ← Change design
          </button>
        </div>
      )}

      {/* Tab Selector */}
      <div className="tab-selector">
        <button
          type="button"
          className={`tab-btn ${tab === 'form' ? 'active' : ''}`}
          onClick={() => setTab('form')}
          aria-pressed={tab === 'form'}
        >
          <FileText size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Fill Details
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => setTab('upload')}
          aria-pressed={tab === 'upload'}
        >
          <Upload size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Resume Upload
        </button>
      </div>

      {/* ═══════════════ FORM TAB ═══════════════ */}
      {tab === 'form' && (
        <div className="form-card">

          {/* Personal Info */}
          <div className="form-section">
            <h3><User size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Personal Information</h3>

            {/* Profile Photo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <div
                onClick={() => photoRef.current?.click()}
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  border: '2px dashed #FFD700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', background: '#12122A', flexShrink: 0
                }}
                role="button" tabIndex={0}
                aria-label="Upload profile photo"
                onKeyDown={e => e.key === 'Enter' && photoRef.current?.click()}
              >
                {profilePhoto
                  ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={32} color="#8080A0" />
                }
              </div>
              <div>
                <p style={{ color: '#B0B0D0', fontSize: 13, marginBottom: 6 }}>Profile Photo (optional)</p>
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  style={{
                    background: 'transparent', border: '1px solid #FFD700',
                    color: '#FFD700', borderRadius: 8, padding: '6px 14px',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePhoto && (
                  <button
                    type="button"
                    aria-label="Remove profile photo"
                    onClick={() => { setProfilePhoto(null); toast('Photo removed', 'info'); }}
                    style={{
                      background: 'transparent', border: '1px solid #FF4444',
                      color: '#FF4444', borderRadius: 8, padding: '6px 14px',
                      cursor: 'pointer', fontSize: 12, marginLeft: 8, fontFamily: 'Poppins, sans-serif'
                    }}
                  >Remove</button>
                )}
                <p style={{ color: '#8080A0', fontSize: 11, marginTop: 4 }}>JPG / PNG • max 3 MB</p>
              </div>
              <input type="file" ref={photoRef} accept={ACCEPTED_PHOTO_TYPES}
                onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input id="name" type="text" placeholder="Rahul Sharma"
                  value={formData.name} onChange={e => updateField('name', e.target.value)}
                  className={errors.name ? 'error' : ''} />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" placeholder="rahul@email.com"
                  value={formData.email} onChange={e => updateField('email', e.target.value)}
                  className={errors.email ? 'error' : ''} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" placeholder="+91 98765 43210"
                  value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input id="location" type="text" placeholder="Mumbai, India"
                  value={formData.location} onChange={e => updateField('location', e.target.value)} />
              </div>
            </div>

            {has('linkedin') && (
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn URL</label>
                <input id="linkedin" type="text" placeholder="linkedin.com/in/your-name"
                  value={formData.linkedin} onChange={e => updateField('linkedin', e.target.value)} />
              </div>
            )}

            {has('github') && (
              <div className="form-group">
                <label htmlFor="github">GitHub URL</label>
                <input id="github" type="text" placeholder="github.com/your-username"
                  value={formData.github} onChange={e => updateField('github', e.target.value)} />
              </div>
            )}

            {has('targetRole') && (
              <div className="form-group">
                <label htmlFor="targetRole">Target Job Role *</label>
                <input id="targetRole" type="text"
                  placeholder="e.g., Software Engineer, Data Analyst"
                  value={formData.targetRole} onChange={e => updateField('targetRole', e.target.value)} />
              </div>
            )}
          </div>

          {/* Job Description (ATS only) */}
          {has('jobDescription') && (
            <div className="form-section">
              <h3>🎯 Job Description (for ATS matching)</h3>
              <div className="form-group">
                <label htmlFor="jobDescription">
                  Paste the job description here *
                  <span style={{ color: '#00E676', fontSize: 11, marginLeft: 6 }}>
                    AI will match your resume keywords to this JD
                  </span>
                </label>
                <textarea id="jobDescription"
                  placeholder="Paste the full job description from the company's job posting..."
                  value={formData.jobDescription}
                  onChange={e => updateField('jobDescription', e.target.value)}
                  style={{ minHeight: 120 }}
                  className={errors.jobDescription ? 'error' : ''}
                />
                {errors.jobDescription && <span className="field-error">{errors.jobDescription}</span>}
              </div>
            </div>
          )}

          {/* Summary */}
          {has('summary') && (
            <div className="form-section">
              <h3><Bot size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Professional Summary (optional)</h3>
              <div className="form-group">
                <label htmlFor="summary">Brief summary (AI will enhance this)</label>
                <textarea id="summary"
                  placeholder="5+ years in software development, specialized in React and Node.js..."
                  value={formData.summary} onChange={e => updateField('summary', e.target.value)}
                  style={{ minHeight: 80 }} />
              </div>
            </div>
          )}

          {/* Tech Stack (IT Developer only) */}
          {has('techStack') && (
            <div className="form-section">
              <h3><Wrench size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Tech Stack</h3>
              <div className="form-group">
                <label htmlFor="techStack">Technologies, languages, frameworks (comma separated)</label>
                <textarea id="techStack"
                  placeholder="React, Node.js, TypeScript, Python, AWS, Docker, PostgreSQL..."
                  value={formData.techStack} onChange={e => updateField('techStack', e.target.value)} />
              </div>
            </div>
          )}

          {/* Experience */}
          {has('experience') && (
            <div className="form-section">
              <h3><Briefcase size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Work Experience</h3>
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
                    <label>Responsibilities</label>
                    <textarea placeholder="Built REST APIs using Node.js, Managed team of 5 developers..."
                      value={exp.description}
                      onChange={e => updateArrayItem('experience', i, 'description', e.target.value)} />
                  </div>
                  {formData.experience.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeArrayItem('experience', i)}>✕ Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayItem('experience', emptyExp)}>+ Add More Experience</button>
            </div>
          )}

          {/* Internships (Fresher only) */}
          {has('internships') && (
            <div className="form-section">
              <h3><Briefcase size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Internships</h3>
              {formData.internships.map((intern, i) => (
                <div key={i} style={{ marginBottom: 20, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Role</label>
                      <input type="text" placeholder="Frontend Intern"
                        value={intern.role} onChange={e => updateArrayItem('internships', i, 'role', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input type="text" placeholder="Startup XYZ"
                        value={intern.company} onChange={e => updateArrayItem('internships', i, 'company', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" placeholder="May 2023 - Jul 2023"
                      value={intern.duration} onChange={e => updateArrayItem('internships', i, 'duration', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>What you did</label>
                    <textarea placeholder="Built responsive UI components using React..."
                      value={intern.description}
                      onChange={e => updateArrayItem('internships', i, 'description', e.target.value)} />
                  </div>
                  {formData.internships.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeArrayItem('internships', i)}>✕ Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayItem('internships', emptyIntern)}>+ Add More Internships</button>
            </div>
          )}

          {/* Achievements (MBA only) */}
          {has('achievements') && (
            <div className="form-section">
              <h3>🏆 Key Achievements</h3>
              <div className="form-group">
                <label htmlFor="achievements">Notable achievements, awards, recognitions (one per line)</label>
                <textarea id="achievements"
                  placeholder="Led team of 20 that grew revenue by ₹5Cr&#10;Won Best Manager award 2023&#10;Reduced operational costs by 30%"
                  value={formData.achievements}
                  onChange={e => updateField('achievements', e.target.value)}
                  style={{ minHeight: 100 }} />
              </div>
            </div>
          )}

          {/* Education */}
          {has('education') && (
            <div className="form-section">
              <h3><GraduationCap size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Education</h3>
              {formData.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#FFD700' }}>
                      {i === 0 ? '🏫 School (10th / 12th)' : i === 1 ? '🎓 College / University' : '🎓 Masters / PhD'}
                    </span>
                    {i >= 2 && (
                      <button type="button" className="remove-btn" onClick={() => removeArrayItem('education', i)}>✕ Remove</button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{i === 0 ? 'Board / Stream' : 'Degree'}</label>
                      <input type="text"
                        placeholder={i === 0 ? 'HSC Science / CBSE 10th' : i === 1 ? 'B.Tech Computer Science' : 'M.Tech / MBA / MCA'}
                        value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>{i === 0 ? 'School Name' : 'College / University'}</label>
                      <input type="text"
                        placeholder={i === 0 ? "St. Xavier's High School, Surat" : i === 1 ? 'SVNIT / GTU, Surat' : 'University Name'}
                        value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Year</label>
                      <input type="text"
                        placeholder={i === 0 ? '2018 - 2020' : i === 1 ? '2020 - 2024' : '2024 - 2026'}
                        value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Score / CGPA / %</label>
                      <input type="text"
                        placeholder={i === 0 ? '85%' : '8.5 CGPA'}
                        value={edu.score} onChange={e => updateArrayItem('education', i, 'score', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayItem('education', emptyEdu)}>+ Add More (Masters / PhD)</button>
            </div>
          )}

          {/* Skills */}
          {has('skills') && (
            <div className="form-section">
              <h3><Wrench size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Skills</h3>
              <div className="form-group">
                <label htmlFor="skills">All skills (comma separated)</label>
                <textarea id="skills"
                  placeholder="Python, JavaScript, React, SQL, Data Analysis, Project Management..."
                  value={formData.skills} onChange={e => updateField('skills', e.target.value)} />
              </div>
            </div>
          )}

          {/* Projects */}
          {has('projects') && (
            <div className="form-section">
              <h3><FolderOpen size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Projects</h3>
              {formData.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 16, background: '#0A0A1A', borderRadius: 12 }}>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" placeholder="E-commerce Website"
                      value={proj.name} onChange={e => updateArrayItem('projects', i, 'name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Built a full-stack e-commerce platform..."
                      value={proj.description}
                      onChange={e => updateArrayItem('projects', i, 'description', e.target.value)}
                      style={{ minHeight: 70 }} />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input type="text" placeholder="React, Node.js, MongoDB"
                      value={proj.tech_used} onChange={e => updateArrayItem('projects', i, 'tech_used', e.target.value)} />
                  </div>
                  {formData.projects.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeArrayItem('projects', i)}>✕ Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addArrayItem('projects', emptyProject)}>+ Add More Projects</button>
            </div>
          )}

          {/* Certifications */}
          {has('certifications') && (
            <div className="form-section">
              <h3><Award size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />Certifications (Optional)</h3>
              <div className="form-group">
                <label htmlFor="certifications">Certifications (one per line)</label>
                <textarea id="certifications"
                  placeholder="AWS Certified Cloud Practitioner&#10;Google Data Analytics Certificate"
                  value={formData.certifications}
                  onChange={e => updateField('certifications', e.target.value)} />
              </div>
            </div>
          )}

          {/* Submit */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button type="button" className="btn-primary" onClick={handleFormSubmit}
              aria-label="Generate resume preview"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              <Bot size={18} style={{ marginRight: 8 }} />
              Generate Free Preview →
            </button>
            <p style={{ color: '#8080A0', fontSize: 12, marginTop: 8 }}>
              Preview is free — Pay only to download
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════ UPLOAD TAB ═══════════════ */}
      {tab === 'upload' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { icon: <FileText size={13} />, label: 'PDF' },
              { icon: <FileText size={13} />, label: 'Word (.docx)' },
              { icon: <FileText size={13} />, label: 'Image (JPG/PNG)' }
            ].map(f => (
              <span key={f.label} style={{
                background: '#1A1A3E', border: '1px solid #2A2A5A',
                borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#B0B0D0',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                {f.icon} {f.label}
              </span>
            ))}
          </div>

          <div
            className={`upload-area ${uploadedFile ? 'upload-success' : ''} ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button" tabIndex={0}
            aria-label="Upload resume file"
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          >
            <input type="file" ref={fileRef} accept={ACCEPTED_RESUME_TYPES}
              onChange={handleFileUpload} style={{ display: 'none' }} />

            {uploadedFile ? (
              <>
                <div className="icon">{fileIcon()}</div>
                <h3 style={{ color: '#00E676' }}>Uploaded!</h3>
                <p>{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(0)} KB)</p>
                <p style={{ color: '#B0B0D0', fontSize: 12, marginTop: 8 }}>Click to change file</p>
              </>
            ) : (
              <>
                <div className="icon"><Upload size={48} color="#8080A0" /></div>
                <h3>Upload Your Old Resume</h3>
                <p>Click here or drag & drop</p>
                <p style={{ color: '#8080A0', fontSize: 12, marginTop: 4 }}>
                  PDF • Word (.docx) • Image (JPG / PNG) • Max 10 MB
                </p>
              </>
            )}
          </div>

          <div className="form-card" style={{ marginTop: 24 }}>
            <div className="form-group">
              <label htmlFor="targetRoleUpload">Target Job Role (optional but recommended)</label>
              <input id="targetRoleUpload" type="text"
                placeholder="e.g., Software Engineer, Data Analyst"
                value={targetRole} onChange={e => { setTargetRole(e.target.value); setAnalysis(null); }} />
            </div>

            {/* Profile Photo */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#B0B0D0', marginBottom: 10, fontWeight: 500 }}>
                Profile Photo (optional — will appear on resume)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div onClick={() => photoRef.current?.click()} style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: profilePhoto ? '2px solid #FFD700' : '2px dashed #2A2A5A',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden', background: '#12122A', flexShrink: 0
                }}>
                  {profilePhoto
                    ? <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={24} color="#8080A0" />}
                </div>
                <div>
                  <button type="button" onClick={() => photoRef.current?.click()} style={{
                    background: 'transparent', border: '1px solid #FFD700', color: '#FFD700',
                    borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'Poppins, sans-serif'
                  }}>{profilePhoto ? 'Change Photo' : '+ Add Photo'}</button>
                  {profilePhoto && (
                    <button type="button" aria-label="Remove profile photo" onClick={() => { setProfilePhoto(null); toast('Photo removed', 'info'); }} style={{
                      background: 'transparent', border: '1px solid #FF4444', color: '#FF4444',
                      borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, marginLeft: 8, fontFamily: 'Poppins, sans-serif'
                    }}>Remove</button>
                  )}
                  <p style={{ color: '#8080A0', fontSize: 11, marginTop: 4 }}>JPG / PNG • max 3 MB</p>
                </div>
              </div>
            </div>

            {/* Analyze button */}
            {!analysis && (
              <button
                type="button"
                aria-label="Check ATS score"
                onClick={handleAnalyze} disabled={!uploadedFile || analyzing}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10, border: '2px solid #FFD700',
                  background: 'transparent', color: '#FFD700', fontSize: 15, fontWeight: 700,
                  cursor: uploadedFile ? 'pointer' : 'not-allowed', fontFamily: 'Poppins, sans-serif',
                  opacity: uploadedFile ? 1 : 0.5, marginBottom: 8, transition: 'all 0.2s'
                }}
              >
                {analyzing ? '🔍 Analyzing your resume…' : '🔍 Check ATS Score & Issues'}
              </button>
            )}

            {/* ATS Analysis Result */}
            {analysis && (
              <div style={{ marginBottom: 20 }}>
                {/* Score */}
                <div style={{
                  background: '#0A0A1A', borderRadius: 16, padding: '24px 20px',
                  marginBottom: 16, textAlign: 'center', border: '1px solid #2A2A5A'
                }}>
                  <p style={{ color: '#B0B0D0', fontSize: 13, marginBottom: 8 }}>Your ATS Score</p>
                  <div style={{
                    fontSize: 56, fontWeight: 900, lineHeight: 1,
                    color: analysis.ats_score >= 66 ? '#00E676' : analysis.ats_score >= 41 ? '#FFD700' : '#FF5252'
                  }}>{analysis.ats_score}<span style={{ fontSize: 24 }}>/100</span></div>
                  <div style={{
                    display: 'inline-block', marginTop: 8, padding: '3px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: analysis.ats_score >= 66 ? 'rgba(0,230,118,0.15)' : analysis.ats_score >= 41 ? 'rgba(255,215,0,0.15)' : 'rgba(255,82,82,0.15)',
                    color: analysis.ats_score >= 66 ? '#00E676' : analysis.ats_score >= 41 ? '#FFD700' : '#FF5252',
                    border: `1px solid ${analysis.ats_score >= 66 ? '#00E67650' : analysis.ats_score >= 41 ? '#FFD70050' : '#FF525250'}`
                  }}>{analysis.score_label}</div>
                  <p style={{ color: '#B0B0D0', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{analysis.summary}</p>
                </div>

                {/* What to update */}
                {analysis.what_to_update?.length > 0 && (
                  <div style={{ background: '#0A0A1A', borderRadius: 12, padding: '16px', marginBottom: 16, border: '1px solid #2A2A5A' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#FFD700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>What Needs Update</p>
                    {analysis.what_to_update.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ color: '#FFD700', fontSize: 12, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 13, color: '#B0B0D0' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Issues — all visible */}
                <div style={{ marginBottom: 4 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#FF5252', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Issues Found ({analysis.issues?.length || 0})
                  </p>

                  {analysis.issues?.map((issue, i) => {
                    const severityColor = issue.severity === 'high' ? '#FF5252' : issue.severity === 'medium' ? '#FFD700' : '#00E676';
                    return (
                      <div key={i} style={{
                        background: '#0A0A1A', border: `1px solid ${severityColor}40`,
                        borderRadius: 10, padding: '12px 14px', marginBottom: 8,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{issue.title}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                            background: severityColor + '20', color: severityColor, border: `1px solid ${severityColor}40`
                          }}>{issue.severity?.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#B0B0D0', lineHeight: 1.6 }}>{issue.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  className="btn-primary"
                  aria-label="Fix issues and rebuild resume"
                  onClick={handleUploadSubmit}
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 15 }}
                >
                  <Bot size={18} style={{ marginRight: 8 }} />
                  Fix All Issues — Build Better Resume →
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysis(null)}
                  style={{
                    width: '100%', marginTop: 8, padding: '10px', background: 'transparent',
                    border: '1px solid #2A2A5A', color: '#8080A0', borderRadius: 8,
                    cursor: 'pointer', fontSize: 12, fontFamily: 'Poppins, sans-serif'
                  }}
                >Re-analyze</button>
              </div>
            )}

            {!analysis && (
              <>
                <div style={{ textAlign: 'center', color: '#8080A0', fontSize: 12, margin: '8px 0' }}>— or —</div>
                <button
                  type="button"
                  className="btn-primary" onClick={handleUploadSubmit} disabled={!uploadedFile}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  <Bot size={18} style={{ marginRight: 8 }} />
                  Upgrade My Resume with AI
                </button>
                <p style={{ color: '#8080A0', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                  AI reads your resume and builds a better version • Preview free
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
