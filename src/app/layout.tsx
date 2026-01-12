import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import config from "@/data/config.json"; // <--- Importamos los datos de tu negocio

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

// URL base para resolver la imagen (cámbialo por tu dominio real en producción)
// Si usas Vercel, esto suele configurarse solo con process.env.VERCEL_URL, 
// pero es mejor definirlo explícitamente.
const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}` 
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `%s | ${config.businessName}`,
    default: config.businessName, // Ej: "Luna Brava Cafe"
  },
  description: `Mira el menú de ${config.businessName}, arma tu pedido y envíalo directamente a nuestro WhatsApp. Rápido y sin filas.`,
  
  // Configuración para WhatsApp, Facebook, LinkedIn
  openGraph: {
    title: config.businessName,
    description: "¡Pide tus favoritos a domicilio o para llevar aquí!",
    url: "/",
    siteName: config.businessName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image.png", // <--- DEBES CREAR ESTA IMAGEN EN LA CARPETA PUBLIC
        width: 1200,
        height: 630,
        alt: `Menú digital de ${config.businessName}`,
      },
    ],
  },

  // Configuración para Twitter/X
  twitter: {
    card: "summary_large_image",
    title: config.businessName,
    description: "Menú digital para pedidos vía WhatsApp.",
    images: ["/og-image.png"],
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
      </body>
    </html>
  );
}