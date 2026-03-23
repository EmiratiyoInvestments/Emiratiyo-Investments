import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../config/api'

const EMIRA_SECRET = import.meta.env.VITE_EMIRA_SECRET || '49352'

/**
 * Encapsulates the Emira analysis logic.
 * Uses fetch for native browser-side streaming support.
 */
export const performEmiraAnalysis = async ({ payload, signal }) => {
  const baseUrl = apiClient.defaults.baseURL || 'https://thecheatschool-api.fly.dev'
  
  const response = await fetch(`${baseUrl}/api/internal/analyse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Key': EMIRA_SECRET,
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    throw new Error('Analysis failed')
  }

  return response
}

export const useEmiraAnalysis = () => {
  return useMutation({
    mutationFn: performEmiraAnalysis,
    retry: 0,
  })
}
