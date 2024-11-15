import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
        <div className="text-sm text-muted-foreground">
          © 2024 RankCandidates.AI. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}