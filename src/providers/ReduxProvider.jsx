'use client'

import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store' // or '../lib/store' depending on your path

export default function ReduxProvider({ children, preloadedState }) {
  // create store once per client session
  const storeRef = useRef()
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
