'use client'

import { User } from '@/lib/lib-firebase'
import { useUser } from '@/lib/UserContext'
import LandingPage from './home/landing'
import { Dashboard } from './home/dashboard'
import { RootLayout } from '@/components/ui/RootLayout'

export default function Home() {
  const { user } = useUser();


  return (
    <RootLayout>
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      {user ? (
        <Dashboard />
      ) : (
        <LandingPage />
      )}
    </div>
    </RootLayout>
  )
}