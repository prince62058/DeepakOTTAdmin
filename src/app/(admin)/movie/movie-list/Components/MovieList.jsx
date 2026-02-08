'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import {
  useDisableSubcriptionMutation,
  useGetGenreQuery,
  useGetLanguageQuery,
  useGetMovieQuery,
  useGetSubscriptionQuery,
  useUpdateGenreMutation,
  useDeleteMovieMutation,
} from '@/lib/api'
import { formateTime } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Spinner } from 'react-bootstrap'
import useToggle from '@/hooks/useToggle'
import MovieForm from './MovieForm'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import useDebounce from '@/utils/useDebounce'

const MovieCard = ({ idx, data, setIsUpdate, toggle, setCurrentData, handleStatus, currentPage, handleDelete }) => {
  return (
    <tr>
      <td> {(currentPage - 1) * 20 + idx + 1}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <Image
            width={100}
            height={100}
            src={(data?.mainType === 'WEB_SERIES' ? data?.subSeries?.[0]?.Series?.[0]?.poster : data?.poster) || avatar1}
            alt="avatar"
            className="avatar-sm rounded-circle border border-light border-3"
          />
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.mainType === 'WEB_SERIES' ? data?.subSeries?.[0]?.name : data?.name || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.mainType || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.mainType === 'WEB_SERIES' ? formateTime(data?.subSeries?.[0]?.releaseDate) : formateTime(data?.releaseDate) || '-'}</div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div>{data?.mainType === 'WEB_SERIES' ? data?.subSeries?.[0]?.imdbRating : data?.imdbRating}</div>
        </div>
      </td>

      {/* <td>
        <FormCheck
          type="switch"
          id="switch2"
          className="cursor-pointer"
          checked={data?.disable}
          onChange={() => handleStatus(data?._id, !data?.disable)}
        />
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
          <button className="btn btn-soft-danger btn-sm" type="button" onClick={() => handleDelete(data?._id)}>
            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
          </button>
        </div>
      </td>
    </tr>
  )
}

const MovieList = () => {
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  const { data: movieData, isLoading } = useGetMovieQuery({ page: currentPage, search: debounceSearch, disable: status })
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { isTrue, toggle } = useToggle()

  const [updateGenre] = useUpdateGenreMutation()
  const [deleteMovie] = useDeleteMovieMutation()

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this movie and its files?')) {
      try {
        const res = await deleteMovie(id).unwrap()
        if (res?.success) {
          toast.success(res?.message)
        } else {
          toast.error(res?.message)
        }
      } catch (error) {
        toast.error(error?.data?.message || 'Delete failed')
      }
    }
  }

  const handleStatus = async (Id, status) => {
    try {
      const res = await updateGenre({
        genreId: Id,
        data: { disable: status },
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
      console.log(error, 'Genre status error')
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
    if (page >= 1 && page <= movieData?.page) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= movieData?.page; i++) {
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
      {isLoading || !movieData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Movie List
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
              Add Movie
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
                    <th>Image</th>
                    <th
                      style={{
                        minWidth: 100,
                      }}>
                      Name
                    </th>

                    {/* <th>Status</th> */}
                    <th>Type</th>
                    <th>Release Date</th>
                    <th>Imdb Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {movieData?.data?.length > 0 ? (
                    movieData?.data?.map((item, idx) => (
                      <MovieCard
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
                      <td colSpan={7} className="text-center">
                        No Movie found.
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

                <li className={`page-item ${currentPage === movieData?.page ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === movieData?.page}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
          <MovieForm isUpdate={isUpdate} isTrue={isTrue} toggle={toggle} currentData={currentData} />
        </Card>
      )}
    </>
  )
}
export default MovieList
