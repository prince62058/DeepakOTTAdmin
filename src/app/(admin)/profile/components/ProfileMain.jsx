'use client'

import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import TextFormInput from '@/components/form/TextFormInput'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetUserProfileQuery, useUpdateProfileMutation, useUploadImageMutation } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormLabel, FormSelect, Row, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProfileMain = () => {
  const iconRef = useRef()
  const [loading, setLoading] = useState(false)

  const { data: userProfile } = useGetUserProfileQuery({
    userId: typeof window !== 'undefined' ? localStorage.getItem('adminId') : null,
  })

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      image: null,
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (userProfile) {
      reset({
        image: userProfile?.data?.image,
        name: userProfile?.data?.name,
        email: userProfile?.data?.email,
      })
    } else {
      reset({
        image: null,
        name: '',
        email: '',
      })
    }
  }, [userProfile, reset])

  const onChangeIcon = (file) => {
    const { files } = file.target
    if (files && files.length !== 0) {
      setValue('image', files[0])
    }
  }

  const handleIconChange = () => {
    iconRef.current.click()
  }

  const [uploadImg] = useUploadImageMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let imageUrl = data.image

      // 1️⃣ Upload image if it's a File (not already a URL)
      if (data.image && typeof data.image !== 'string') {
        const formData = new FormData()
        formData.append('image', data.image)

        const res = await uploadImg(formData).unwrap()
        if (res?.success) {
          imageUrl = res?.URL || ''
        } else {
          setLoading(false)
          return
        }
      }

      // 2️⃣ Prepare final payload
      const rawData = {}
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          rawData[key] = data[key]
        }
      }
      rawData.image = imageUrl

      const res = await updateProfile({ data: { ...rawData, userId: userProfile?.data?._id } }).unwrap()
      if (res?.sucess) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        reset({
          image: null,
          name: '',
          email: '',
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'User profile update error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
    setLoading(false)
  }
  return (
    <Row className="justify-content-center">
      <Col xs={1.5}></Col>
      <Col xs={9} className="mx-auto">
        <Card className="overflow-hidden">
          <CardBody>
            <div className="bg-primary profile-bg rounded-top position-relative mx-n3 mt-n3" style={{ height: 120 }}>
              <Image
                width={100}
                height={100}
                src={watch('image') instanceof File ? URL.createObjectURL(watch('image')) : watch('image') || avatar1}
                alt="avatar"
                className="avatar-xl border border-light border-3 rounded-circle position-absolute top-100 start-50 translate-middle"
              />
              <input type="file" className="form-control" ref={iconRef} onChange={onChangeIcon} accept="image/png, image/jpeg" hidden />
              {/* <Button className="position-absolute top-100 start-50 translate-middle" onClick={handleIconChange}>
                Upload Image
              </Button> */}
              <button className="btn btn-soft-primary btn-sm position-absolute top-100 start-50 translate-middle mt-4 ms-3" type="button">
                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" onClick={handleIconChange} />
              </button>
            </div>
            <div className="mt-5 d-flex flex-column align-items-center justify-content-center text-center">
              <div>
                <h4 className="mb-1">
                  {userProfile?.data?.name || 'User Name'} <IconifyIcon icon="bxs:badge-check" className="text-success align-middle" />
                </h4>
                <p className="mb-0"> {userProfile?.data?.userType || 'Admin'}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xs={1.5}></Col>
      <Col xs={9}>
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
          {/* <Col md={12}>
            <div className="d-flex flex-column align-items-center gap-2 mb-2">
              <Image
                width={100}
                height={100}
                src={watch('image') instanceof File ? URL.createObjectURL(watch('image')) : watch('image') || avatar1}
                alt="avatar"
                className="avatar-xl rounded-circle border border-light border-3"
              />
              <input type="file" className="form-control" ref={iconRef} onChange={onChangeIcon} accept="image/png, image/jpeg" hidden />
              <Button onClick={handleIconChange}>Upload Image</Button>
            </div>
          </Col> */}
          <Col md={12}>
            <TextFormInput name="name" required type="text" label="Name" control={control} />
          </Col>
          <Col md={12}>
            <TextFormInput name="email" disabled type="email" label="Email" control={control} />
          </Col>
          <Col xs={12}>
            <Button type="submit" variant="primary" className="w-25 mx-auto d-flex justify-content-center" disabled={loading}>
              Update
            </Button>
          </Col>
        </form>
      </Col>
    </Row>
  )
}
export default ProfileMain
