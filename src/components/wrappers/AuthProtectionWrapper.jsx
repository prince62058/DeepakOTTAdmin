'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import FallbackLoading from '../FallbackLoading'

const AuthProtectionWrapper = ({ children }) => {
  const pathname = usePathname()

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : null
  }

  useEffect(() => {
    // Client-side redirect can conflict when cookies are HttpOnly.
    // Rely on middleware for guarding. Keep this effect to potentially add client telemetry later.
    getCookie('adminToken')
    getCookie('adminId')
  }, [pathname])

  // Show a lightweight fallback while the effect runs (avoids flicker)
  return <Suspense fallback={<FallbackLoading />}>{children}</Suspense>
}

export default AuthProtectionWrapper