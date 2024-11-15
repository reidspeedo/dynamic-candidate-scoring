'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

type GenerateScoringSystemProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  customConsiderations: string;
  setCustomConsiderations: (value: string) => void;
  setScoringSystem: (value: any) => void;
  goToStep: (step: number) => void;
}

export function GenerateScoringSystem({
  jobDescription,
  setJobDescription,
  customConsiderations,
  setCustomConsiderations,
  setScoringSystem,
  goToStep
}: GenerateScoringSystemProps) {
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCriteria = () => {
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError(null);
    // This would typically be an API call to your backend
    const mockScoringSystem = {
      criteria: [
        {
          type: "work_experience",
          description: "5+ years of Python development experience",
          weight: 8
        },
        {
          type: "education",
          description: "Bachelor's degree in Computer Science or related field",
          weight: 6
        },
        {
          type: "skills_certification",
          description: "Strong experience with FastAPI and REST APIs",
          weight: 7
        }
      ]
    };
    setScoringSystem(mockScoringSystem);
    goToStep(2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="job-description" className="block mb-2 text-sm">Job Description*</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="resize-none"
                rows={5}
                placeholder="Paste the job description here..."
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-considerations" className="block mb-2 text-sm">Custom Considerations</Label>
              <Textarea
                id="custom-considerations"
                value={customConsiderations}
                onChange={(e) => setCustomConsiderations(e.target.value)}
                className="resize-none"
                rows={3}
                placeholder="Add any custom considerations for candidate assessment..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleGenerateCriteria}>Generate Criteria</Button>
    </div>
  )
}