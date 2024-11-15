'use client'

import { Button } from "@/components/ui/button"
import { Bot } from 'lucide-react'

type LandingPageProps = {
  onSignIn: () => void
}

export function Landing({ onSignIn }: LandingPageProps) {
  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            RankCandidates.AI
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Streamline your hiring process with AI-powered candidate ranking
          </p>
          <div className="mt-5 flex justify-center">
            <Button onClick={onSignIn}>Get Started</Button>
          </div>
        </div>

        {/* How It Works section */}
        <section id="how-it-works" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Upload Resumes", description: "Submit candidate resumes for AI analysis" },
              { title: "Define Criteria", description: "Set your job requirements and preferences" },
              { title: "Get Rankings", description: "Receive AI-generated candidate rankings" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-full p-3 inline-block mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}