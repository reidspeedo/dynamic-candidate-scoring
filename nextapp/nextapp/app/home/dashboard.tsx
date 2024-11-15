'use client'

import { useState } from 'react'
import { GenerateScoringSystem } from '@/components/ui/generate-scoring-system'
import { ReviewScoringSystem } from '@/components/ui/review-scoring-system'
import { UploadResumes } from '@/components/ui/upload-resumes'
import { CandidateRankings } from '@/components/ui/candidate-rankings'
import { ProgressBar } from '@/components/ui/process-bar'
import { SummaryPane } from '@/components/ui/summary-pane'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Criterion = {
  type: string;
  description: string;
  weight: number;
}

type ScoringSystem = {
  criteria: Criterion[];
}

export function Dashboard() {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [customConsiderations, setCustomConsiderations] = useState('');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>({ criteria: [] });
  const [resumes, setResumes] = useState<File[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const router = useRouter();

  const isStepComplete = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return jobDescription.trim() !== '';
      case 2:
        return scoringSystem.criteria.length > 0 && scoringSystem.criteria.every(c => c.description.trim() !== '');
      case 3:
        return resumes.length > 0;
      case 4:
        return rankings.length > 0;
      default:
        return false;
    }
  };

  const goToStep = (newStep: number) => {
    if (newStep >= 1 && newStep <= 4 && (newStep <= step || isStepComplete(step))) {
      setStep(newStep);
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    router.push('/');
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex">
        <ProgressBar step={step} goToStep={goToStep} isStepComplete={isStepComplete} />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Candidate Evaluation Dashboard</h1>
            
            {/* Summary pane for small screens */}
            <div className="block lg:hidden">
              <SummaryPane
                jobDescription={jobDescription}
                criteriaCount={scoringSystem.criteria.length}
                resumeCount={resumes.length}
                rankingsCount={rankings.length}
                currentStep={step}
                isStepComplete={isStepComplete}
              />
            </div>

            {/* Main content area with right sidebar for large screens */}
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="flex-1">
                {step === 1 && (
                  <GenerateScoringSystem
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    customConsiderations={customConsiderations}
                    setCustomConsiderations={setCustomConsiderations}
                    setScoringSystem={setScoringSystem}
                    goToStep={goToStep}
                  />
                )}
                {step === 2 && (
                  <ReviewScoringSystem
                    scoringSystem={scoringSystem}
                    setScoringSystem={setScoringSystem}
                    goToStep={goToStep}
                  />
                )}
                {step === 3 && (
                  <UploadResumes
                    resumes={resumes}
                    setResumes={setResumes}
                    goToStep={goToStep}
                    setRankings={setRankings}
                  />
                )}
                {step === 4 && (
                  <CandidateRankings
                    rankings={rankings}
                  />
                )}
              </div>
              
              {/* Summary pane for large screens */}
              <div className="hidden lg:block w-80">
                <SummaryPane
                  jobDescription={jobDescription}
                  criteriaCount={scoringSystem.criteria.length}
                  resumeCount={resumes.length}
                  rankingsCount={rankings.length}
                  currentStep={step}
                  isStepComplete={isStepComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to leave?</DialogTitle>
            <DialogDescription>
              Your work might be lost if you leave the dashboard. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelExit}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmExit}>
              Leave Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}