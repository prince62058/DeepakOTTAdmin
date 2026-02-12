'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { useDeleteSubscriptionMutation, useDisableSubcriptionMutation, useGetLanguageQuery, useGetSubscriptionQuery } from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import SubscriptionForm from './SubscriptionForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useDebounce from '@/utils/useDebounce'

const SubscriptionCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, handleStatus, handleDelete, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.planName || ''}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.planDescription || ''}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.planPrice}</div>
        </div>
      </td>
      <td>
        <span
          className={`badge bg-${
            data?.planType === 'FREE_PLAN'
              ? 'secondary'
              : data?.planType === 'YEARLY_PREMIUM_PLAN'
                ? 'primary'
                : data?.planType === 'WATCH_AND_EARN_PLAN'
                  ? 'info'
                  : data?.planType === 'MONTHLY_PREMIUM'
                    ? 'success'
                    : data?.planType === 'PAY_PER_MOVIE_PLAN'
                      ? 'danger'
                      : 'dark'
          } text-white py-1 px-2`}>
          {data?.planType}
        </span>
      </td>
      <td>
        <FormCheck
          type="switch"
          id="switch2"
          className="cursor-pointer"
          checked={data?.disable == true || data?.disable == 'true'}
          onChange={() => handleStatus(data?._id, data?.disable == true || data?.disable == 'true' ? false : true)}
        />
      </td>
      <td>
        <span
          className={`badge bg-${data?.planEarningFeature == 'true' ? 'success-subtle' : 'warning-subtle'}  text-${data?.status == 'true' ? 'success' : 'warning'}  py-1 px-2`}>
          {data?.planEarningFeature ? 'Yes' : 'No'}
        </span>
      </td>
      {/* <td>
        <span
          className={`badge bg-${data?.fullAccess == 'true' ? 'success-subtle' : 'warning-subtle'}  text-${data?.status == 'true' ? 'success' : 'warning'}  py-1 px-2`}>
          {data?.fullAccess ? 'Yes' : 'No'}
        </span>
      </td> */}
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
          <button className="btn btn-soft-danger btn-sm" type="button" onClick={() => handleDelete(data?._id, data?.planName)}>
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </button>
        </div>
      </td>
    </tr>
  )
}

const SubscriptionList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: subscriptionData, isLoading } = useGetSubscriptionQuery({ page: currentPage, search: debounceSearch, disable: status })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { isTrue, toggle } = useToggle()

  const [disableSubcription] = useDisableSubcriptionMutation()
  const [deleteSubscription] = useDeleteSubscriptionMutation()

  const handleStatus = async (Id, status) => {
    try {
      const res = await disableSubcription({
        planId: Id,
        disable: status,
      }).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'Subscribe status error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
  }

  const handleDelete = async (planId, planName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${planName}" subscription plan? This action cannot be undone.`)

    if (!confirmed) return

    try {
      const res = await deleteSubscription({
        planId: planId,
      }).unwrap()

      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'Delete subscription error')
      toast.error(error?.data?.message || 'Failed to delete subscription plan', {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, status])

  const handlePageClick = (page) => {
    if (page >= 1 && page <= subscriptionData?.pagination?.pages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= subscriptionData?.pagination?.pages; i++) {
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
      {isLoading || !subscriptionData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Subscription List
            </CardTitle>
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
            <div
              className="btn btn-sm btn-primary"
              onClick={() => {
                setIsUpdate(false)
                toggle()
              }}>
              Add Subscription
            </div>
            <Dropdown className="w-[350px]">
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
                    <th>Description</th>
                    <th>Prize</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Plan Earning</th>
                    {/* <th>Full Access</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionData?.data?.length > 0 ? (
                    subscriptionData?.data?.map((item, idx) => (
                      <SubscriptionCard
                        key={idx}
                        data={item}
                        idx={idx}
                        currentPage={currentPage}
                        setIsUpdate={setIsUpdate}
                        toggle={toggle}
                        setCurrentData={setCurrentData}
                        handleStatus={handleStatus}
                        handleDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No Subscriptions found.
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

                <li className={`page-item ${currentPage === subscriptionData?.pagination?.pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === subscriptionData?.pagination?.pages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <SubscriptionForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default SubscriptionList
