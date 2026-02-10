'use client'
import { useGetCompanyQuery } from '@/lib/api'
import Image from 'next/image'

const FallbackLoading = () => {
  const { data: companyData } = useGetCompanyQuery()
  const loaderUrl = companyData?.data?.loader || companyData?.data?.icon

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw' }}>
      <div className="text-center">
        {loaderUrl ? (
          <div className="loader-wrapper">
            <Image src={loaderUrl} alt="Loading..." width={80} height={80} style={{ objectFit: 'contain' }} className="pulse-animation" />
          </div>
        ) : (
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
      <style jsx>{`
        .pulse-animation {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  )
}
export default FallbackLoading
