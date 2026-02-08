'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { useGetLanguageQuery, useUpdateLanguageMutation } from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import useDebounce from '@/utils/useDebounce'
import LanguageForm from './LanguageForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LanguageCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, handleStatus, currentPage }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.name || ''}</div>
        </div>
      </td>
      <td>
        <FormCheck type="switch" id="switch2" checked={data?.disable} onChange={() => handleStatus(data?._id, !data?.disable)} />
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{formateTime(data?.createdAt)}</div>
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
          {/* <Link href="" className="btn btn-soft-danger btn-sm">
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </Link> */}
        </div>
      </td>
    </tr>
  )
}

const LanguageList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: languageData, isLoading } = useGetLanguageQuery({ page: currentPage, search: debounceSearch, disable: status })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { isTrue, toggle } = useToggle()

  useEffect(() => {
    setCurrentPage(1)
  }, [search, status])

  const [updateLanguage] = useUpdateLanguageMutation()

  const handleStatus = async (Id, status) => {
    try {
      const res = await updateLanguage({
        data: {
          disable: status,
        },
        languageId: Id,
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
      console.log(error, 'Language status error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= languageData?.pagination?.pages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    const totalPages = Number(languageData?.pagination?.pages) || 0
    for (let i = 1; i <= totalPages; i++) {
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
  const totalPages = Number(languageData?.pagination?.pages) || 1

  return (
    <>
      {isLoading || !languageData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Language List
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
              Add Language
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
                        width: 150,
                      }}>
                      S.No.
                    </th>
                    <th
                      style={{
                        minWidth: 100,
                      }}>
                      Name
                    </th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {languageData?.data?.length > 0 ? (
                    languageData?.data?.map((item, idx) => (
                      <LanguageCard
                        key={item?._id || idx}
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
                      <td colSpan={5} className="text-center">
                        No languages found.
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

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <LanguageForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default LanguageList
