import { Providers } from "./providers";
import { Inter, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Rohit Kumar — Full Stack Developer",
  description:
    "Portfolio of Rohit Kumar, a software developer building modern web applications and real-time systems with React, Next.js, Node.js and WebRTC.",
  openGraph: {
    title: "Rohit Kumar — Full Stack Developer",
    description:
      "Building modern web applications and real-time systems with React, Next.js, Node.js and WebRTC.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${editorial.variable} ${mono.variable}`}
    >
      <body className="bg-bg font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
