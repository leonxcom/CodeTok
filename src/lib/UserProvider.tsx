'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { auth } from '@/lib/auth'

// User type definition
type User = {
  id: string
  email: string
  name?: string
  role?: string
  emailVerified?: boolean
}

// Context type definition
type UserContextType = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
})

type UserProviderProps = {
  children: ReactNode
}

/**
 * UserProvider component for managing global user state
 *
 * Provides access to the current user and loading state throughout the application.
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch the current user session
  const fetchUser = async () => {
    try {
      setLoading(true)
      const session = await auth.handler(new Request(''))
      if (session && 'user' in session) {
        setUser(session.user as User)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user on initial load
  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, refresh: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook for accessing the user context
 *
 * Example usage:
 * const { user, loading } = useUser();
 */
export const useUser = () => useContext(UserContext)
