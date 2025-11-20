export interface SuccessEnvelope<T> {
  status: 'success';
  message: string;
  data: T;
}

export type ErrorCode = 'INVALID_INPUT' | 'INVALID_CREDENTIALS' | 'INTERNAL_SERVER_ERROR' | 'NOT_FOUND' | 'VALIDATION_ERROR';

export interface ErrorEnvelope {
  status: 'error';
  code: ErrorCode;
  message: string;
}

