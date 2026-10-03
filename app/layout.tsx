import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { SITE_URL, profile } from '@/data/profile';
import { education } from '@/data/education';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: profile.seo.title,
  description: profile.seo.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  authors: [{ name: profile.name, url: SITE_URL }],
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    type: 'profile',
    siteName: profile.name,
    title: profile.seo.shortTitle,
    description: profile.seo.socialDescription,
    url: '/',
    locale: 'en_AU',
    firstName: profile.firstName,
    lastName: profile.lastName,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${profile.name} — ${profile.title}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: profile.seo.shortTitle,
    description: profile.seo.socialDescription,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0e0f11',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.currentRole,
  description: profile.seo.personDescription,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.contact.email}`,
  sameAs: [profile.contact.linkedin, profile.contact.github],
  worksFor: { '@type': 'Organization', name: profile.currentEmployer },
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location.locality,
    addressRegion: profile.location.region,
    addressCountry: profile.location.country,
  },
  alumniOf: education.filter((e) => e.tertiary).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  knowsAbout: profile.seo.knowsAbout,
};

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${SITE_URL}/`,
  name: profile.seo.shortTitle,
  mainEntity: { '@type': 'Person', name: profile.name, url: `${SITE_URL}/` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS before paint so reveal animations never hide content from no-JS clients. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, profilePageJsonLd]) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
