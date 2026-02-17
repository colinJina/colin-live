
import { useQuery } from '@tanstack/react-query';
import { getCheckCode } from '../../api/auth';

export const useCheckCode = () => {
  return useQuery({
    queryKey: ['checkCode'],
    queryFn: async () => {
      const response = await getCheckCode();
      return response?.data;
    },
    refetchOnWindowFocus: false, // Captcha shouldn't refresh on window focus
  });
};
