'use client'

import { useEffect, useCallback } from 'react'

type Props = {
  error: Error
  reset(): void
}

export default function Error({ error, reset }: Props) {
  const logError = useCallback(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    logError()
  }, [logError])

  return <div>not found</div>
}
