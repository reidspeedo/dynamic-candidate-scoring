'use client'

import { useEffect, useState } from 'react'
import { auth, User, signInWithGoogle, signOutUser } from '@/lib/lib-firebase'
import LandingPage from './home/landing'
import Dashboard from './home/dashboard'
import { Header } from '@/components/ui/header'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/ui/footer'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('Error signing out', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        pathname={pathname}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      {user ? (
        <Dashboard />
      ) : (
        <LandingPage />
      )}

      <Footer />
    </div>
  )
}