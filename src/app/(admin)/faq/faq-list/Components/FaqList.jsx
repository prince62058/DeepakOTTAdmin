'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { useDeleteFaqMutation, useDisableSubcriptionMutation, useGetFaqQuery, useGetLanguageQuery, useGetSubscriptionQuery } from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import SubscriptionForm from './FaqForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FaqForm from './FaqForm'
import ConfirmModal from './ConfirmModal'

const FaqCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, confirmModalToggle, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.question || ''}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.answer || ''}</div>
        </div>
      </td>
      <td>
        <div className="d-flex gap-2">
          {/* <Link href="" className="btn btn-light btn-sm">
            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
          </Link> */}
          <button className="btn btn-soft-primary btn-sm" type="button">
            <IconifyIcon
              icon="solar:pen-2-broken"
              className="align-middle fs-18"
              onClick={() => {
                setIsUpdate(true)
                setCurrentData(data)
                toggle()
              }}
            />
          </button>
          <button className="btn btn-soft-primary btn-sm" type="button">
            <IconifyIcon
              icon="solar:trash-bin-minimalistic-2-broken"
              className="align-middle fs-18"
              onClick={() => {
                setCurrentData(data)
                confirmModalToggle()
              }}
            />
          </button>
          {/* <Link href="" className="btn btn-soft-danger btn-sm">
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </Link> */}
        </div>
      </td>
    </tr>
  )
}

const FaqList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: faqData, isLoading } = useGetFaqQuery({ page: currentPage, search: '', disable: status })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isTrue, toggle } = useToggle()
  const { isTrue: isTrueConfirmModal, toggle: confirmModalToggle } = useToggle()

  const [deleteFaq] = useDeleteFaqMutation()

  const handleDelete = async (Id) => {
    setLoading(true)
    try {
      const res = await deleteFaq(Id).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        confirmModalToggle()
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'faq delete error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
    setLoading(false)
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= faqData?.page) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= faqData?.page; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageClick(i)}>
            {i}
          </button>
        </li>,
      )
    }
    return pages
  }
  return (
    <>
      {isLoading || !faqData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Faq List
            </CardTitle>
            <div
              className="btn btn-sm btn-primary"
              onClick={() => {
                setIsUpdate(false)
                toggle()
              }}>
              Add Faq
            </div>
            {/* <Dropdown className="w-[350px]">
          <DropdownToggle
            as={'a'}
            href="#"
            className="btn btn-sm btn-outline-light content-none w-[350px]"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            {status === '' ? 'All' : status === 'false' ? 'Enable' : 'Disable'}
            <IconifyIcon width={16} height={16} className="ms-1" icon="bx:chevron-down" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <Dropdown.Item className="dropdown-item" onClick={() => setStatus('')}>
              All
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => setStatus('false')}>
              Enable
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item" onClick={() => setStatus('true')}>
              Disable
            </Dropdown.Item>
          </DropdownMenu>
        </Dropdown> */}
            {/* <Dropdown>
          <DropdownToggle as={'a'} href="#" className="btn btn-sm btn-outline-light content-none" data-bs-toggle="dropdown" aria-expanded="false">
            This Month
            <IconifyIcon width={16} height={16} className="ms-1" icon="bx:chevron-down" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <Link href="" className="dropdown-item">
              Download
            </Link>
            <Link href="" className="dropdown-item">
              Export
            </Link>
            <Link href="" className="dropdown-item">
              Import
            </Link>
          </DropdownMenu>
        </Dropdown> */}
          </CardHeader>
          <div>
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th
                      style={{
                        width: 50,
                      }}>
                      S.No.
                    </th>
                    <th
                      style={{
                        minWidth: 100,
                      }}>
                      Question
                    </th>
                    <th>Answer</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faqData?.data?.length > 0 &&
                    faqData?.data?.map((item, idx) => (
                      <FaqCard
                        key={idx}
                        data={item}
                        idx={idx}
                        currentPage={currentPage}
                        setIsUpdate={setIsUpdate}
                        toggle={toggle}
                        setCurrentData={setCurrentData}
                        confirmModalToggle={confirmModalToggle}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <CardFooter className="border-top">
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-end mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {renderPagination()}

                <li className={`page-item ${currentPage === faqData?.page ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === faqData?.page}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <FaqForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
          <ConfirmModal
            isTrue={isTrueConfirmModal}
            toggle={confirmModalToggle}
            currentData={currentData}
            handleDelete={handleDelete}
            loading={loading}
          />
        </Card>
      )}
    </>
  )
}
export default FaqList
