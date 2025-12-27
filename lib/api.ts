import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface SignInDto {
  email?: string;
  password?: string;
  flow?: 'signIn' | 'signUp';
}

export interface User {
  id: string;
  email: string | null;
  isAnonymous: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  isRecurring: boolean;
  recurringType?: 'weekly' | 'daily';
  recurringDays?: number[];
  completedDates?: number[];
  dueDate?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  dueDate?: number;
  isRecurring?: boolean;
  recurringType?: 'weekly' | 'daily';
  recurringDays?: number[];
}

export const authApi = {
  signIn: async (data: SignInDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  
  signOut: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

export const todosApi = {
  create: async (data: CreateTodoDto): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },
  
  getForDate: async (date: number): Promise<Todo[]> => {
    const response = await api.get<Todo[]>(`/todos/for-date?date=${date}`);
    return response.data;
  },
  
  toggle: async (todoId: string, date?: number): Promise<Todo> => {
    const response = await api.post<Todo>('/todos/toggle', { todoId, date });
    return response.data;
  },
  
  delete: async (todoId: string): Promise<void> => {
    await api.delete(`/todos/${todoId}`);
  },
};

export default api;

