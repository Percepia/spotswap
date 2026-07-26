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
  title: "Park Habibi | Live Parking Handovers in Abu Dhabi",
  description:
    "Find and share live parking handovers in Abu Dhabi. Reserve a spot from someone who is leaving and stop circling for parking.",
  locale: "en_AE",
  location: "Abu Dhabi, United Arab Emirates",
};