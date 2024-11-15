'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Bot } from 'lucide-react'

type HeaderProps = {
  user?: {
    displayName: string;
  };
  onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  return (
    <header className="border-b">
        <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 py-2 text-center text-sm font-medium">
        <p>This product is currently in beta. We appreciate your feedback!</p>
      </div>
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-semibold">RankCandidates.AI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {isLandingPage && (
              <Link href="#how-it-works" className="hover:text-primary">
                How It Works
              </Link>
            )}
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.displayName}</span>
              <Button onClick={onSignOut}>Sign out</Button>
            </>
          ) : (
            
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}