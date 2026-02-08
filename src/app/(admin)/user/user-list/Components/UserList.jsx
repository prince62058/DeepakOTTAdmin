'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { useDisableSubcriptionMutation, useDisableUserMutation, useGetLanguageQuery, useGetSubscriptionQuery, useGetUserQuery } from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import NotificationForm from './NotificationForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useDebounce from '@/utils/useDebounce'

const UserCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, handleStatus, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex flex-column align-items-start gap-0">
          <div>{data?.name || '-'}</div>
          <div>{data?.email || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.referralEarning}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.wallet}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.totalFreeTime}</div>
        </div>
      </td>
      {/* <td>
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
      </td> */}
      <td>
        <FormCheck
          type="switch"
          id="switch2"
          className="cursor-pointer"
          checked={data?.disable}
          onChange={() => handleStatus(data?._id, !data?.disable)}
        />
      </td>
      {/* <td>
        <span
          className={`badge bg-${data?.planEarningFeature == 'true' ? 'success-subtle' : 'warning-subtle'}  text-${data?.status == 'true' ? 'success' : 'warning'}  py-1 px-2`}>
          {data?.planEarningFeature ? 'True' : 'False'}
        </span>
      </td> */}
      {/* <td>
        <span
          className={`badge bg-${data?.fullAccess == 'true' ? 'success-subtle' : 'warning-subtle'}  text-${data?.status == 'true' ? 'success' : 'warning'}  py-1 px-2`}>
          {data?.fullAccess ? 'True' : 'False'}
        </span>
      </td> */}
      <td>
        <div className="d-flex gap-2">
          <Link href={`/user/user-detail/${data?._id}`} className="btn btn-light btn-sm">
            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
          </Link>
          <button className="btn btn-soft-primary btn-sm" type="button">
            <IconifyIcon
              icon="solar:bell-bold-duotone"
              className="align-middle fs-18"
              onClick={() => {
                setIsUpdate(true)
                setCurrentData(data)
                toggle()
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

const UserList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: userData, isLoading } = useGetUserQuery({ page: currentPage, search: debounceSearch, disable: status, userType: 'User' })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { isTrue, toggle } = useToggle()

  const [disableUser] = useDisableUserMutation()

  const handleStatus = async (Id, status) => {
    try {
      const res = await disableUser(Id).unwrap()
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
      console.log(error, 'User status error')
      toast.error(error?.data?.message, {
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
    if (page >= 1 && page <= userData?.pagination?.pages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= userData?.pagination?.pages; i++) {
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
      {isLoading || !userData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All User List
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
                        width: 30,
                      }}>
                      S.No.
                    </th>
                    <th
                      style={{
                        minWidth: 60,
                      }}>
                      Name & Email
                    </th>
                    <th>Ref. Earning</th>
                    <th>Wallet</th>
                    <th>Total Free Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userData?.data?.length > 0 ?
                    userData?.data?.map((item, idx) => (
                      <UserCard
                        key={idx}
                        data={item}
                        idx={idx}
                        currentPage={currentPage}
                        setIsUpdate={setIsUpdate}
                        toggle={toggle}
                        setCurrentData={setCurrentData}
                        handleStatus={handleStatus}
                      />
                    )): (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No User found.
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

                <li className={`page-item ${currentPage === userData?.pagination?.pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === userData?.pagination?.pages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <NotificationForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default UserList
