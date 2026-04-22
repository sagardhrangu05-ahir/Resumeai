import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { ToastProvider } from '../components/Toast';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Head>
        {/* Google Search Console verification — set NEXT_PUBLIC_GSC_VERIFICATION in .env */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} />
        )}

        {/* Default meta — individual pages override these via their own <Head> */}
        <meta name="description" content="AI-Powered Resume Builder — Get a professional, ATS-optimized resume in 2 minutes. Just ₹49." />
        <meta name="keywords" content="resume builder india, AI resume, ATS resume, free resume maker, job resume india" />

        {/* Open Graph defaults — per-page <Head> overrides og:url and og:title as needed */}
        <meta property="og:site_name" content="ResumeJet" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ResumeJet — AI Resume Builder India" />
        <meta property="og:description" content="Build a professional, ATS-optimized resume in 2 minutes. Just ₹49." />
        <meta property="og:url" content="https://resumejet.in" />
        <meta property="og:image" content="https://resumejet.in/og-image.png" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card defaults */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@resumejet" />
        <meta name="twitter:title" content="ResumeJet — AI Resume Builder India" />
        <meta name="twitter:description" content="Build a professional, ATS-optimized resume in 2 minutes. Just ₹49." />
        <meta name="twitter:image" content="https://resumejet.in/og-image.png" />

        {/* NOTE: canonical is intentionally NOT set here — each page sets its own canonical */}
      </Head>

      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}</Script>
        </>
      )}

      <Component {...pageProps} />
    </ToastProvider>
  );
}
