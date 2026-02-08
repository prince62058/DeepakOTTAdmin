// middleware.js (root level)
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value
  const adminId = request.cookies.get('adminId')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware: path =', pathname)

  // If visiting "/" and logged in → redirect to /dashboard
  if (pathname === '/' && token && adminId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If visiting /dashboard and not logged in → redirect to /auth/sign-in
  if (pathname.startsWith('/dashboard') && (!token || !adminId)) {
    const url = new URL('/auth/sign-in', request.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If visiting /auth while logged in → redirect to /dashboard
  if (pathname.startsWith('/auth') && token && adminId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
}
