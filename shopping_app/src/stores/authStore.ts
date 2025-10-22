import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// モックユーザーデータ
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: '山田花子',
    role: 'user',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // モック認証（実際はAPIを呼ぶ）
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email);
            if (user && password === 'password123') {
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
              resolve();
            } else {
              set({ isLoading: false });
              reject(new Error('メールアドレスまたはパスワードが正しくありません。'));
            }
          }, 1000);
        });
      },
      
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        
        // モック登録（実際はAPIを呼ぶ）
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const existingUser = MOCK_USERS.find(u => u.email === email);
            if (existingUser) {
              set({ isLoading: false });
              reject(new Error('このメールアドレスは既に登録されています。'));
            } else {
              const newUser: User = {
                id: String(Date.now()),
                email,
                name,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              set({ 
                user: newUser, 
                isAuthenticated: true, 
                isLoading: false 
              });
              resolve();
            }
          }, 1000);
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);