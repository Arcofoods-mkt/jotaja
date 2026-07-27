import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const caflischScript = localFont({
  src: "../../public/Fontes/Caflisch Script Pro Light.otf",
  variable: "--font-display",
  weight: "300",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Arcofoods | Jotajá Summit",
  description: "O evento que vai revolucionar o seu negócio.",
  icons: {
    icon: "/Imagens/arcofoods-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${caflischScript.variable}`}>
      <body>{children}</body>
    </html>
  );
}
