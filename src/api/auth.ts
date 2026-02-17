
import request from './request';

export interface CheckCodeResponse {
  checkCode: string; // Base64 image
  checkCodeKey: string; // Verification key
}

export const getCheckCode = () => {
  return request<CheckCodeResponse>({
    url: '/account/checkCode',
    method: 'GET',
  });
};
