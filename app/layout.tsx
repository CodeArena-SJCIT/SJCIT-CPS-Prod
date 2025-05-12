import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers" // <-- Import the new wrapper

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'sjcit.cps.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
