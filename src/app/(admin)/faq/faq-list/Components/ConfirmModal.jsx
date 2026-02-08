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

const ConfirmModal = ({ isTrue, toggle, handleDelete, currentData, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    handleDelete(currentData?._id)
  }
  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">
          Confirm Modal
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="row g-2" onSubmit={handleSubmit}>
          <Col md={12}>
            <h6 className="fs-14" style={{ fontWeight: 'normal' }}>
              Are you sure you want to permanently delete this FAQ?
            </h6>
          </Col>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={toggle}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              Yes
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default ConfirmModal
