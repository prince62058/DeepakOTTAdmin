'use client'

import Choices from 'choices.js'
import { useEffect, useRef } from 'react'

const ChoicesFormInput = ({
  children,
  multiple,
  className,
  onChange,
  value,
  allowInput,
  options,
  ...props
}) => {
  const choicesRef = useRef(null)
  const choicesInstance = useRef(null)

  // ⭐ Initialize ONCE
  useEffect(() => {
    if (!choicesRef.current) return
    if (choicesInstance.current) return   // ❗ Do NOT recreate

    choicesInstance.current = new Choices(choicesRef.current, {
      ...options,
      placeholder: true,
      allowHTML: true,
      shouldSort: false,
    })

    // change handler
    choicesRef.current.addEventListener('change', () => {
      const values = choicesInstance.current.getValue(true)
      if (onChange) onChange(values)
    })

    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy()
        choicesInstance.current = null
      }
    }
  }, [])

  // ⭐ Update selected values without destroying component
  useEffect(() => {
    if (!choicesInstance.current) return

    // Clear active items
    choicesInstance.current.removeActiveItems()

    // Set new values
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((val) => {
        choicesInstance.current.setChoiceByValue(val)
      })
    }
  }, [value])

  if (allowInput) {
    return (
      <input
        ref={choicesRef}
        multiple={multiple}
        className={className}
        {...props}
      />
    )
  }

  return (
    <select ref={choicesRef} multiple={multiple} className={className} {...props}>
      {children}
    </select>
  )
}

export default ChoicesFormInput
