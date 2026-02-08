'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { useDisableSubcriptionMutation, useGetLanguageQuery, useGetSubscriptionQuery, useGetTransactionQuery } from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TransactionUpdateForm from './TransactionUpdateForm'
import useDebounce from '@/utils/useDebounce'

const TransactionCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.userId?.name || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.amount || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex flex-column align-items-start gap-0">
          <div>Type :- {data?.bankOrUpiId?.type || '-'}</div>
          {data?.bankOrUpiId?.fullName && <div>Full Name :- {data?.bankOrUpiId?.fullName || '-'}</div>}
          {data?.bankOrUpiId?.bankName && <div>Bank Name :- {data?.bankOrUpiId?.bankName || '-'}</div>}
          {data?.bankOrUpiId?.accountNumber && <div>Acc. No. :- {data?.bankOrUpiId?.accountNumber || '-'}</div>}
          {data?.bankOrUpiId?.ifscCode && <div>IFSC Code :- {data?.bankOrUpiId?.ifscCode || '-'}</div>}
          {data?.bankOrUpiId?.upiId && <div>UPI Id :- {data?.bankOrUpiId?.upiId || '-'}</div>}
        </div>
      </td>
      <td>
        <span
          className={`badge bg-${
            data?.Type === 'FREE_PLAN'
              ? 'secondary'
              : data?.Type === 'YEARLY_PREMIUM_PLAN'
                ? 'primary'
                : data?.Type === 'WATCH_AND_EARN_PLAN'
                  ? 'info'
                  : data?.Type === 'DEBIT'
                    ? 'success'
                    : data?.Type === 'CREDIT'
                      ? 'danger'
                      : 'dark'
          } text-white py-1 px-2`}>
          {data?.Type}
        </span>
      </td>
      <td>
        <td>
          {data?.status === 'PENDING' ? (
            <Dropdown className="w-[350px]">
              <Dropdown.Toggle as="span" className={`badge cursor-pointer bg-warning-subtle text-warning py-1 px-2`} id="dropdown-status">
                {data?.status}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Item
                  onClick={() => {
                    setIsUpdate(true)
                    setCurrentData(data)
                    toggle()
                  }}>
                  Approved
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setIsUpdate(false)
                    setCurrentData(data)
                    toggle()
                  }}>
                  Reject
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <span
              className={`badge bg-${
                data?.status === 'APPROVED' ? 'success-subtle' : 'danger-subtle'
              } text-${data?.status === 'APPROVED' ? 'success' : 'danger'} py-1 px-2`}>
              {data?.status}
            </span>
          )}
        </td>
      </td>

      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.transactionId || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.message || '-'}</div>
        </div>
      </td>
      {/* <td>
        <div className="d-flex gap-2">
          <Link href="" className="btn btn-light btn-sm">
            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
          </Link>
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
          <Link href="" className="btn btn-soft-danger btn-sm">
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </Link>
        </div>
      </td> */}
    </tr>
  )
}

const TransactionList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: transactionData, isLoading } = useGetTransactionQuery({ page: currentPage, search: debounceSearch, Type: status })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { isTrue, toggle } = useToggle()

  useEffect(() => {
    setCurrentPage(1)
  }, [search, status])

  const handlePageClick = (page) => {
    if (page >= 1 && page <= transactionData?.pagination?.pages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= transactionData?.pagination?.pages; i++) {
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
      {isLoading || !transactionData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Transaction List
            </CardTitle>
            {/* <div
          className="btn btn-sm btn-primary"
          onClick={() => {
            setIsUpdate(false)
            toggle()
          }}>
          Add Subscription
        </div> */}
            <form className="app-search d-none d-md-block ms-2">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control py-1 "
                  placeholder="Search..."
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
            <Dropdown className="w-[350px]">
              <DropdownToggle
                as={'a'}
                href="#"
                className="btn btn-sm btn-outline-light content-none w-[350px]"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {status === '' ? 'All' : status === 'CREDIT' ? 'Credit' : 'Debit'}
                <IconifyIcon width={16} height={16} className="ms-1" icon="bx:chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <Dropdown.Item className="dropdown-item" onClick={() => setStatus('')}>
                  All
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" onClick={() => setStatus('CREDIT')}>
                  Credit
                </Dropdown.Item>
                <Dropdown.Item className="dropdown-item" onClick={() => setStatus('DEBIT')}>
                  Debit
                </Dropdown.Item>
              </DropdownMenu>
            </Dropdown>
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
                      Name
                    </th>
                    <th>Amount</th>
                    <th
                      style={{
                        width: 250,
                      }}>
                      Bank Details
                    </th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Transaction Id</th>
                    <th>Message</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {transactionData?.data?.length > 0 ? (
                    transactionData?.data?.map((item, idx) => (
                      <TransactionCard
                        key={idx}
                        data={item}
                        idx={idx}
                        setIsUpdate={setIsUpdate}
                        toggle={toggle}
                        setCurrentData={setCurrentData}
                        currentPage={currentPage}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No Transaction found.
                      </td>
                    </tr>
                  )}
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

                <li className={`page-item ${currentPage === transactionData?.pagination?.pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === transactionData?.pagination?.pages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <TransactionUpdateForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default TransactionList
