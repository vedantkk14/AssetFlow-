import { User } from '@prisma/client';
import { ApiError } from '../../utils/apiError';
import { comparePassword, hashPassword } from '../../utils/hash';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import * as authRepository from './auth.repository';
import {
  AuthResult,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from './auth.types';

const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  departmentId: user.departmentId,
  status: user.status,
});

export const signup = async (input: SignupInput): Promise<AuthUser> => {
  const existing = await authRepository.findUserByEmail(input.email);

  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const hashedPassword = await hashPassword(input.password);
  const user = await authRepository.createUser({ ...input, password: hashedPassword });

  return toAuthUser(user);
};

export const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await authRepository.findUserByEmail(input.email);

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.status === 'INACTIVE') {
    throw ApiError.forbidden('This account has been deactivated');
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const payload = { id: user.id, role: user.role };

  return {
    user: toAuthUser(user),
    token: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const getCurrentUser = async (userId: string): Promise<AuthUser> => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }

  return toAuthUser(user);
};

// Stub: no email dispatch wired up yet. Always responds with a generic message
// so the endpoint doesn't leak which emails are registered.
export const forgotPassword = async (_input: ForgotPasswordInput): Promise<void> => {
  return;
};

// Stub: no password-reset-token store exists yet (out of scope for the auth-only
// User model). Wire up a reset token table/flow when this is needed for real.
export const resetPassword = async (_input: ResetPasswordInput): Promise<void> => {
  return;
};
