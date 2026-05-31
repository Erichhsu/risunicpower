'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif',
          padding: '2rem', textAlign: 'center', background: '#f8f9fb',
        }}>
          <div style={{ fontSize: '4rem', fontWeight: 700, color: '#c44a2b', marginBottom: '0.5rem' }}>500</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f2a44', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7a8f', marginBottom: '1.5rem', maxWidth: 400 }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button onClick={reset}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '9999px', border: 'none',
              background: '#0f2a44', color: 'white', fontSize: '1rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >Try Again</button>
        </div>
      </body>
    </html>
  )
}
