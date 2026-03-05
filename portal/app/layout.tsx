import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PORTAL UPT PLN MANADO",
  description: "UPT Manado Digital Ecosystem",
  icons: {
    icon: "/logoplnbaru.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // TAMBAHKAN: suppressHydrationWarning={true} DI SINI
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/logoplnbaru.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
