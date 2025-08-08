import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Brandon Johnson - Cyber Range Developer',
  description: 'Professional portfolio of Brandon Johnson, Cyber Range Developer & Security Educator specializing in advanced training environments and cybersecurity curriculum development.',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  )
}
