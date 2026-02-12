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
  const favIconUrl = companyData?.data?.favIcon

  return (
    <div className="logo-box">
      <Link href="/" className="logo-dark">
        <Image src={favIconUrl || logoUrl || logoDark} width={50} height={50} className="logo-sm" alt="logo sm" style={{ objectFit: 'contain' }} />
        <Image
          src={logoUrl || logoDark}
          height={60}
          width={180}
          className="logo-lg"
          alt="logo dark"
          style={{ objectFit: 'contain' }} // Ensure logo fits well
        />
      </Link>
      <Link href="/" className="logo-light">
        <Image src={favIconUrl || logoUrl || logoLight} width={50} height={50} className="logo-sm" alt="logo sm" style={{ objectFit: 'contain' }} />
        <Image src={logoUrl || logoLight} height={60} width={180} className="logo-lg" alt="logo light" style={{ objectFit: 'contain' }} />
      </Link>
    </div>
  )
}
export default LogoBox
