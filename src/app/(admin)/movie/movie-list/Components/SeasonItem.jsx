import React from 'react'
import { Button, Col, FormLabel, Row } from 'react-bootstrap'
import { useFieldArray } from 'react-hook-form'
import TextFormInput from '@/components/form/TextFormInput'
import Image from 'next/image'
import avatar1 from '@/assets/images/users/dummy-avatar.jpg'

const SeasonItem = ({ control, nestIndex, setValue, watch, removeSeason }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `subSeries.${nestIndex}.Series`,
  })

  // Helper to handle file selection
  const handleFileChange = (e, path) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue(path, file)
    }
  }

  // Helper to render preview
  const renderPreview = (file) => {
    if (file instanceof File) return URL.createObjectURL(file)
    return file || avatar1
  }

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 text-primary">Season {nestIndex + 1}</h5>
        <div>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => append({ title: '', url: '', thumbnail: '' })}>
            + Add Episode
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => removeSeason(nestIndex)}>
            Remove Season
          </Button>
        </div>
      </div>

      <Row className="g-3">
        {/* Season Level Metadata (Optional, can be added here if needed) */}

        {fields.map((item, k) => (
          <Col md={12} key={item.id}>
            <div className="border border-2 rounded p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Episode {k + 1}</h6>
                <Button variant="outline-danger" size="sm" onClick={() => remove(k)}>
                  Remove
                </Button>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <TextFormInput
                    name={`subSeries.${nestIndex}.Series.${k}.title`}
                    control={control}
                    label="Episode Title*"
                    required
                    placeholder="e.g. The Beginning"
                  />
                </Col>

                {/* Thumbnail Upload */}
                <Col md={6}>
                  <FormLabel>Thumbnail</FormLabel>
                  <div className="d-flex align-items-center gap-3">
                    <Image
                      width={80}
                      height={60}
                      src={renderPreview(watch(`subSeries.${nestIndex}.Series.${k}.thumbnail`))}
                      alt="thumb"
                      className="rounded object-fit-cover"
                    />
                    <div>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, `subSeries.${nestIndex}.Series.${k}.thumbnail`)}
                      />
                    </div>
                  </div>
                </Col>

                {/* Video URL / Upload */}
                <Col md={12}>
                  <FormLabel>Video File</FormLabel>
                  <div className="d-flex align-items-center gap-3">
                    {watch(`subSeries.${nestIndex}.Series.${k}.url`) ? (
                      <span className="badge bg-success">Selected</span>
                    ) : (
                      <span className="badge bg-secondary">No Video</span>
                    )}
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      accept="video/*, .mkv"
                      onChange={(e) => handleFileChange(e, `subSeries.${nestIndex}.Series.${k}.url`)}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        ))}
        {fields.length === 0 && <p className="text-muted text-center my-2">No episodes in this season.</p>}
      </Row>
    </div>
  )
}

export default SeasonItem
