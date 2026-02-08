'use client'

import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import {
  useCreateGenreMutation,
  useCreateLanguageMutation,
  useCreateSubscriptionMutation,
  useUpdateGenreMutation,
  useUpdateSubscriptionMutation,
  useUploadImageMutation,
} from '@/lib/api'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'

const GenreForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const imageRef = useRef()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      image: '',
    },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset({
        name: currentData?.name,
        image: currentData?.image,
      })
    } else {
      reset({
        name: '',
        image: '',
      })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [uploadImg] = useUploadImageMutation()
  const [createGenre] = useCreateGenreMutation()
  const [updateGenre] = useUpdateGenreMutation()

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
        const rawData = {}
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            rawData[key] = data[key]
          }
        }
        rawData.image = imageUrl

        const res = await updateGenre({ data: rawData, genreId: currentData?._id }).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ name: '', image: '' })
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
        const rawData = {}
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            rawData[key] = data[key]
          }
        }
        rawData.image = imageUrl

        const res = await createGenre(rawData).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ name: '', image: '' })
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

  // const onSubmit = async (data) => {
  //   setLoading(true)
  //   try {
  //     let imageUrl = data.image

  //     // 1️⃣ Upload image if it's a File (not already a URL)
  //     if (data.image && typeof data.image !== 'string') {
  //       const formData = new FormData()
  //       formData.append('image', data.image)

  //       const res = await uploadImg(formData).unwrap()
  //       if (res?.success) {
  //         toast.success(res?.message, {
  //           position: 'top-right',
  //           autoClose: 1000,
  //           closeButton: false,
  //         })
  //         imageUrl = res?.URL || ''
  //       } else {
  //         toast.error(res?.message, {
  //           position: 'top-right',
  //           autoClose: 2000,
  //           closeButton: false,
  //         })
  //         setLoading(false)
  //         return
  //       }
  //     }

  //     // 2️⃣ Prepare final payload
  //     const rawData = {}
  //     for (const key in data) {
  //       if (data[key] !== null && data[key] !== undefined) {
  //         rawData[key] = data[key]
  //       }
  //     }
  //     rawData.image = imageUrl

  //     // 3️⃣ Send notification
  //     const res = await sendNotification(rawData).unwrap()
  //     if (res?.success) {
  //       toast.success(res?.message, {
  //         position: 'top-right',
  //         autoClose: 5000,
  //         closeButton: false,
  //       })
  //       reset({
  //         userId: '',
  //         image: '',
  //         title: '',
  //         message: '',
  //         userType: 'User',
  //         sendAll: true,
  //       })
  //     } else {
  //       toast.error(res?.message, {
  //         position: 'top-right',
  //         autoClose: 5000,
  //         closeButton: false,
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error, 'notification error')
  //   }
  //   setLoading(false)
  // }

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
          {isUpdate ? 'Edit' : 'Create'} Genre
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
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
          <Col md={12}>
            <TextFormInput name="name" required type="text" label="Name*" control={control} />
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

export default GenreForm
