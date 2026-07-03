import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ascendia Imo-PDF",
  description: "Gerador de apresentacoes PDF para clientes compradores."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
