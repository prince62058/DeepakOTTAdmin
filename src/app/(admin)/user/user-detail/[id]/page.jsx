'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useGetUserDetailsQuery } from '@/lib/api'
import Image from 'next/image'
import logoDark from '@/assets/images/logo-dark.png'
import checkImg from '@/assets/images/check-2.png'
import { getProductData } from '@/helpers/data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Alert, Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import { currency } from '@/context/constants'
import PageTItle from '@/components/PageTItle'
import Link from 'next/link'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import { formateTime } from '@/utils/date'
// export const metadata = {
//   title: 'Invoice Details',
// }

const UserDetails = () => {
  const { id } = useParams() || {} // id is string | undefined
  const { data: userDetail } = useGetUserDetailsQuery({ userId: id })

  return (
    <>
      <PageTItle title="USER DETAILS" />
      <Row className="justify-content-center">
        <Col lg={8}>
          <Link href="/user/user-list" className="mb-3 d-inline-block text-decoration-none d-inline-flex align-items-center">
            <IconifyIcon icon="mdi:arrow-left" className="me-2 fs-5 cursor-pointer" />
            <span>Back to User List</span>
          </Link>
          <Card>
            <CardBody>
              <div className="clearfix pb-3 bg-info-subtle p-lg-3 p-2 m-n2 rounded position-relative">
                <div className="float-sm-start">
                  <div className="auth-logo">
                    <Image className="logo-dark me-1" src={userDetail?.data?.image || avatar1} alt="logo-dark" height={24} width={24} />
                  </div>
                  <div className="mt-4">
                    <h4>{userDetail?.data?.name || '-'}</h4>
                    <p> Email : {userDetail?.data?.email || '-'}</p>
                    <p> Mobile : {userDetail?.data?.number || '-'}</p>
                    {/* <address className="mt-3 mb-0">
                      1729 Bangor St,
                      <br />
                      Houlton, ME, 04730 , United States <br />
                      <abbr title="Phone">Phone:</abbr> +1(142)-532-9109
                    </address> */}
                  </div>
                </div>
                <div className="float-sm-end">
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0 text-dark fw-semibold"> Referral Code : </p>
                          </td>
                          <td className="text-end text-dark fw-semibold px-0 py-1">{userDetail?.data?.referralCode}</td>
                        </tr>
                        {/* <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Mobile: </p>
                          </td>
                          <td className="text-end text-dark fw-medium px-0 py-1">{userDetail?.data?.number}</td>
                        </tr> */}
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Register Date : </p>
                          </td>
                          <td className="text-end text-dark fw-medium px-0 py-1">{formateTime(userDetail?.data?.createdAt)}</td>
                        </tr>
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Wallet : </p>
                          </td>
                          <td className="text-end text-dark fw-medium px-0 py-1">
                            {currency}
                            {userDetail?.data?.wallet}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Referral Earning : </p>
                          </td>
                          <td className="text-end text-dark fw-medium px-0 py-1">
                            {currency}
                            {userDetail?.data?.referralEarning}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Total Free Time : </p>
                          </td>
                          <td className="text-end text-dark fw-medium px-0 py-1">
                            {currency}
                            {userDetail?.data?.totalFreeTime}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-0 pe-5 py-1">
                            <p className="mb-0">Status : </p>
                          </td>
                          <td className="text-end px-0 py-1">
                            <span className={`badge bg-${userDetail?.data?.disable ? 'warning' : 'success'} text-white  px-2 py-1 fs-13`}>
                              {userDetail?.data?.disable ? 'True' : 'False'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="position-absolute top-100 start-50 translate-middle">
                  <Image src={checkImg} alt="check-2" className="img-fluid" />
                </div>
              </div>
              <div className="clearfix pb-3 mt-4">
                <div className="float-sm-start">
                  <div>
                    <CardTitle as={'h4'}>Plan Details :</CardTitle>
                    <div className="mt-3">
                      <h4> {userDetail?.data?.planDetails?.planName || '-'}</h4>
                      <p className="mb-2">{userDetail?.data?.planDetails?.planDescription || '-'}</p>
                      <p className="mb-2">
                        <span className="">Prize :</span> {userDetail?.data?.planDetails?.planPrice}
                      </p>
                      <p className="mb-2">
                        <span className="">Duration :</span> {userDetail?.data?.planDetails?.planDuration}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="float-sm-end">
                  <div>
                    <div className="mt-3">
                      <p className="mb-2">
                        <span>Plan Type : </span>
                        {userDetail?.data?.planDetails?.planType || '-'}
                      </p>
                      <p className="mb-2">
                        <span>Plan Start Time : </span>
                        {userDetail?.data?.planDetails?.planStartTime ? formateTime(userDetail?.data?.planDetails?.planStartTime) : 'N/A'}
                        {/* {formateTime(userDetail?.data?.planDetails?.planStartTime || userDetail?.data?.planDetails?.createdAt)} */}
                      </p>
                      <p className="mb-2">
                        <span>Plan Expire Time : </span>
                        {userDetail?.data?.planDetails?.planExpireTime ? formateTime(userDetail?.data?.planDetails?.planExpireTime) : 'N/A'}
                        {/* {formateTime(userDetail?.data?.planDetails?.planExpireTime || userDetail?.data?.planDetails?.updatedAt)} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserDetails
