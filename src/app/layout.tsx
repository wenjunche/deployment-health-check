import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OpenFin Deployment Health Check",
  description: "OpenFin Deployment Health Check",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <main>{children} </main> <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
