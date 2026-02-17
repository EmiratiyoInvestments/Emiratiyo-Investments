import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from './api'

export const emContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+()\-\s]{7,20}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  message: z.string().optional(),
})

export const submitEmContact = async (payload) => {
  const parsed = emContactSchema.parse(payload)
  const response = await apiClient.post('/api/em/contact', parsed)
  return response.data
}

export const useSubmitEmContact = () => {
  return useMutation({
    mutationFn: submitEmContact,
    retry: 1,
  })
}
