/**
 * Type definitions for login feature aligned with OpenAPI contract
 * Contract: specs/006-refactor-login/contracts/openapi.yaml
 */

// Request payload
export interface CredentialInput {
  credential: string;
  password: string;
}

// User entity
export interface User {
  id: number;
  username: string;
  name: string;
  lastName: string;
  email: string;
  bio?: string | null;
  role: string;
}

// Success envelope payload
export interface AuthSuccessPayload {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
}

// Success envelope
export interface AuthSuccessEnvelope {
  status: 'success';
  message: string;
  data: AuthSuccessPayload;
}

// Error codes
export type ErrorCode = 'INVALID_INPUT' | 'INVALID_CREDENTIALS' | 'INTERNAL_SERVER_ERROR';

// Error envelope
export interface ErrorEnvelope {
  status: 'error';
  code: ErrorCode;
  message: string;
}

// Login view state
export type LoginViewState = 'idle' | 'submitting' | 'success' | 'error';

// Auth session state
export interface AuthSession {
  accessToken: string | null;
  tokenType: 'Bearer' | null;
  expiresAt: number | null;
  user: User | null;
}

