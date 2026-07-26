import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,

  keywords: [
    "parking Abu Dhabi",
    "find parking Abu Dhabi",
    "live parking Abu Dhabi",
    "parking handover",
    "parking space Abu Dhabi",
    "Shabia parking",
    "Mohammed Bin Zayed City parking",
    "Mussafah parking",
    "UAE parking app",
    "Park Habibi",
  ],

  authors: [
    {
      name: "Torque",
    },
  ],

  creator: "Torque",
  publisher: "Park Habibi",

  category: "technology",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Park Habibi — live parking handovers in Abu Dhabi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  manifest: "/manifest.webmanifest",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    alternateName: "Park Habibi Parking App",
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "NavigationApplication",
    operatingSystem: "Web",
    areaServed: {
      "@type": "City",
      name: "Abu Dhabi",
      containedInPlace: {
        "@type": "Country",
        name: "United Arab Emirates",
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    creator: {
      "@type": "Organization",
      name: "Torque",
    },
  };

  return (
    <html lang="en">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
      </body>
    </html>
  );
}