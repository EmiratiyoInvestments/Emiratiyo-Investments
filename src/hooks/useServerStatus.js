import { useState, useEffect } from 'react';
import axios from 'axios';
import { HEALTH_CHECK_URL } from '../config/api';
export function useServerStatus() {
  const [status, setStatus] = useState('connecting');
  const wakeServer = async () => {
    try {
      const res = await axios.get(HEALTH_CHECK_URL, {
        signal: AbortSignal.timeout(8000)
      });
      if (res.status === 200) {
        setStatus('ready');
        return true;
      }
    } catch (err) {}
    return false;
  };
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 5;
    const initialWake = async () => {
      const success = await wakeServer();
      if (!success && mounted && retryCount < maxRetries) {
        retryCount++;
        setTimeout(initialWake, 3000);
      } else if (!success && retryCount >= maxRetries) {
        setStatus('error');
      }
    };
    initialWake();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        wakeServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return {
    status,
    isReady: status === 'ready',
    isConnecting: status === 'connecting',
    isError: status === 'error'
  };
}
