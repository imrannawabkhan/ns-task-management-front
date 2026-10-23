import { api } from '../../lib/api';
import type { SignInResponse } from '../../types';

export async function signIn(username: string, password: string): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>('/auth/signin', { username, password });
  return response.data;
}

export async function signUp(username: string, password: string): Promise<void> {
  await api.post('/auth/signup', { username, password });
}
