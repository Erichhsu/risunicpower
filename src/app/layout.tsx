// src/app/layout.tsx — Root layout (required by Next.js 16: must export <html> and <body>)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
