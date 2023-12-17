import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SessionAuthProvider from "@/context/SessionAuthProviders";

export const metadata: Metadata = {
  title: "Incor - Mi Portal",
  description: "Incor Centro Médico",
};

const roboto = Roboto({
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
      <body className={roboto.className}>
        <SessionAuthProvider>
          <Providers>{children}</Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
