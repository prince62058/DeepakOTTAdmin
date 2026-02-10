'use client'
import { useGetCompanyQuery } from '@/lib/api'
import { useEffect } from 'react'

const DynamicBranding = () => {
  const { data: companyData } = useGetCompanyQuery()
  const defaultFavicon = '/assets/images/favicon-32x32.png'

  useEffect(() => {
    const faviconUrl = companyData?.data?.favIcon || defaultFavicon
    const link = document.querySelector("link[rel~='icon']")

    if (!link) {
      const newLink = document.createElement('link')
      newLink.rel = 'icon'
      newLink.href = faviconUrl
      document.getElementsByTagName('head')[0].appendChild(newLink)
    } else {
      link.href = faviconUrl
    }
  }, [companyData])

  return null
}

export default DynamicBranding
