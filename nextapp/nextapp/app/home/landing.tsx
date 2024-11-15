'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Bot } from 'lucide-react'
import {signInWithGoogle } from '@/lib/lib-firebase'

export default function LandingPage() {

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in', error)
    }
  }
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <section className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 py-32 md:py-40 text-center">
          <Bot className="h-24 w-24 mb-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Get up and running with AI-powered candidate evaluation
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-[600px] mx-auto">
            Evaluate resumes against job postings using advanced AI. Customize criteria and get instant rankings.
          </p>
          <div className="space-y-4 mt-8">
            
              <Button size="lg" onClick={handleSignIn}>Try Beta Access</Button>
            
            <div className="text-sm text-muted-foreground">
              Available for hiring managers and recruiters
            </div>
          </div>
        </section>

        <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Upload Job Posting", description: "Input your job requirements and customize evaluation criteria." },
              { title: "Submit Resumes", description: "Upload candidate resumes for AI-powered analysis." },
              { title: "Get Results", description: "Receive instant rankings and detailed candidate evaluations." }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-8">Have questions? We're here to help!</p>
          <Button asChild>
            <Link href="mailto:support@rankcandidates.ai">Email Support</Link>
          </Button>
        </section>
      </main>

    </div>
  )
}