/**
 * CivicResolve Authentication Context
 * Manages active user session, role verification, and login/logout state.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, type User } from '../api/client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const checkSession = async () => {
    try {
      const res = await api.auth.me()
      if (res.data?.user) {
        setUser(res.data.user)
        localStorage.setItem('userRole', res.data.user.role)
      } else {
        setUser(null)
        localStorage.removeItem('userRole')
      }
    } catch {
      setUser(null)
      localStorage.removeItem('userRole')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.auth.login({ email, password })
    if (!res.data?.user) {
      throw new Error(res.message || 'Login failed')
    }
    const loggedInUser = res.data.user
    setUser(loggedInUser)
    localStorage.setItem('userRole', loggedInUser.role)
    if (loggedInUser.role === 'department') {
      localStorage.setItem('departmentUser', JSON.stringify({
        name: loggedInUser.department_name || 'Department Officer',
        email: loggedInUser.email,
        department_id: loggedInUser.department_id,
      }))
    }
    return loggedInUser
  }

  const register = async (data: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
    const res = await api.auth.register(data)
    if (!res.data?.user) {
      throw new Error(res.message || 'Registration failed')
    }
    return res.data.user
  }

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout()
    } finally {
      setUser(null)
      localStorage.removeItem('userRole')
      localStorage.removeItem('departmentUser')
      localStorage.removeItem('registeredUser')
    }
  }

  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await api.auth.me()
      if (res.data?.user) {
        setUser(res.data.user)
        localStorage.setItem('userRole', res.data.user.role)
        return res.data.user
      }
    } catch {
      // ignore
    }
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
