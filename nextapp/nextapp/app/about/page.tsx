import { RootLayout } from '@/components/ui/RootLayout'

export default function AboutPage() {

  return (
    <RootLayout>
    <div className="min-h-screen flex flex-col">


      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">About RankCandidates.AI</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg mb-4">
                At RankCandidates.AI, we're on a mission to revolutionize the hiring process. By leveraging cutting-edge artificial intelligence, we aim to streamline candidate evaluation, reduce bias, and help companies find the best talent efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <ol className="list-decimal list-inside space-y-4">
                <li className="text-lg">
                  <span className="font-semibold">Upload Resumes:</span> Submit candidate resumes in PDF format to our secure platform.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Define Job Requirements:</span> Input your job description and any custom considerations for the role.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">AI Analysis:</span> Our advanced algorithms analyze the resumes against your specified criteria.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Customizable Scoring:</span> Review and adjust the AI-generated scoring system to fit your needs.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Candidate Ranking:</span> Receive a ranked list of candidates based on their match to your requirements.
                </li>
                <li className="text-lg">
                  <span className="font-semibold">Detailed Insights:</span> Access in-depth analysis and reasoning for each candidate's ranking.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our AI-Powered Approach</h2>
              <p className="text-lg mb-4">
                RankCandidates.AI leverages state-of-the-art machine learning models to analyze resumes, evaluate candidates, and provide data-driven insights. Our AI is trained on a vast dataset of successful hires across various industries, allowing it to identify patterns and qualities that lead to successful placements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
              <ul className="list-disc list-inside space-y-2">
                <li className="text-lg">Save time by automating the initial screening process</li>
                <li className="text-lg">Reduce bias with objective, data-driven candidate evaluations</li>
                <li className="text-lg">Improve hiring quality by ensuring candidates match your specific needs</li>
                <li className="text-lg">Streamline your workflow with our user-friendly interface</li>
                <li className="text-lg">Make informed decisions with comprehensive candidate insights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p className="text-lg mb-4">
                We are committed to continuous improvement and ethical AI practices. Our team regularly updates our algorithms to ensure fairness, transparency, and effectiveness in the hiring process. We believe in empowering recruiters and hiring managers with tools that enhance their decision-making, not replace it.
              </p>
            </section>
          </div>
        </div>
      </main>

    </div>
    </RootLayout>
  )
}