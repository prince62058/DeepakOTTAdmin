'use client'
import CryptoJS from 'crypto-js'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import {
  useDisableSubcriptionMutation,
  useDisableUserMutation,
  useGetGenreQuery,
  useGetLanguageQuery,
  useGetSubscriptionQuery,
  useGetUserQuery,
  useUpdateGenreMutation,
} from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import SubAdminForm from './SubAdminForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import useDebounce from '@/utils/useDebounce'

const SubAdminCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, handleStatus, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <Image
            width={100}
            height={100}
            src={data?.image || avatar1}
            alt="avatar"
            className="avatar-sm rounded-circle border border-light border-3"
          />
        </div>
      </td>
      <td>
        <div className="d-flex flex-column align-items-start gap-0">
          <div>{data?.name || '-'}</div>
          <div>{data?.email || '-'}</div>
        </div>
      </td>
      <td>
        {(data?.permissions?.length > 0 &&
          (() => {
            const bgMap = {
              User: 'info-subtle',
              Language: 'success-subtle',
              Notification: 'warning-subtle',
              SubAdmin: 'light',
              Genre: 'info-subtle',
              Movie: 'success-subtle',
              Subscription: 'warning-subtle',
              Transaction: 'light',
              Faq: 'warning-subtle',
              Company: 'light',
            }
            const textMap = {
              Administrator: 'info',
              Analyst: 'success',
              Trial: 'warning',
              Developer: 'dark',
              User: 'info',
              Language: 'success',
              Notification: 'warning',
              SubAdmin: 'dark',
              Genre: 'info',
              Movie: 'success',
              Subscription: 'warning',
              Transaction: 'dark',
              Faq: 'warning',
              Company: 'dark',
            }
            return data.permissions.map((assignItem, id) => {
              const bg = bgMap[assignItem] || 'primary-subtle'
              const text = textMap[assignItem] || 'primary'
              return (
                <Fragment key={id}>
                  <span className={`badge bg-${bg} text-${text} py-1 px-2 fs-11 m-1`}>{assignItem}</span>
                  &nbsp;
                </Fragment>
              )
            })
          })()) || (
          <Fragment>
            <span className={`badge bg-info text-white py-1 px-2 fs-11`}>No Permissions</span>
            &nbsp;
          </Fragment>
        )}
      </td>

      <td>
        <div className="d-flex flex-column align-items-start gap-0">
          <div>
            {(() => {
              if (data?.subAdminPassword) {
                try {
                  const bytes = CryptoJS.AES.decrypt(data.subAdminPassword, 'mySecretKey123')
                  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
                  return decrypted || '-'
                } catch (e) {
                  return '-'
                }
              }
              return '-'
            })()}
          </div>
        </div>
      </td>
      <td>
        <FormCheck
          type="switch"
          id="switch2"
          className="cursor-pointer"
          checked={data?.disable}
          onChange={() => handleStatus(data?._id, !data?.disable)}
        />
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
          {/* <Link href="" className="btn btn-soft-danger btn-sm">
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </Link> */}
        </div>
      </td>
    </tr>
  )
}

const SubAdminList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: subAdminData, isLoading } = useGetUserQuery({ page: currentPage, search: debounceSearch, disable: status, userType: 'SubAdmin' })
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
      console.log(error, 'sub admin status error')
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
    if (page >= 1 && page <= subAdminData?.pagination?.pages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= subAdminData?.pagination?.pages; i++) {
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
      {isLoading || !subAdminData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Sub Admin List
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
              Add Sub Admin
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
                    <th>Image</th>
                    <th
                      style={{
                        minWidth: 100,
                      }}>
                      Name & Email
                    </th>
                    <th
                      style={{
                        minWidth: 80,
                        maxWidth: 150,
                      }}>
                      Permissions
                    </th>

                    <th>Password</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subAdminData?.data?.length > 0 ? (
                    subAdminData?.data?.map((item, idx) => (
                      <SubAdminCard
                        key={idx}
                        data={item}
                        idx={idx}
                        currentPage={currentPage}
                        setIsUpdate={setIsUpdate}
                        toggle={toggle}
                        setCurrentData={setCurrentData}
                        handleStatus={handleStatus}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No Sub Admin found.
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

                <li className={`page-item ${currentPage === subAdminData?.pagination?.pages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === subAdminData?.pagination?.pages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <SubAdminForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default SubAdminList
