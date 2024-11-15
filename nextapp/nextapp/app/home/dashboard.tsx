'use client'

import { useState } from 'react'
import { GenerateScoringSystem } from '@/components/ui/generate-scoring-system'
import { ReviewScoringSystem } from '@/components/ui/review-scoring-system'
import { UploadResumes } from '@/components/ui/upload-resumes'
import { CandidateRankings } from '@/components/ui/candidate-rankings'
import { ProgressBar } from '@/components/ui/process-bar'
import { SummaryPane } from '@/components/ui/summary-pane'

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

  const isStepComplete = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return jobDescription.trim() !== '';
      case 2:
        return scoringSystem.criteria.length > 0;
      case 3:
        return resumes.length > 0;
      case 4:
        return rankings.length > 0;
      default:
        return false;
    }
  };

  const goToStep = (newStep: number) => {
    if (newStep >= 1 && newStep <= 4) {
      setStep(newStep);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex">
      <ProgressBar step={step} goToStep={goToStep} isStepComplete={isStepComplete} />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Candidate Evaluation Dashboard</h1>
          <div className="flex gap-8">
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
            <SummaryPane
              jobDescription={jobDescription}
              criteriaCount={scoringSystem.criteria.length}
              resumeCount={resumes.length}
              rankingsCount={rankings.length}
              currentStep={step}
/>
          </div>
        </div>
      </main>
    </div>
  )
}