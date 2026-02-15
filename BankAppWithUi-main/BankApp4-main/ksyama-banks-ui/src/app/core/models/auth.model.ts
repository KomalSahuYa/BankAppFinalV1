export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId?: number;
  username?: string;
  role?: 'MANAGER' | 'CLERK';
  fullName?: string;
  emailId?: string;
  phoneNumber?: string;
}

export interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  iat: number;
}
