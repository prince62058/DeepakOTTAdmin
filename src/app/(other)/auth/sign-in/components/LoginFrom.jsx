'use client'

import TextFormInput from '@/components/form/TextFormInput'
import Link from 'next/link'
import { Button, FormCheck } from 'react-bootstrap'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdminLoginMutation } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'

const LoginFrom = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: 'admin@ott.com',
      password: 'Admin@123',
    },
  })

  const [adminLogin] = useAdminLoginMutation()

  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await adminLogin(data).unwrap()
      if (res?.success) {
        // Persist in both cookies (for middleware) and localStorage (legacy/client)
        setCookie('adminToken', res?.data?.token)
        setCookie('adminId', res?.data?._id)
        localStorage.setItem('adminToken', res?.data?.token)
        localStorage.setItem('adminId', res?.data?._id)
        // Ensure permissions are stored as a string (localStorage only accepts strings)
        localStorage.setItem('userData', JSON.stringify(res?.data))
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        const redirectTo = searchParams?.get('redirectTo') || '/dashboard'
        push(redirectTo)
        reset({ email: '', password: '' })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'login error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
    setLoading(false)
  }

  // Do not auto-redirect on the sign-in page based on client-side cookies.
  // If the user is already authenticated, middleware will redirect away from /auth/*.

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />

      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id"
        label={
          <>
            {/* <Link href="/auth/reset-pass" className="float-end text-muted text-unline-dashed ms-1">
              Reset password
            </Link> */}
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
          </>
        }
      />
      {/* <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div> */}
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
export default LoginFrom
