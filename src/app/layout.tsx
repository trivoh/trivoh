import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { EmailProvider } from "@/contexts/email-context"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import LoadingUI from "@/components/loading-ui"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern Email Client",
  description: "A modern, responsive email client built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <EmailProvider>
            <Suspense fallback={<LoadingUI />}>{children}</Suspense>
          </EmailProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}