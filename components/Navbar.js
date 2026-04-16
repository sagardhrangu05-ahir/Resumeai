import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar({ showCTA = true, onHowItWorksClick }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          ResumeJet
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {onHowItWorksClick && (
            <button
              className="nav-link"
              onClick={() => { onHowItWorksClick(); closeMenu(); }}
            >
              How It Works
            </button>
          )}
          <a href="/#features" className="nav-link" onClick={closeMenu}>
            Features
          </a>
          <a href="/#types" className="nav-link" onClick={closeMenu}>
            Resume Types
          </a>
          {showCTA && (
            <button
              className="btn-primary nav-cta"
              onClick={() => { router.push('/select-type'); closeMenu(); }}
            >
              Start Free Preview →
            </button>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
