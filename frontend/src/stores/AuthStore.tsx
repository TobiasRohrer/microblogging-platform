import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      login: (token, username) => set({ token, username }),
      logout: () => set({ token: null, username: null }),
      setToken: (token) => set({ token }),
      setUsername: (username) => set({ username }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);