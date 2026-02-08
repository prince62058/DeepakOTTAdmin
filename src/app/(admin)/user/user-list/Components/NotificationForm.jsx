'use client'

import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { useSendNotificationMutation, useUploadImageMutation } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const NotificationForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      userId: currentData?._id,
      image: '',
      title: '',
      message: '',
      userType: 'User',
      sendAll: false,
    },
  })
  useEffect(() => {
    if (isUpdate && currentData) {
      reset({
        userId: currentData?._id,
        image: '',
        title: '',
        message: '',
        userType: 'User',
        sendAll: false,
      })
    } else {
      reset({ userId: '', image: '', title: '', message: '', userType: 'User', sendAll: false })
    }
  }, [currentData, isUpdate, reset])

  const [sendNotification] = useSendNotificationMutation()
  const [uploadImg] = useUploadImageMutation()

  const handleUplaodImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await uploadImg(formData).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 1000,
          closeButton: false,
        })
        reset({
          image: res?.URL || '',
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 2000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'image upload error')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const rawData = { userId: currentData?._id, sendAll: false }
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          rawData[key] = data[key]
        }
      }
      const res = await sendNotification(rawData).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        toggle()
        reset({
          userId: '',
          image: '',
          title: '',
          message: '',
          userType: 'User',
          sendAll: false,
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

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          Send Notification
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md={12}>
            <DropzoneFormInput
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
            />
          </Col>
          <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
            <Col md={12}>
              <TextFormInput name="title" required type="text" label="Title*" control={control} />
            </Col>
            {/* <Col md={6}>
              <div>
                <FormLabel htmlFor="userType-select">Select User Type</FormLabel>
                <Controller
                  name="userType"
                  control={control}
                  render={({ field }) => (
                    <FormSelect id="userType-select" {...field}>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="SubAdmin">SubAdmin</option>
                    </FormSelect>
                  )}
                />
              </div>
            </Col> */}
            <Col md={12}>
              <TextAreaFormInput name="message" required label="Message*" control={control} rows={5} />
            </Col>

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={toggle}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                Send
              </Button>
            </ModalFooter>
          </form>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default NotificationForm
