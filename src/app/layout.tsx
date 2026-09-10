import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centro Medico Digital | Tu salud, a un clic de distancia",
  description:
    "Gestiona tus turnos y consultas medicas de forma rapida y segura. Reserva online, cartilla medica y mas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
