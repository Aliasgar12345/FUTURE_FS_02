import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weather Deshboard ',
  description: "Get real-time weather information...",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
