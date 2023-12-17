import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Incor - Mi Portal",
  description: "Incor Centro Médico",
};

const nunito = Nunito({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        type="image/png"
        sizes="16x16"
        rel="icon"
        href="https://incor-ranking.s3.us-east-1.amazonaws.com/storage/images/iso-incor-web.png"
      />
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
