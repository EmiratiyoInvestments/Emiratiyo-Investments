import { useState, useEffect } from 'react'
import { apiClient } from '../config/api'

let _status = 'connecting'
let _listeners = new Set()

const notify = () => _listeners.forEach((fn) => fn(_status))

const setStatus = (next) => {
  if (_status !== next) {
    _status = next
    notify()
  }
}

let _started = false

const startPoller = () => {
  if (_started) return
  _started = true

  const ping = async () => {
    try {
      const res = await apiClient.get('https://emiratiyo-api.fly.dev/actuator/health', {
        signal: AbortSignal.timeout(8000),
      })
      if (res.status === 200 && res.data?.status === 'UP') {
        setStatus('ready')
        setTimeout(ping, 25000) 
        return 
      }
    } catch {
    }
    setTimeout(ping, 2000) 
  }

  ping()
}

export const useServerStatus = () => {
  const [status, setLocalStatus] = useState(_status)

  useEffect(() => {
    startPoller()

    const listener = (next) => setLocalStatus(next)
    _listeners.add(listener)

    setLocalStatus(_status)

    return () => _listeners.delete(listener)
  }, [])

  return {
    status,                       
    isReady: status === 'ready',
    isConnecting: status === 'connecting',
  }
}