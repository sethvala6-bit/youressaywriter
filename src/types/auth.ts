export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'CUSTOMER' | 'WRITER' | 'ADMIN';
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
