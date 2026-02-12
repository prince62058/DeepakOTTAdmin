'use client'

import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import {
  useCreateGenreMutation,
  useCreateLanguageMutation,
  useCreateSubAdminMutation,
  useCreateSubscriptionMutation,
  useUpdateGenreMutation,
  useUpdateProfileMutation,
  useUpdateSubscriptionMutation,
  useUploadImageMutation,
} from '@/lib/api'
import CryptoJS from 'crypto-js'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'

const SubAdminForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const imageRef = useRef()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      image: '',
      email: '',
      password: '',
      permissions: [],
    },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      let decryptedPassword = ''
      if (currentData?.subAdminPassword) {
        try {
          const bytes = CryptoJS.AES.decrypt(currentData.subAdminPassword, 'mySecretKey123')
          decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)
        } catch (err) {
          console.error('Decryption failed:', err)
        }
      }

      reset({
        name: currentData?.name,
        image: currentData?.image,
        email: currentData?.email,
        password: decryptedPassword,
        permissions: currentData?.permissions,
      })
    } else {
      reset({
        name: '',
        image: '',
        email: '',
        password: '',
        permissions: [],
      })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [uploadImg] = useUploadImageMutation()
  const [createSubAdmin] = useCreateSubAdminMutation()
  const [updateSubAdmin] = useUpdateProfileMutation()

  const onSubmit = async (data) => {
    if (isUpdate) {
      setLoading(true)
      try {
        let imageUrl = data.image

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
        const rawData = { userId: currentData?._id }
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            if (key === 'password' && data[key] === '') {
              continue
            }
            rawData[key] = data[key]
          }
        }
        rawData.image = imageUrl

        const res = await updateSubAdmin({ data: rawData }).unwrap()
        if (res?.sucess) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ name: '', image: '', email: '', password: '', permissions: [] })
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
        }
      } catch (error) {
        console.log(error, 'genre update error')
        toast.error(error?.data?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
      setLoading(false)
    } else {
      setLoading(true)
      try {
        // 2️⃣ Prepare final payload
        const rawData = {}
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            rawData[key] = data[key]
          }
        }
        // rawData.image = imageUrl

        const res = await createSubAdmin(rawData).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ name: '', image: '', email: '', password: '', permissions: [] })
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
        }
      } catch (error) {
        console.log(error, 'genre create error')
        toast.error(error?.data?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
      setLoading(false)
    }
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

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          {isUpdate ? 'Edit' : 'Create'} Sub Admin
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
          {isUpdate && (
            <Col md={12}>
              <div className="d-flex flex-column align-items-center gap-2 mb-2">
                <Image
                  width={100}
                  height={100}
                  src={watch('image') instanceof File ? URL.createObjectURL(watch('image')) : watch('image') || avatar1}
                  alt="avatar"
                  className="avatar-xl rounded-circle border border-light border-3"
                />
                <input type="file" className="form-control" ref={imageRef} onChange={onChangeImage} accept="image/png, image/jpeg" hidden />
                <Button onClick={handleImageChange}>Upload Image</Button>
              </div>
            </Col>
          )}
          <Col md={12} mt={8}>
            <TextFormInput name="name" required type="text" label="Name*" control={control} />
          </Col>
          <Col md={12}>
            <TextFormInput name="email" required type="email" label="Email*" control={control} />
          </Col>
          <Col md={12}>
            <TextFormInput
              name="password"
              required={!isUpdate}
              type="text"
              label={isUpdate ? 'Password (Leave blank to keep unchanged)' : 'Password*'}
              control={control}
            />
          </Col>
          <Col md={12}>
            <label htmlFor="choices-multiple-remove-button" className="form-label">
              Permissions*
            </label>
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <ChoicesFormInput
                  className="form-control"
                  id="choices-multiple-remove-button"
                  multiple
                  required
                  value={field.value || []}
                  onChange={(selected) => field.onChange(selected)}
                  options={{
                    removeItemButton: true,
                    position: 'bottom', // 👈 set dropdown direction to open upwards
                  }}>
                  <option value="User">User</option>
                  <option value="Language">Language</option>
                  <option value="Notification">Notification</option>
                  <option value="SubAdmin">Sub Admin</option>
                  <option value="Genre">Genre</option>
                  <option value="Movie">Movie</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Transaction">Transaction</option>
                  <option value="Faq">Faq</option>
                  <option value="Company">Company</option>
                </ChoicesFormInput>
              )}
            />
          </Col>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={toggle}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default SubAdminForm
