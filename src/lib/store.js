// src/lib/store.js
import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      // add other reducers here
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  })
}
