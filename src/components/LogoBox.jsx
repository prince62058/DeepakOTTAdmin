'use client'
import logoDark from '@/assets/images/Deepak.png'
import logoLight from '@/assets/images/Deepak.png'
// import logoSm from '@/assets/images/logo-sm.png';
import Image from 'next/image'
import Link from 'next/link'
import { useGetCompanyQuery } from '@/lib/api'

const LogoBox = () => {
  const { data: companyData } = useGetCompanyQuery()
  const logoUrl = companyData?.data?.icon

  return (
    <div className="logo-box">
      <Link href="/" className="logo-dark">
        {/* <Image src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" /> */}
        <Image
          src={logoUrl || logoDark}
          height={24}
          width={112}
          className="logo-lg"
          alt="logo dark"
          style={{ objectFit: 'contain' }} // Ensure logo fits well
        />
      </Link>
      <Link href="/" className="logo-light">
        {/* <Image src={logoSm} width={28} height={26} className="logo-sm" alt="logo sm" /> */}
        <Image src={logoUrl || logoLight} height={24} width={112} className="logo-lg" alt="logo light" style={{ objectFit: 'contain' }} />
      </Link>
    </div>
  )
}
export default LogoBox
