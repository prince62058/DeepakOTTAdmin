// src/app/page.jsx (or wherever your “HomePage” is; ensure it’s a client component)
'use client'

import React from 'react'
import useAuthCheck from '@/hooks/useAuthCheck'

export default function HomePage() {
  const checking = useAuthCheck()

  if (checking) {
    // Still verifying — you can show a loader or nothing
    return null // or <div>Loading…</div>
  }

  // Now that checking is done, we know the user is authenticated
  return (
    <div>
      <h1>Home Page</h1>
      <p>If you&apos;re not signed in, you&rsquo;ll be redirected.</p>
    </div>
  )
}
