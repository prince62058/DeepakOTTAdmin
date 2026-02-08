'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormLabel, FormSelect, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { useGetCompanyQuery, useSendNotificationMutation, useUpdateCompanyMutation, useUploadImageMutation } from '@/lib/api'
import ReactQuill from 'react-quill'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'

// styles
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import Image from 'next/image'

const NotificationForm = () => {
  const imageRef = useRef()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      userId: '',
      image: '',
      title: '',
      message: '',
      userType: 'User',
      sendAll: true,
    },
  })

  const [sendNotification] = useSendNotificationMutation()
  const [uploadImg] = useUploadImageMutation()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let imageUrl = data.image

      if (watch('image') === '') {
        setLoading(false)
        return toast.error('Please upload an image', {
          position: 'top-right',
          autoClose: 2000,
          closeButton: false,
        })
      }

      // 1️⃣ Upload image if it's a File (not already a URL)
      if (data.image && typeof data.image !== 'string') {
        const formData = new FormData()
        formData.append('image', data.image)

        const res = await uploadImg(formData).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 1000,
            closeButton: false,
          })
          imageUrl = res?.URL || ''
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 2000,
            closeButton: false,
          })
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

      // 3️⃣ Send notification
      const res = await sendNotification(rawData).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        reset({
          userId: '',
          image: '',
          title: '',
          message: '',
          userType: 'User',
          sendAll: true,
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'notification error')
    }
    setLoading(false)
  }

  const onChangeImage = (file) => {
    const { files } = file.target
    if (files && files.length !== 0) {
      setValue('image', files[0])
    }
  }

  const handleImageChange = () => {
    imageRef.current.click()
  }

  const modules = {
    toolbar: [
      [
        {
          font: [],
        },
        {
          size: [],
        },
      ],
      ['bold', 'italic', 'underline', 'strike'],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
      [
        {
          script: 'super',
        },
        {
          script: 'sub',
        },
      ],
      [
        {
          header: [false, 1, 2, 3, 4, 5, 6],
        },
        'blockquote',
        'code-block',
      ],
      [
        {
          list: 'ordered',
        },
        {
          list: 'bullet',
        },
        {
          indent: '-1',
        },
        {
          indent: '+1',
        },
      ],
      [
        'direction',
        {
          align: [],
        },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
              <IconifyIcon icon="solar:settings-bold-duotone" className="text-primary fs-20" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                {/* <DropzoneFormInput
                  className="py-5"
                  iconProps={{
                    icon: 'bx:cloud-upload',
                    height: 48,
                    width: 48,
                    className: 'mb-4 text-primary',
                  }}
                  multiple={false}
                  name="image"
                  text="Drop your images here, or click to browse"
                  helpText={<span className="text-muted fs-13 ">(150 x 150 recommended. PNG, JPG and GIF files are allowed )</span>}
                  showPreview
                  onFileUpload={handleUplaodImage}
                /> */}
                <div className="d-flex flex-column align-items-center gap-2 mb-2">
                  <Image
                    width={100}
                    height={100}
                    src={watch('image') instanceof File ? URL.createObjectURL(watch('image')) : avatar1}
                    alt="avatar"
                    className="avatar-xl rounded-circle border border-light border-3"
                  />
                  <input type="file" className="form-control" ref={imageRef} onChange={onChangeImage} accept="image/png, image/jpeg" hidden />
                  <Button onClick={handleImageChange}>Upload Image</Button>
                </div>
              </Col>
              <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
                <Col md={6}>
                  <TextFormInput name="title" required type="text" label="Title*" control={control} />
                </Col>
                <Col md={6}>
                  <div>
                    <FormLabel htmlFor="userType-select">Select User Type</FormLabel>
                    <Controller
                      name="userType"
                      control={control}
                      disabled
                      render={({ field }) => (
                        <FormSelect id="userType-select" {...field}>
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                          <option value="SubAdmin">SubAdmin</option>
                        </FormSelect>
                      )}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <TextAreaFormInput name="message" required label="Message*" control={control} rows={5} />
                </Col>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-25 mt-2 d-flex align-items-center justify-content-center mx-auto">
                  Send
                </Button>
              </form>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default NotificationForm
