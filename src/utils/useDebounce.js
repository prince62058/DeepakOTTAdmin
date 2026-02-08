import { useEffect, useState } from 'react'

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(handler) // Cancel the timeout if value or delay changes
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
