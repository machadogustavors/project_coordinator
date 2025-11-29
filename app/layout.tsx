import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ProtectedLayout } from "@/app/providers/ProtectedLayout";
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
  title: "DeltaWave",
  description: "Gerenciador de projetos e tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthProvider>
            <ProtectedLayout>
              {children}
            </ProtectedLayout>
          </AuthProvider>
        </StoreProvider>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
