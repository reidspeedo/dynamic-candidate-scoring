'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, User, signInWithGoogle, signOutUser } from '@/lib/lib-firebase'
import { useRouter } from 'next/navigation';

type UserContextType = {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      await signInWithGoogle()
      router.push('/'); // Redirect to dashboard after sign-in
    } catch (error) {
      console.error('Error signing in', error)
    }
  }

  const signOut = async () => {
    try {
      await signOutUser()
      router.push('/'); // Redirect to landing page after sign-out
    } catch (error) {
      console.error('Error signing out', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}