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
    "find parking in Abu Dhabi",
    "find parking Abu Dhabi",
    "parking app Abu Dhabi",
    "parking app UAE",
    "live parking Abu Dhabi",
    "live parking handover",
    "parking handover",
    "parking space Abu Dhabi",
    "Shabia parking",
    "Mohammed Bin Zayed City parking",
    "MBZ parking",
    "Mussafah parking",
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
        alt: "Park Habibi — find parking in Abu Dhabi",
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
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
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
    isAccessibleForFree: true,
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