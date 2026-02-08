'use client'

import React, { useEffect, useRef, useState } from 'react'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormLabel, FormSelect, Row, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { useGetCompanyQuery, useUpdateCompanyMutation } from '@/lib/api'
import ReactQuill from 'react-quill'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'

// styles
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import Image from 'next/image'

const CompanyForm = () => {
  const iconRef = useRef()
  const favRef = useRef()
  const loaderRef = useRef()
  const [loading, setLoading] = useState(false)

  const { data: companyData, isLoading } = useGetCompanyQuery()

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      icon: null,
      favIcon: null,
      loader: null,
      homeBanner: [],
      name: '',
      email: '',
      address: '',
      phoneNumber: '',
      gst: '',
      xUrl: '',
      instaUrl: '',
      facebookUrl: '',
      linkedineUrl: '',
      referralEarning: 0,
      totalWatchFreeTime: 0,
      privacyPolicy: '',
      termsCondition: '',
      aboutUs: '',
    },
  })

  useEffect(() => {
    if (companyData) {
      reset({
        icon: companyData?.data?.icon,
        favIcon: companyData?.data?.favIcon,
        loader: companyData?.data?.loader,
        homeBanner: companyData?.data?.homeBanner,
        name: companyData?.data?.name,
        phoneNumber: companyData?.data?.phoneNumber,
        email: companyData?.data?.email,
        address: companyData?.data?.address,
        xUrl: companyData?.data?.xUrl,
        instaUrl: companyData?.data?.instaUrl,
        facebookUrl: companyData?.data?.facebookUrl,
        linkedineUrl: companyData?.data?.linkedineUrl,
        gst: companyData?.data?.gst,
        referralEarning: companyData?.data?.referralEarning,
        totalWatchFreeTime: companyData?.data?.totalWatchFreeTime,
        privacyPolicy: companyData?.data?.privacyPolicy,
        termsCondition: companyData?.data?.termsCondition,
        aboutUs: companyData?.data?.aboutUs,
      })
    } else {
      reset({
        icon: null,
        favIcon: null,
        loader: null,
        homeBanner: [],
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        gst: '',
        xUrl: '',
        instaUrl: '',
        facebookUrl: '',
        linkedineUrl: '',
        referralEarning: 0,
        totalWatchFreeTime: 0,
        privacyPolicy: '',
        termsCondition: '',
        aboutUs: '',
      })
    }
  }, [companyData, reset])

  const onChangeIcon = (file) => {
    const { files } = file.target
    if (files && files.length !== 0) {
      setValue('icon', files[0])
    }
  }

  const handleIconChange = () => {
    iconRef.current.click()
  }

  const onChangeFavicon = (file) => {
    const { files } = file.target
    if (files && files.length !== 0) {
      setValue('favIcon', files[0])
    }
  }

  const handleFavChange = () => {
    favRef.current.click()
  }

  const onChangeLoader = (file) => {
    const { files } = file.target
    if (files && files.length !== 0) {
      setValue('loader', files[0])
    }
  }

  const handleLoaderChange = () => {
    loaderRef.current.click()
  }

  const [updateCompany] = useUpdateCompanyMutation()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      for (const key in data) {
        if (key === 'icon' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else if (key === 'favIcon' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else if (key === 'loader' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      }
      const res = await updateCompany({ data: formData, companyId: companyData?.data?._id }).unwrap()
      if (res?.success) {
        toast.success(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
        reset({
          icon: null,
          favIcon: null,
          loader: null,
          homeBanner: [],
          name: '',
          email: '',
          address: '',
          phoneNumber: '',
          gst: '',
          xUrl: '',
          instaUrl: '',
          facebookUrl: '',
          linkedineUrl: '',
          referralEarning: 0,
          totalWatchFreeTime: 0,
          privacyPolicy: '',
          termsCondition: '',
          aboutUs: '',
        })
      } else {
        toast.error(res?.message, {
          position: 'top-right',
          autoClose: 5000,
          closeButton: false,
        })
      }
    } catch (error) {
      console.log(error, 'company update error')
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        closeButton: false,
      })
    }
    setLoading(false)
  }

  const modules = {
    toolbar: [
      [
        {
          font: [],
        },
        {
          size: [],
        },
      ],
      ['bold', 'italic', 'underline', 'strike'],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
      [
        {
          script: 'super',
        },
        {
          script: 'sub',
        },
      ],
      [
        {
          header: [false, 1, 2, 3, 4, 5, 6],
        },
        'blockquote',
        'code-block',
      ],
      [
        {
          list: 'ordered',
        },
        {
          list: 'bullet',
        },
        {
          indent: '-1',
        },
        {
          indent: '+1',
        },
      ],
      [
        'direction',
        {
          align: [],
        },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  return (
    <Row>
      {isLoading || !companyData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Spinner />
        </div>
      ) : (
        <Col lg={12}>
          <Card>
            <CardHeader>
              <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
                <IconifyIcon icon="solar:settings-bold-duotone" className="text-primary fs-20" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center gap-2 mb-2">
                      <Image
                        width={100}
                        height={100}
                        src={watch('icon') instanceof File ? URL.createObjectURL(watch('icon')) : watch('icon') || avatar1}
                        alt="avatar"
                        className="avatar-xl rounded-circle border border-light border-3"
                      />
                      <input type="file" className="form-control" ref={iconRef} onChange={onChangeIcon} accept="image/png, image/jpeg" hidden />
                      <Button onClick={handleIconChange}>Upload Icon</Button>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center gap-2 mb-2">
                      <Image
                        width={100}
                        height={100}
                        src={watch('favIcon') instanceof File ? URL.createObjectURL(watch('favIcon')) : watch('favIcon') || avatar1}
                        alt="avatar"
                        className="avatar-xl rounded-circle border border-light border-3"
                      />
                      <input type="file" className="form-control" ref={favRef} onChange={onChangeFavicon} accept="image/png, image/jpeg" hidden />
                      <Button onClick={handleFavChange}>Upload favIcon</Button>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center gap-2 mb-2">
                      <Image
                        width={100}
                        height={100}
                        src={watch('loader') instanceof File ? URL.createObjectURL(watch('loader')) : watch('loader') || avatar1}
                        alt="avatar"
                        className="avatar-xl rounded-circle border border-light border-3"
                      />
                      <input type="file" className="form-control" ref={loaderRef} onChange={onChangeLoader} accept="image/png, image/jpeg" hidden />
                      <Button onClick={handleLoaderChange}>Upload loader</Button>
                    </div>
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="name" required type="text" label="Name" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="email" required type="email" label="Email" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="phoneNumber" required type="number" label="Phone Number" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="gst" required type="text" label="GST No." control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="referralEarning" required type="number" label="Referral Earning" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="totalWatchFreeTime" required type="number" label="Total Watch Free Time" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="address" required type="text" label="Address" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="xUrl" required type="text" label="Twitter Url" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="instaUrl" required type="text" label="Insta Url" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="facebookUrl" required type="text" label="Facebook Url" control={control} />
                  </Col>
                  <Col md={6}>
                    <TextFormInput name="linkedineUrl" required type="text" label="linkedIn Url" control={control} />
                  </Col>
                  <Col md={12}>
                    <ComponentContainerCard id="quill-snow-editor" title="Privacy Policy">
                      <Controller
                        name="privacyPolicy"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" modules={modules} value={field.value || ''} onChange={field.onChange} />}
                      />
                    </ComponentContainerCard>
                  </Col>
                  <Col md={12}>
                    <ComponentContainerCard id="quill-snow-editor" title="Terms Condition">
                      <Controller
                        name="termsCondition"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" modules={modules} value={field.value || ''} onChange={field.onChange} />}
                      />
                    </ComponentContainerCard>
                  </Col>
                  <Col md={12}>
                    <ComponentContainerCard id="quill-snow-editor" title="About Us">
                      <Controller
                        name="aboutUs"
                        control={control}
                        render={({ field }) => <ReactQuill theme="snow" modules={modules} value={field.value || ''} onChange={field.onChange} />}
                      />
                    </ComponentContainerCard>
                  </Col>
                  <Button type="submit" variant="primary" className="w-25 mx-auto" disabled={loading}>
                    Save
                  </Button>
                </form>
              </Row>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  )
}

export default CompanyForm
