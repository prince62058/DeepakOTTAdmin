'use client'

import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetUserProfileQuery } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
const ProfileDropdown = () => {
  const router = useRouter()

  const handleLogout = async (e) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      // Helper to remove cookies set for auth
      const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
      }
      try {
        localStorage.clear()
        deleteCookie('adminToken')
        deleteCookie('adminId')
        // Also clear HttpOnly cookies via server
      } catch (err) {
        // ignore localStorage errors in unusual environments
      }
      router.replace('/auth/sign-in')
    }
  }

  const { data: userProfile } = useGetUserProfileQuery({
    userId: typeof window !== 'undefined' ? localStorage.getItem('adminId') : null,
  })

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown "
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image className="rounded-circle" width={32} height={32} src={userProfile?.data?.image ?? avatar1} alt="avatar-3" />
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as={'h6'} className="dropdown-header">
          Welcome {userProfile?.data?.name ? userProfile?.data?.name : 'Admin!'}
        </DropdownHeader>
        <DropdownItem as={Link} href="/profile">
          <IconifyIcon icon="bx:user-circle" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        {/* <DropdownItem as={Link} href="/apps/chat">
          <IconifyIcon icon="bx:message-dots" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Messages</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/pages/pricing">
          <IconifyIcon icon="bx:wallet" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/support/faqs">
          <IconifyIcon icon="bx:help-circle" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Help</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/auth/lock-screen">
          <IconifyIcon icon="bx:lock" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Lock screen</span>
        </DropdownItem>
        <div className="dropdown-divider my-1" /> */}
        <DropdownItem as={Link} className=" text-danger" href="#" onClick={handleLogout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
export default ProfileDropdown
