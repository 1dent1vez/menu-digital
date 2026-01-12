import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner"; // <--- 1. Importamos el Toaster
import "./globals.css";
import config from "@/data/config.json";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}` 
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `%s | ${config.businessName}`,
    default: config.businessName,
  },
  description: `Mira el menú de ${config.businessName}, arma tu pedido y envíalo directamente a nuestro WhatsApp.`,
  openGraph: {
    title: config.businessName,
    description: "¡Pide tus favoritos a domicilio o para llevar aquí!",
    url: "/",
    siteName: config.businessName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image-1.jpg",
        width: 1200,
        height: 630,
        alt: `Menú digital de ${config.businessName}`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
        {/* 2. Agregamos el componente aquí. "richColors" hace que los éxitos sean verdes y errores rojos automáticamente */}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}