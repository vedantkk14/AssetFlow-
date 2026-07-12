import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ApiSuccessResponse } from '@/types/api.types';
import { User } from '@/types/user.types';
import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
} from '../types/auth.types';

export const signupRequest = async (payload: SignupPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<{ user: User }>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    payload
  );
  return data.data;
};

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return data.data;
};

export const logoutRequest = async () => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
};

export const meRequest = async () => {
  const { data } = await axiosInstance.get<ApiSuccessResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);
  return data.data.user;
};

export const forgotPasswordRequest = async (payload: ForgotPasswordPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  return data;
};

export const resetPasswordRequest = async (payload: ResetPasswordPayload) => {
  const { data } = await axiosInstance.post<ApiSuccessResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  return data;
};
