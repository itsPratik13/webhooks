import type { Metadata } from "next";
import { Geist, Geist_Mono,Manrope } from "next/font/google";
import { ThemeProvider } from "./components/themeProvider";
import "./globals.css";
import DashboardWrapper from "./components/DashboardWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const manRope=Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WebHook Tester",
  description: "Test your webhooks and maintain a personalized dashboard to monitor all your webhook activities in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={`${manRope.variable} ${geistMono.variable} antialiased`}
        ><DashboardWrapper>
          {children}
          </DashboardWrapper>
        </body>
      </ThemeProvider>
    </html>
  );
}
