import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Park Habibi — live parking handovers in Abu Dhabi";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 55%, #022c22 100%)",
          color: "white",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.20)",
            filter: "blur(80px)",
            top: "-160px",
            left: "-100px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "360px",
            borderRadius: "9999px",
            background: "rgba(6, 182, 212, 0.14)",
            filter: "blur(80px)",
            right: "-80px",
            bottom: "-140px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "26px",
                background: "#10b981",
                color: "#020617",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "50px",
                fontWeight: 900,
              }}
            >
              P
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "42px",
                fontWeight: 800,
              }}
            >
              Park Habibi
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "72px",
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-3px",
                maxWidth: "950px",
              }}
            >
              No more circling for parking.
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "26px",
                fontSize: "31px",
                color: "#a7f3d0",
              }}
            >
              Live parking handovers in Abu Dhabi
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "23px",
              color: "#94a3b8",
            }}
          >
            Find a driver leaving. Reserve. Park.
          </div>
        </div>
      </div>
    ),
    size
  );
}