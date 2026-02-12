'use client'

import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { useCreateLanguageMutation, useCreateSubscriptionMutation, useUpdateSubscriptionMutation } from '@/lib/api'
import React, { useEffect, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SubscriptionForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      planName: '',
      planDescription: '',
      planPrice: 0,
      planDuration: 0,
      planType: 'FREE_PLAN',
      planEarningFeature: false,
      fullAccess: false,
    },
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset({
        planName: currentData?.planName,
        planDescription: currentData?.planDescription,
        planPrice: currentData?.planPrice,
        planDuration: currentData?.planDuration,
        planType: currentData?.planType,
        planEarningFeature: currentData?.planEarningFeature,
        fullAccess: currentData?.fullAccess,
      })
    } else {
      reset({ planName: '', planDescription: '', planPrice: 0, planDuration: 0, planType: 'FREE_PLAN', planEarningFeature: false, fullAccess: false })
    }
  }, [currentData, isUpdate, reset, isTrue])

  const [createSubscription] = useCreateSubscriptionMutation()
  const [updateSubscription] = useUpdateSubscriptionMutation()

  const onSubmit = async (data) => {
    // 🧹 Clean data: Only send necessary fields
    const payload = {
      planName: data.planName,
      planDescription: data.planDescription,
      planPrice: Number(data.planPrice),
      planDuration: Number(data.planDuration),
      planType: data.planType,
      planEarningFeature: data.planEarningFeature === 'true' || data.planEarningFeature === true,
      fullAccess: data.fullAccess === 'true' || data.fullAccess === true,
    }

    if (isUpdate) {
      setLoading(true)
      try {
        const res = await updateSubscription({ ...payload, planId: currentData?._id }).unwrap()
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
      setLoading(false)
    } else {
      setLoading(true)
      try {
        const res = await createSubscription(payload).unwrap()
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
      setLoading(false)
    }
  }

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          {isUpdate ? 'Edit' : 'Create'} Subscription
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
          <Col md={12}>
            <TextFormInput name="planName" required type="text" label="Name*" control={control} />
          </Col>
          <Col md={12}>
            <TextAreaFormInput name="planDescription" required label="Description*" control={control} rows={5} />
          </Col>
          <Col md={6}>
            <TextFormInput name="planPrice" required type="number" label="Price*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="planDuration" required type="number" label="Duration (Days)*" control={control} />
          </Col>
          <Col md={6}>
            <div>
              <FormLabel htmlFor="planType-select">Select Plan Type</FormLabel>
              <Controller
                name="planType"
                control={control}
                render={({ field }) => (
                  <FormSelect id="planType-select" {...field}>
                    <option value="FREE_PLAN">Free Plan</option>
                    <option value="YEARLY_PREMIUM_PLAN">Yearly Premium Plan</option>
                    <option value="WATCH_AND_EARN_PLAN">Watch And Earn Plan</option>
                    <option value="MONTHLY_PREMIUM">Monthly Premium</option>
                    <option value="PAY_PER_MOVIE_PLAN">Pay Per Movie Plan</option>
                  </FormSelect>
                )}
              />
            </div>
          </Col>
          <Col md={6}>
            <div>
              <FormLabel htmlFor="planEarningFeature-select">Choose Plan Earning</FormLabel>
              <Controller
                name="planEarningFeature"
                control={control}
                render={({ field }) => (
                  <FormSelect id="planEarningFeature-select" {...field}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </FormSelect>
                )}
              />
            </div>
          </Col>
          {/* <Col md={6}>
            <div>
              <FormLabel htmlFor="fullAccess-select">Choose fullAccess</FormLabel>
              <Controller
                name="fullAccess"
                control={control}
                render={({ field }) => (
                  <FormSelect id="fullAccess-select" {...field}>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </FormSelect>
                )}
              />
            </div>
          </Col> */}
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

export default SubscriptionForm
