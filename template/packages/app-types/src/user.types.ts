import { z } from 'zod';

import {
  forgotPasswordSchema,
  resendEmailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateUserSchema,
  userSchema,
} from 'schemas';

import { BackendFile, FrontendFile } from './common.types';

export type User = z.infer<typeof userSchema>;

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
export type ResendEmailParams = z.infer<typeof resendEmailSchema>;
export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;

// Empty string indicates avatar removal
export interface UpdateUserParamsFrontend extends Omit<UpdateUserParams, 'avatar'> {
  avatar?: FrontendFile | '';
}

export interface UpdateUserParamsBackend extends Omit<UpdateUserParams, 'avatar'> {
  avatar?: BackendFile | '';
}
