import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from './api'

export const emBusinessSetupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z
    .string()
    .min(7, 'Mobile number is too short')
    .max(20, 'Mobile number is too long')
    .regex(/^[0-9+()\-\s]{7,20}$/, 'Invalid mobile number'),
  countryOfResidence: z.string().min(2, 'Country is required'),
})

export const submitEmBusinessSetup = async (payload) => {
  const parsed = emBusinessSetupSchema.parse(payload)
  const response = await apiClient.post('/api/em/business-setup', parsed)
  return response.data
}

export const useSubmitEmBusinessSetup = () => {
  return useMutation({
    mutationFn: submitEmBusinessSetup,
    retry: 1,
  })
}
