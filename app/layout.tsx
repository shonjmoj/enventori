import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// One family. Its width axis gives the condensed display voice and the regular text voice.
const archivo = Archivo({
  variable: "--font-archivo",
  // Only latin is preloaded; latin-ext stays in the CSS behind unicode-range
  // and downloads only if a page uses one of its characters.
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Billetterie",
  description: "Billetteries officielles des clubs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
