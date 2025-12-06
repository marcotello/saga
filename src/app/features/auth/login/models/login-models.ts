import { User } from "../../../../core/models/user";


export interface CredentialInput {
  credential: string;
  password: string;
}

export interface CredentialOutput {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
}

export interface AuthSuccessPayload {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
}

export interface AuthSuccessEnvelope {
  status: 'success';
  message: string;
  data: AuthSuccessPayload;
}

export type ErrorCode = 'INVALID_INPUT' | 'INVALID_CREDENTIALS' | 'INTERNAL_SERVER_ERROR';

export interface ErrorEnvelope {
  status: 'error';
  code: ErrorCode;
  message: string;
}

export type LoginViewState = 'idle' | 'submitting' | 'success' | 'error';

export interface AuthSession {
  accessToken: string | null;
  tokenType: 'Bearer' | null;
  expiresAt: number | null;
  user: User | null;
}

