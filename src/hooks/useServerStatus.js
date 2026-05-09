import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'

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
      const res = await fetch(`${API_BASE_URL}/actuator/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        setStatus('ready')
        return 
      }
    } catch {
    }
    setTimeout(ping, 10000) 
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