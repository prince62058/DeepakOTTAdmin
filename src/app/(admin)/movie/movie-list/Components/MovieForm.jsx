import axios from 'axios'
import { ProgressBar } from 'react-bootstrap'

// ... existing imports ...

import TextFormInput from '@/components/form/TextFormInput'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import {
  useCreateMovieMutation,
  useGetGenreQuery,
  useGetLanguageQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useUploadMovieMutation,
} from '@/lib/api'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, FormLabel, FormSelect, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import Link from 'next/link'
import useDebounce from '@/utils/useDebounce'
import SeasonItem from './SeasonItem'

const MovieForm = ({ currentData, isUpdate, isTrue, toggle }) => {
  const videoRef = useRef()
  const teaserRef = useRef()
  const posterRef = useRef()
  const [loading, setLoading] = useState(false)
  const [percent, setPercent] = useState(0) // Progress state
  const [searchGenre, setSearchGenre] = useState('')
  const [searchLanguage, setSearchLanguage] = useState('')

  const debounceSearchGenre = useDebounce(searchGenre, 500)
  const debounceSearchLanguage = useDebounce(searchLanguage, 500)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      file: '',
      poster: '',
      teaserUrl: '',
      name: '',
      description: '',
      releaseDate: '',
      releaseYear: '',
      director: '',
      writer: '',
      cast: [],
      subSeries: [],
      maturityInfo: '',
      totalDuration: '',
      teaserDuration: '',
      genre: [],
      language: [],
      mainType: 'MOVIE',
      rating: '',
      imdbRating: '',
      watchQuality: '',
    },
    mode: 'onChange',
  })

  const {
    fields: castFields,
    append: addCast,
    remove: removeCast,
  } = useFieldArray({
    control,
    name: 'cast',
  })

  // Separate useFieldArray for subSeries
  const {
    fields: subSeriesFields,
    append: addSubSeries,
    remove: removeSubSeries,
  } = useFieldArray({
    control,
    name: 'subSeries',
  })

  useEffect(() => {
    if (isUpdate && currentData) {
      reset(
        currentData.mainType === 'WEB_SERIES'
          ? {
              ...currentData,
              subSeries:
                currentData?.subSeries?.map((season) => ({
                  session: season.session,
                  Series:
                    season.Series?.map((ep) => ({
                      title: ep.title || '',
                      url: ep.file || '',
                      thumbnail: ep.poster || '',
                    })) || [],
                  // metadata from season
                  name: season.name || '',
                  description: season.description || '',
                  // ... other fields if seasons have diverse metadata
                })) || [],
              releaseDate: currentData?.releaseDate ? new Date(currentData.releaseDate).toISOString().split('T')[0] : '',
              name: currentData?.name || '',
              description: currentData?.description || '',
              releaseYear: currentData?.releaseYear || '',
              director: currentData?.director || '',
              writer: currentData?.writer || '',
              maturityInfo: currentData?.maturityInfo || '',
              teaserUrl: currentData?.teaserUrl || '',
              totalDuration: currentData?.totalDuration || '',
              rating: currentData?.rating || '',
              imdbRating: currentData?.imdbRating || '',
              cast: currentData?.cast || [],
              genre: currentData?.genre?.map((g) => g._id) || [],
              language: currentData?.language?.map((l) => l._id) || [],
            }
          : {
              ...currentData,
              releaseDate: currentData?.releaseDate ? new Date(currentData.releaseDate).toISOString().split('T')[0] : '',
              genre: currentData?.genre?.map((g) => g._id) || [],
              language: currentData?.language?.map((l) => l._id) || [],
              teaserDuration: currentData?.teaserDuration || '',
            },
      )
    } else {
      reset({
        file: '',
        poster: '',
        teaserUrl: '',
        name: '',
        description: '',
        releaseDate: '',
        releaseYear: '',
        director: '',
        writer: '',
        cast: [],
        subSeries: [],
        maturityInfo: '',
        totalDuration: '',
        teaserDuration: '',
        genre: [],
        language: [],
        mainType: 'MOVIE',
        rating: '',
        imdbRating: '',
        watchQuality: '',
      })
    }
  }, [currentData, isUpdate, reset, isTrue])

  useEffect(() => {
    const mainType = watch('mainType')
    if (mainType === 'MOVIE') {
      setValue('subSeries', [])
    }
  }, [watch, setValue])

  const [uploadImg] = useUploadImageMutation()
  const [uploadMovie] = useUploadMovieMutation()
  const [createMovie] = useCreateMovieMutation()
  const [updateMovie] = useUpdateMovieMutation()

  // Upload handler (image)
  const uploadFileHandler = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await uploadImg(formData).unwrap()
    if (res?.success) {
      // toast.success(res?.message, { position: 'top-right', autoClose: 1000, closeButton: false })
      return res?.URL || ''
    } else {
      // toast.error(res?.message, { position: 'top-right', autoClose: 2000, closeButton: false })
      return ''
    }
  }

  // Upload handler (video)
  // Upload handler (video)
  // Upload handler (video) - Direct S3 Upload
  const uploadVideoFileHandler = async (file) => {
    try {
      // FIX: Handle .mkv files which might have empty type
      let fileType = file.type
      // If type is empty OR generic binary stream, and extension is .mkv, force correct MIME type
      if ((!fileType || fileType === 'application/octet-stream') && file.name.toLowerCase().endsWith('.mkv')) {
        fileType = 'video/x-matroska'
      }

      // 1. Get Presigned URL from Backend
      const { data: presignedData } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getPresignedUrl`, {
        fileName: file.name,
        fileType: fileType || file.type, // Use corrected type or fallback to original
      })

      if (!presignedData.success) {
        throw new Error('Failed to get presigned URL')
      }

      const { url, publicUrl } = presignedData

      // 2. Upload File Directly to S3 (DigitalOcean Spaces)
      await axios.put(url, file, {
        headers: {
          'Content-Type': fileType || file.type,
          'x-amz-acl': 'public-read', // Ensure it's public
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent
          let percent = Math.floor((loaded * 100) / total)
          console.log(`${loaded}kb of ${total}kb | ${percent}%`)
          setPercent(percent)
        },
      })

      return publicUrl
    } catch (err) {
      console.error('Upload error details:', err.response?.data || err.message)
      toast.error(`Upload failed: ${err.response?.data?.message || err.message}`)
      return ''
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let finalData = { ...data }

      // Handle uploads (reuse your existing handlers)
      const uploadImageIfNeeded = async (file) => {
        if (file && file instanceof File) return await uploadFileHandler(file)
        return file
      }

      const uploadVideoIfNeeded = async (file) => {
        if (file && file instanceof File) return await uploadVideoFileHandler(file)
        return file
      }

      // 🎬 If type is MOVIE — existing logic works fine
      if (data.mainType === 'MOVIE') {
        let videoUrl = await uploadVideoIfNeeded(data.file)
        let teaserUrl = await uploadVideoIfNeeded(data.teaserUrl)
        let posterUrl = await uploadImageIfNeeded(data.poster)

        const castWithUploadedImages = await Promise.all(
          data.cast.map(async (member) => ({
            ...member,
            image: await uploadImageIfNeeded(member.image),
          })),
        )

        finalData = {
          ...data,
          file: videoUrl,
          teaserUrl,
          poster: posterUrl,
          cast: castWithUploadedImages,
          teaserDuration: data.teaserDuration,
          totalDuration: data.totalDuration,
        }
      }

      // 🎥 If type is WEB_SERIES — build nested structure
      else if (data.mainType === 'WEB_SERIES') {
        // Upload cast images
        const castWithUploadedImages = await Promise.all(
          data.cast.map(async (member) => ({
            ...member,
            image: await uploadImageIfNeeded(member.image),
          })),
        )

        // Upload teaser and poster
        const teaserUrl = await uploadVideoIfNeeded(data.teaserUrl)
        const posterUrl = await uploadImageIfNeeded(data.poster)

        // Create the final Web Series structure (Seasons)
        const sessionsData = await Promise.all(
          data.subSeries.map(async (season, sIdx) => {
            const seriesEpisodes = await Promise.all(
              (season.Series || []).map(async (episode) => ({
                title: episode.title || '',
                file: await uploadVideoIfNeeded(episode.url),
                poster: await uploadImageIfNeeded(episode.thumbnail || ''),
              })),
            )
            return {
              ...season, // Keep existing metadata if any
              session: sIdx + 1,
              Series: seriesEpisodes,
              // Inherit parent metadata for season as fallback/default
              name: data.name,
              description: data.description,
              releaseDate: data.releaseDate,
              releaseYear: data.releaseYear,
              director: data.director,
              writer: data.writer,
              maturityInfo: data.maturityInfo,
              totalDuration: data.totalDuration,
              rating: Number(data.rating),
              imdbRating: Number(data.imdbRating),
            }
          }),
        )

        finalData = {
          genre: data.genre,
          language: data.language,
          mainType: 'WEB_SERIES',
          parentsSeries: null,
          subSeries: sessionsData,
          poster: posterUrl,
          watchQuality: data.watchQuality,
          name: data.name,
          description: data.description,
          releaseDate: data.releaseDate,
          releaseYear: data.releaseYear,
          director: data.director,
          writer: data.writer,
          cast: castWithUploadedImages,
          maturityInfo: data.maturityInfo,
          totalDuration: data.totalDuration,
          teaserDuration: data.teaserDuration,
          rating: Number(data.rating),
        }
      }

      // 🚀 Submit to API
      const res = isUpdate
        ? await updateMovie({ data: { ...finalData, movieOrSeriesId: currentData?._id } }).unwrap()
        : await createMovie(finalData).unwrap()

      if (res?.success) {
        toast.success(res?.message, { position: 'top-right', autoClose: 3000, closeButton: false })
        toggle()
        reset()
      } else {
        toast.error(res?.message || 'Something went wrong', { position: 'top-right', autoClose: 3000, closeButton: false })
      }
    } catch (error) {
      console.error('movie create/update error', error)
      toast.error(error?.data?.message || 'Error occurred', { position: 'top-right', autoClose: 3000, closeButton: false })
    }
    setLoading(false)
  }

  const { data: genreData } = useGetGenreQuery({ page: 1, search: debounceSearchGenre, disable: false })
  const { data: languageData } = useGetLanguageQuery({ page: 1, search: debounceSearchLanguage, disable: false })

  return (
    <Modal show={isTrue} onHide={toggle} className="fade" scrollable centered>
      <ModalHeader>
        <h5 className="modal-title">{isUpdate ? 'Edit' : 'Create'} Movie</h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>

      <ModalBody>
        {percent > 0 && (
          <div className="mb-3">
            <ProgressBar now={percent} label={`${percent}%`} animated striped variant="success" />
            <p className="text-center mt-1 text-muted">
              {percent >= 95 ? 'Finalizing on server... Please wait.' : 'Uploading Media... Please wait.'}
            </p>
          </div>
        )}
        <form className="row g-2" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info */}
          <Col md={12}>
            <TextFormInput name="name" required type="text" label="Name*" control={control} />
          </Col>
          <Col md={12}>
            <TextAreaFormInput name="description" label="Description*" control={control} rows={5} />
          </Col>
          <Col md={6}>
            <TextFormInput name="releaseDate" required type="date" label="Release Date*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="releaseYear" required type="number" label="Release Year*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="director" required type="text" label="Director*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="writer" required type="text" label="Writer*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="maturityInfo" required type="text" label="Maturity Info*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="totalDuration" required type="text" label="Duration*" control={control} />
          </Col>
          {/* Other Info */}
          <Col md={6}>
            <FormLabel>Select Main Type</FormLabel>
            <Controller
              name="mainType"
              control={control}
              render={({ field }) => (
                <FormSelect {...field}>
                  <option value="MOVIE">Movie</option>
                  <option value="WEB_SERIES">Web Series</option>
                </FormSelect>
              )}
            />
          </Col>
          <Col md={6}>
            <TextFormInput name="rating" required type="number" label="Movie Rating*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="imdbRating" required type="number" label="IMDb Rating*" control={control} />
          </Col>
          <Col md={6}>
            <TextFormInput name="watchQuality" required type="text" label="Watch Quality*" control={control} />
          </Col>
          {/* Genre */}
          <Col md={12}>
            <label className="form-label">Select Genre*</label>
            <Controller
              name="genre"
              control={control}
              render={({ field }) => (
                <ChoicesFormInput
                  className="form-control"
                  id="choices-multiple-genre"
                  multiple
                  value={field.value || []}
                  onChange={(selectedValues) => field.onChange(selectedValues)}>
                  {genreData?.data?.map((ele) => (
                    <option key={ele?._id} value={ele?._id}>
                      {ele?.name}
                    </option>
                  ))}
                </ChoicesFormInput>
              )}
            />
          </Col>
          {/* Language */}
          <Col md={12}>
            <label className="form-label">Select Language*</label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <ChoicesFormInput
                  className="form-control"
                  id="choices-multiple-language"
                  multiple
                  value={field.value || []}
                  onChange={(selectedValues) => field.onChange(selectedValues)}>
                  {languageData?.data?.map((ele) => (
                    <option key={ele?._id} value={ele?._id}>
                      {ele?.name}
                    </option>
                  ))}
                </ChoicesFormInput>
              )}
            />
          </Col>
          {/* ✅ Cast Section */}
          <Col md={12}>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <FormLabel>Cast</FormLabel>
                <Button type="button" variant="outline-primary" size="sm" onClick={() => addCast({ name: '', role: '', image: '' })}>
                  + Add Cast
                </Button>
              </div>

              {castFields.length === 0 && <p className="text-muted">No cast members added yet.</p>}

              {castFields.map((item, index) => (
                <div key={item.id} className="border rounded p-3 mb-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Cast #{index + 1}</h6>
                    <Button variant="outline-danger" size="sm" onClick={() => removeCast(index)}>
                      Remove
                    </Button>
                  </div>

                  <Row className="g-2">
                    <Col md={12}>
                      <TextFormInput name={`cast.${index}.name`} control={control} label="Name*" required placeholder="Actor name" />
                    </Col>
                    <Col md={12}>
                      <TextFormInput name={`cast.${index}.role`} control={control} label="Role*" required placeholder="Character name" />
                    </Col>

                    <Col md={12}>
                      <div className="d-flex flex-column align-items-center gap-2 mb-2">
                        {watch(`cast.${index}.image`) ? (
                          <Image
                            width={100}
                            height={100}
                            src={
                              watch(`cast.${index}.image`) instanceof File
                                ? URL.createObjectURL(watch(`cast.${index}.image`))
                                : watch(`cast.${index}.image`)
                            }
                            alt={`cast-${index}`}
                            className="avatar-xl rounded-circle border border-light border-3"
                          />
                        ) : (
                          <Image
                            width={100}
                            height={100}
                            src={avatar1}
                            alt="no-image"
                            className="avatar-xl rounded-circle border border-light border-3"
                          />
                        )}

                        <input
                          type="file"
                          id={`cast-image-${index}`}
                          className="form-control"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setValue(`cast.${index}.image`, file)
                          }}
                          accept="image/png, image/jpeg"
                          hidden
                        />

                        <Button onClick={() => document.getElementById(`cast-image-${index}`).click()}>Upload Image</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>
          {/* Video Upload */}
          {/* <Col md={12}>
            <label className="form-label">Select Teaser*</label>
            <div className="d-flex flex-column align-items-center gap-2 mb-2">
              {watch('teaserUrl') ? (
                <video width={240} height={140} controls   controlsList="nodownload" className="rounded border border-light border-3">
                  <source src={watch('teaserUrl') instanceof File ? URL.createObjectURL(watch('teaserUrl')) : watch('teaserUrl')} />
                </video>
              ) : (
                <Image width={100} height={100} src={avatar1} alt="no-video" className="avatar-xl rounded-circle border border-light border-3" />
              )}
              <input type="file" ref={teaserRef} onChange={(e) => setValue('teaserUrl', e.target.files[0])} accept="video/*" hidden />
              <Button onClick={() => teaserRef.current.click()}>Upload Teaser</Button>
            </div>
          </Col> */}
          <Col md={12}>
            <label className="form-label">
              Select Teaser* <span className="text-danger">(Required for Movie)</span>
            </label>
            <Controller
              name="teaserUrl"
              control={control}
              rules={{
                required: watch('teaserUrl') === '' ? 'Teaser video is required' : false,
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="d-flex flex-column align-items-center gap-3">
                  {field.value ? (
                    <video
                      width={320}
                      height={180}
                      controls
                      controlsList="nodownload"
                      className="rounded border border-light border-3 shadow-sm"
                      key={field.value instanceof File ? field.value.name + field.value.size : field.value} // Forces re-render
                      onLoadedMetadata={(e) => {
                        const duration = e.target.duration
                        if (duration && !watch('teaserDuration')) {
                          const hours = Math.floor(duration / 3600)
                          const minutes = Math.floor((duration % 3600) / 60)
                          const seconds = Math.floor(duration % 60)
                          const formatted = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
                          setValue('teaserDuration', formatted)
                          console.log('Teaser Duration detected:', formatted)
                        }
                      }}>
                      <source src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div
                      className="bg-light border-dashed border-2 border-gray-300 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 320, height: 180 }}>
                      <span className="text-muted">No teaser selected</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={teaserRef}
                    accept="video/*, .mkv"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange(file) // This is better than setValue
                        // Optional: reset input so same file can be re-selected
                        e.target.value = ''
                      }
                    }}
                  />
                  <Button variant={field.value ? 'outline-success' : 'primary'} onClick={() => teaserRef.current?.click()}>
                    {field.value ? 'Change Teaser' : 'Upload Teaser'}
                  </Button>
                  {error && <small className="text-danger h4">{error.message}</small>}
                  {/* {field.value && (
                    <Button variant="outline-danger" size="sm" onClick={() => field.onChange(null)}>
                      Remove Teaser
                    </Button>
                  )} */}
                </div>
              )}
            />
          </Col>
          {/* Video Upload */}
          {/* {watch(`mainType`) === 'WEB_SERIES' ? null : (
            <Col md={12}>
              <label className="form-label">Select Movie*</label>
              <div className="d-flex flex-column align-items-center gap-2 mb-2">
                {watch('file') ? (
                  <video width={240} height={140} controls controlsList="nodownload" className="rounded border border-light border-3">
                    <source src={watch('file') instanceof File ? URL.createObjectURL(watch('file')) : watch('file')} />
                  </video>
                ) : (
                  <Image width={100} height={100} src={avatar1} alt="no-video" className="avatar-xl rounded-circle border border-light border-3" />
                )}
                <input type="file" ref={videoRef} onChange={(e) => setValue('file', e.target.files[0])} accept="video/*" hidden />
                <Button onClick={() => videoRef.current.click()}>Upload Movie</Button>
              </div>
            </Col>
          )} */}
          {watch('mainType') !== 'WEB_SERIES' && (
            <Col md={12}>
              <label className="form-label">
                Select Movie Video* <span className="text-danger">(Required for Movie)</span>
              </label>
              <Controller
                name="file"
                control={control}
                rules={{
                  required: watch('mainType') === 'MOVIE' ? 'Movie video is required' : false,
                }}
                render={({ field, fieldState: { error } }) => (
                  <div className="d-flex flex-column align-items-center gap-3">
                    {field.value ? (
                      <video
                        width={320}
                        height={180}
                        controls
                        controlsList="nodownload"
                        className="rounded border border-light border-3 shadow-sm"
                        key={field.value instanceof File ? field.value.name + field.value.size : field.value}
                        onLoadedMetadata={(e) => {
                          const duration = e.target.duration
                          if (duration && !watch('totalDuration')) {
                            const hours = Math.floor(duration / 3600)
                            const minutes = Math.floor((duration % 3600) / 60)
                            const seconds = Math.floor(duration % 60)
                            const formatted = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
                            setValue('totalDuration', formatted)
                            console.log('Movie Duration detected:', formatted)
                          }
                        }}>
                        <source src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value} />
                      </video>
                    ) : (
                      <div
                        className="bg-light border-dashed border-2 border-gray-300 rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 320, height: 180 }}>
                        <span className="text-muted">No movie selected</span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={videoRef}
                      accept="video/*, .mkv"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                          e.target.value = ''
                        }
                      }}
                    />
                    <Button variant={field.value ? 'outline-success' : 'primary'} onClick={() => videoRef.current?.click()}>
                      {field.value ? 'Change Movie' : 'Upload Movie'}
                    </Button>
                    {error && <small className="text-danger h4">{error.message}</small>}
                    {/* {field.value && (
                      <Button variant="outline-danger" size="sm" onClick={() => field.onChange(null)}>
                        Remove
                      </Button>
                    )} */}
                  </div>
                )}
              />
            </Col>
          )}
          {/* Poster Upload */}
          {/* {watch(`mainType`) === 'WEB_SERIES' ? null : (
            <Col md={12}>
              <label className="form-label">Select Movie Poster*</label>
              <div className="d-flex flex-column align-items-center gap-2 mb-2">
                {watch('poster') ? (
                  <Image
                    width={180}
                    height={180}
                    src={watch('poster') instanceof File ? URL.createObjectURL(watch('poster')) : watch('poster')}
                    alt="poster"
                    className="rounded border border-light border-3"
                  />
                ) : (
                  <Image width={100} height={100} src={avatar1} alt="no-poster" className="avatar-xl rounded-circle border border-light border-3" />
                )}
                <input type="file" ref={posterRef} onChange={(e) => setValue('poster', e.target.files[0])} accept="image/*" hidden />
                <Button onClick={() => posterRef.current.click()}>Upload Poster</Button>
              </div>
            </Col>
          )} */}
          <Col md={12}>
            <label className="form-label">
              Movie Poster* <span className="text-danger">(Required for Movie)</span>
            </label>
            <Controller
              name="poster"
              control={control}
              rules={{
                required: watch('mainType') === 'MOVIE' ? 'Poster is required' : false,
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="d-flex flex-column align-items-center gap-3">
                  <Image
                    width={300}
                    height={200}
                    src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value || avatar1}
                    alt="Poster"
                    className="rounded shadow-sm border"
                    style={{ objectFit: 'cover' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={posterRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange(file)
                        e.target.value = ''
                      }
                    }}
                  />
                  <Button onClick={() => posterRef.current?.click()}>{field.value ? 'Change Poster' : 'Upload Poster'}</Button>
                  {error && <small className="text-danger h4 d-block">{error.message}</small>}
                </div>
              )}
            />
          </Col>
          {/* Sub series */}
          {watch(`mainType`) === 'WEB_SERIES' ? (
            <Col md={12}>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <FormLabel>Web Series Seasons</FormLabel>
                  <Button type="button" variant="outline-primary" size="sm" onClick={() => addSubSeries({ Series: [] })}>
                    + Add Season
                  </Button>
                </div>

                {subSeriesFields.length === 0 && <p className="text-muted">No seasons added yet.</p>}

                {subSeriesFields.map((item, index) => (
                  <SeasonItem key={item.id} control={control} nestIndex={index} setValue={setValue} watch={watch} removeSeason={removeSubSeries} />
                ))}
              </div>
            </Col>
          ) : null}
          <ModalFooter className="d-block">
            {percent > 0 && (
              <div className="mb-3 w-100">
                <ProgressBar now={percent} label={`${percent}%`} animated striped variant="success" />
                <p className="text-center mt-1 text-muted small">
                  {percent >= 95 ? 'Finalizing on server... Do not close this window.' : 'Uploading Media... Do not close this window.'}
                </p>
              </div>
            )}
            <div className="d-flex justify-content-end gap-2">
              <Button type="button" variant="secondary" onClick={toggle}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default MovieForm
