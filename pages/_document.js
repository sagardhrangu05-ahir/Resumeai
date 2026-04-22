import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en-IN">
      <Head>
        {/* ── Robots & indexing ── */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* ── Language & geo ── */}
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Surat, Gujarat, India" />
        <meta name="geo.position" content="21.1702;72.8311" />
        <meta name="ICBM" content="21.1702, 72.8311" />

        {/* ── Author & publisher ── */}
        <meta name="author" content="ResumeJet" />
        <meta name="publisher" content="ResumeJet" />
        <meta name="copyright" content="ResumeJet 2026" />

        {/* ── Mobile & PWA ── */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ResumeJet" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── Favicons ── */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />

        {/* ── Sitemap ── */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* ── Hreflang ── */}
        <link rel="alternate" hrefLang="en-IN" href="https://resumejet.in/" />
        <link rel="alternate" hrefLang="hi-IN" href="https://resumejet.in/hi/" />
        <link rel="alternate" hrefLang="gu-IN" href="https://resumejet.in/gu/" />
        <link rel="alternate" hrefLang="x-default" href="https://resumejet.in/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
