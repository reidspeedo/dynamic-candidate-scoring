'use client'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { useUser } from '@/lib/UserContext'
import { usePathname } from 'next/navigation'

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, signIn, signOut } = useUser()
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        pathname={pathname}
        onSignIn={signIn}
        onSignOut={signOut}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}