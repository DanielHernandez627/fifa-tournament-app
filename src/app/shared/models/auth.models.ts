export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  message?: string;
}

export interface UsernameAvailabilityResponse {
  username: string;
  available: boolean;
}

export interface JwtPayload {
  id?: string;
  userName?: string;
  sub?: string;
  email?: string;
  role?: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
}
