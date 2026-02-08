'use server'

import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  // Expire auth cookies server-side so middleware stops treating the user as authenticated
  res.cookies.set('adminToken', '', { path: '/', expires: new Date(0) })
  res.cookies.set('adminId', '', { path: '/', expires: new Date(0) })
  return res
}
