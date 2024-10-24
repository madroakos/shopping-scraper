import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart shopper",
  description: "Compare prices from different stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <h1 className="font-bold text-3xl text-center p-6">Smart shopper</h1>
        {children}
      </body>
    </html>
  );
}
