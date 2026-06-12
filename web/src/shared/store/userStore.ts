// 全局状态管理
import { create } from 'zustand'

// 示例：用户状态
interface UserState {
  user: null | { id: number; username: string }
  setUser: (user: null | { id: number; username: string }) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))