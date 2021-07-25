import request from '@/utils/request';
import { AuthService } from './type';

export async function fetchAuthInfo() {
  return request<AuthService.AuthUserResponse>('/api/auth/info', {
    method: 'GET',
  });
}
