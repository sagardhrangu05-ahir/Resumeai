import '../styles/globals.css';
import Head from 'next/head';
import { ToastProvider } from '../components/Toast';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-Powered Resume Builder — Get a professional, ATS-optimized resume in 2 minutes. Just ₹49." />
        <title>ResumeJet — AI Resume Builder India | ₹49 = 2 Downloads</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
    </ToastProvider>
  );
}
