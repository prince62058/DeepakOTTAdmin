'use client'

import TextFormInput from '@/components/form/TextFormInput'
import { useCreateLanguageMutation, useUpdateLanguageMutation } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LanguageForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset({ name: currentData?.name })
    } else {
      reset({ name: '' })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [createLanguage] = useCreateLanguageMutation()
  const [updateLanguage] = useUpdateLanguageMutation()

  const onSubmit = async (data) => {
    setLoading(true)
    if (isUpdate) {
      try {
        const res = await updateLanguage({ data, languageId: currentData?._id }).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          setValue({ name: '' })
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
        }
      } catch (error) {
        console.log(error, 'Language create error')
        toast.error(error?.data?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } else {
      try {
        const res = await createLanguage(data).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ name: '' })
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
        }
      } catch (error) {
        console.log(error, 'Language create error')
        toast.error(error?.data?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    }
    setLoading(false)
  }

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          {isUpdate ? 'Edit' : 'Create'} Language
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <TextFormInput name="name" required type="text" label="Name*" control={control} containerClassName="mb-3" />
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={toggle}>
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default LanguageForm
