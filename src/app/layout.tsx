import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { Toaster } from "sonner";


const font = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Stockify",
  description: "Your stock managing partner",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("activeTheme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled")
  return (
   
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {children}
            <Toaster position="top-right" richColors />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
