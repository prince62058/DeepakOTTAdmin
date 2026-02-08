'use client'

import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import {
  useCreateFaqMutation,
  useCreateLanguageMutation,
  useCreateSubscriptionMutation,
  useUpdateFaqMutation,
  useUpdateSubscriptionMutation,
} from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const FaqForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset({
        question: currentData?.question,
        answer: currentData?.answer,
      })
    } else {
      reset({ question: '', answer: '' })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [createFaq] = useCreateFaqMutation()
  const [updateFaq] = useUpdateFaqMutation()

  const onSubmit = async (data) => {
    if (isUpdate) {
      setLoading(true)
      try {
        const res = await updateFaq({ ...data, faqId: currentData?._id }).unwrap()
        if (res?.success) {
          toast.success(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
          toggle()
          reset({ question: '', answer: '' })
        } else {
          toast.error(res?.message, {
            position: 'top-right',
            autoClose: 5000,
            closeButton: false,
          })
        }
      } catch (error) {
        console.log(error, 'faq update error')
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
        const res = await createFaq(data).unwrap()
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
        console.log(error, 'faq create error')
        toast.error(error?.data?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
      setLoading(false)
    }
  }

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          {isUpdate ? 'Edit' : 'Create'} Faq
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
          <Col md={12}>
            <TextFormInput name="question" required type="text" label="Question*" control={control} />
          </Col>
          <Col md={12}>
            <TextAreaFormInput name="answer" required label="Answer*" control={control} rows={5} />
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

export default FaqForm
