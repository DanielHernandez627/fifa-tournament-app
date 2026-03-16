export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export interface ApiError {
  statusCode?: number;
  message?: string;
  error?: string | ApiErrorDetail;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
