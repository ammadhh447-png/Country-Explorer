import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.75" stroke="#0f172a" strokeWidth="1.65" />
          <ellipse cx="12" cy="12" rx="3.25" ry="8.75" stroke="#0f172a" strokeWidth="1.35" opacity="0.55" />
          <path d="M3.25 12h17.5" stroke="#0f172a" strokeWidth="1.35" opacity="0.55" strokeLinecap="round" />
          <path d="M12 6.25l2.35 6.75H9.65L12 6.25z" fill="#0f172a" />
          <path d="M12 17.75l-2.35-6.75h4.7L12 17.75z" fill="#0f172a" opacity="0.35" />
          <circle cx="12" cy="12" r="1.1" fill="#0f172a" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
