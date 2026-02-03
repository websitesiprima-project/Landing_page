import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Import Toaster dari react-hot-toast
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitoring ATTB PLN",
  description: "Sistem Monitoring Aset Tidak Beroperasi",
  icons: {
    icon: "/Logo.png", // Opsional: Menambahkan favicon logo PLN
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 2. Pasang Toaster di sini agar notifikasi bisa muncul di seluruh aplikasi */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />

        {children}
      </body>
    </html>
  );
}
