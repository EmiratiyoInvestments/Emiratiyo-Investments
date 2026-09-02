import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../config/api';
const EMIRA_SECRET = import.meta.env.VITE_EMIRA_SECRET || '49352';
export const performEmiraAnalysis = async ({
  payload,
  signal
}) => {
  const response = await apiClient.post('internal/emira/analyse', payload, {
    headers: {
      'X-Internal-Key': EMIRA_SECRET
    },
    signal
  });
  return response.data.data;
};
export const useEmiraAnalysis = () => {
  return useMutation({
    mutationFn: performEmiraAnalysis,
    retry: 0
  });
};
