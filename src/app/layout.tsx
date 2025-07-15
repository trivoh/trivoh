import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { EmailProvider } from "@/contexts/email-context"
import { Suspense } from "react"

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
    <html lang="en">
      <body className={inter.className}>
        <EmailProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </EmailProvider>
      </body>
    </html>
  )
}
