// src/components/checkAuth.js
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function useAuthCheck() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const pathname = usePathname()

  // Read cookies on the client to stay consistent with middleware checks
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  useEffect(() => {
    // Prefer cookies (to match middleware), fallback to localStorage for backward compatibility
    const cookieAdminId = getCookie('adminId')
    const cookieToken = getCookie('adminToken')
    const lsAdminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null
    const lsToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

    const adminId = cookieAdminId || lsAdminId
    const token = cookieToken || lsToken

    const isAuthed = Boolean(adminId && token)

    // If we're on the root path, push the user to the correct destination explicitly
    if (pathname === '/') {
      if (isAuthed) {
        // Mirror middleware behavior
        router.replace('/dashboard')
      } else {
        router.replace('/auth/sign-in')
      }
      return
    }

    // For other pages, simply finish checking and let middleware guard server-side
    setChecking(false)
  }, [router, pathname])

  return checking
}
