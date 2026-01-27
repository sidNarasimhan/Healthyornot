import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthyOrNot - AI Food Label Scanner",
  description: "Scan food labels and get instant health insights powered by AI",
  keywords: ["food scanner", "nutrition", "health", "AI", "food labels", "healthy eating"],
  openGraph: {
    title: "HealthyOrNot - AI Food Label Scanner",
    description: "Scan any food label and get instant health insights powered by AI",
    type: "website",
    url: "https://healthyornot.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthyOrNot - AI Food Label Scanner",
    description: "Scan any food label and get instant health insights powered by AI",
  },
  metadataBase: new URL("https://healthyornot.app"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
