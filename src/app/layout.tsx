import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Chloe's Math Lab - Learn Proportional Relationships & Circles",
  description: 'An interactive math learning website for 6th graders',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Chloe's Math Lab",
    description: 'An interactive math learning website for 6th graders covering proportional relationships and circles.',
    type: 'website',
    url: 'https://chloesmathlab.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen pb-8">
          {children}
        </main>
      </body>
    </html>
  )
}
