'use client'
import { useGetCompanyQuery } from '@/lib/api'
import { useEffect } from 'react'

const DynamicBranding = () => {
  const { data: companyData } = useGetCompanyQuery()
  useEffect(() => {
    const faviconUrl = companyData?.data?.favIcon || companyData?.data?.icon

    // Update standard icon
    const link = document.querySelector("link[rel~='icon']")
    if (!link) {
      const newLink = document.createElement('link')
      newLink.rel = 'icon'
      newLink.href = faviconUrl
      document.getElementsByTagName('head')[0].appendChild(newLink)
    } else {
      link.href = faviconUrl
    }

    // Update apple-touch-icon
    const appleLink = document.querySelector("link[rel='apple-touch-icon']")
    if (!appleLink) {
      const newLink = document.createElement('link')
      newLink.rel = 'apple-touch-icon'
      newLink.href = faviconUrl
      document.getElementsByTagName('head')[0].appendChild(newLink)
    } else {
      appleLink.href = faviconUrl
    }
  }, [companyData])

  return null
}

export default DynamicBranding
