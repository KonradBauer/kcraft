import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Dr inż. Michał Macherzyński — Inżynier spawalnik, IWE / IWI / VT2 / PT2',
  title: 'MCRAFT — Dr inż. Michał Macherzyński',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Barlow:wght@300;400;500;600&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
