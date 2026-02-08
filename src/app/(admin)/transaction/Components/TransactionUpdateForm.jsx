'use client'

import TextFormInput from '@/components/form/TextFormInput'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import { useCreateLanguageMutation, useUpdateLanguageMutation, useUpdateTransactionMutation } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const TransactionUpdateForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { status: 'APPROVED', tid: currentData?._id, message: '', transactionId: '' },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset({ status: isUpdate ? 'APPROVED' : 'REJECTED', tid: currentData?._id, message: '', transactionId: '' })
    } else {
      reset({ status: isUpdate ? 'APPROVED' : 'REJECTED', tid: '', message: '', transactionId: '' })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [updateTransaction] = useUpdateTransactionMutation()

  const onSubmit = async (data) => {
    setLoading(true)

    const rawData = {}
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        rawData[key] = data[key]
      }
    }
    rawData.tid = currentData?._id

    try {
      const res = await updateTransaction({ data: rawData, transectionId: currentData?._id }).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        toggle()
        setValue({ status: isUpdate ? 'APPROVED' : 'REJECTED', tid: '', message: '', transactionId: '' })
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

    setLoading(false)
  }

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          {isUpdate ? 'Approved' : 'Reject'} Transaction
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          {isUpdate ? (
            <TextFormInput name="transactionId" required type="text" label="Transaction Id*" control={control} containerClassName="mb-3" />
          ) : (
            <TextAreaFormInput name="message" required label="Reason*" control={control} rows={5} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={toggle}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              loading ||
              (isUpdate
                ? ((watch('transactionId') ?? '').trim().length === 0)
                : ((watch('message') ?? '').trim().length === 0))
            }
          >
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default TransactionUpdateForm
