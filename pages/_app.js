import '../styles/globals.css';
import Head from 'next/head';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ResumeAI',
  url: 'https://resumejet.in',
  logo: 'https://resumejet.in/og-image.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'sagardhrangu05@gmail.com',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Gujarati'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Surat',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
