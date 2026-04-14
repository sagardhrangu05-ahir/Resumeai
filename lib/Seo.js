import Head from 'next/head';

const SITE_URL = 'https://resumejet.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function Seo({
  title,
  description,
  canonical,
  noIndex = false,
  ogType = 'website',
}) {
  const fullTitle = title
    ? `${title} | ResumeAI`
    : 'ResumeAI — AI Resume Builder India | ATS-Optimized Resume ₹49';
  const metaDescription =
    description ||
    'Build a professional, ATS-optimized resume in 2 minutes with AI. Just ₹49. Perfect for Indian job seekers — instant PDF download.';
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : null;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="ResumeAI" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Head>
  );
}
