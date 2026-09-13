// Auth context: login qua /api/auth/login, lưu token vào localStorage
// 'grotto-token', boot lại phiên bằng /auth/me khi đã có token.
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from './api'
import type { Role, User } from '../types'

interface AuthContextValue {
  user: User | null
  isPending: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPending, setIsPending] = useState(() => Boolean(localStorage.getItem('grotto-token')))

  useEffect(() => {
    if (!localStorage.getItem('grotto-token')) return
    api<User>('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('grotto-token'))
      .finally(() => setIsPending(false))
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('grotto-token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // mock layer — bỏ qua lỗi khi logout
    }
    localStorage.removeItem('grotto-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider')
  return ctx
}

// Chặn route theo role: chưa đăng nhập → /login; sai role → 403 inline
// (trang Forbidden thật thuộc Task 3).
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, isPending } = useAuth()
  if (isPending) return null
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) {
    return <div className="p-10 text-center">403 — Không đủ quyền</div>
  }
  return <>{children}</>
}
