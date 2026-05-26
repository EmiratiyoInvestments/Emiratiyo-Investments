import { useState, useEffect } from 'react'
import { apiClient } from '../config/api'

export function useServerStatus() {
  const [status, setStatus] = useState('connecting')
  //https://emiratiyo-api.fly.dev/actuator/health'

  const wakeServer = async () => {
    try {
      const res = await apiClient.get('', {
        signal: AbortSignal.timeout(8000),
      })
      if (res.status === 200 && res.data?.status === 'UP') {
        setStatus('ready')
        return true
      }
    } catch (err) {
      // Server is likely sleeping or booting
    }
    return false
  }

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 5 // Limited retries on initial load to avoid infinite loops

    const initialWake = async () => {
      const success = await wakeServer()
      if (!success && mounted && retryCount < maxRetries) {
        retryCount++
        setTimeout(initialWake, 3000) // 3s delay between initial load retries
      } else if (!success && retryCount >= maxRetries) {
        setStatus('error')
      }
    }

    initialWake()

    // Page Visibility API: Ping ONCE when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        wakeServer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return {
    status,
    isReady: status === 'ready',
    isConnecting: status === 'connecting',
    isError: status === 'error'
  }
}