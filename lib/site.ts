const vercelProductionUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;

function normalizeUrl(url: string) {
  const value = url.trim().replace(/\/+$/, "");

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

export const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    vercelProductionUrl ||
    "http://localhost:3000"
);

export const siteConfig = {
  name: "Park Habibi",
  shortName: "Park Habibi",
  url: siteUrl,
  title: "Park Habibi | Find Parking in Abu Dhabi",
  description:
    "Find parking in Abu Dhabi without circling. Park Habibi connects drivers leaving parking spaces with drivers looking for one through secure, live parking handovers. Save time, fuel, and frustration.",
  locale: "en_AE",
  location: "Abu Dhabi, United Arab Emirates",
};