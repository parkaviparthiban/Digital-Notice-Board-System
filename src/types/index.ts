export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'urgent';
  priority: 'high' | 'medium' | 'low';
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NoticeFormData {
  title: string;
  content: string;
  category: Notice['category'];
  priority: Notice['priority'];
  expiresAt?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
