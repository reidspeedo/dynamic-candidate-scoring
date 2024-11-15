'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
  const handleGenerateCriteria = () => {
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-description" className="block mb-2 text-sm">Job Description</Label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="mb-4"
          rows={5}
          placeholder="Paste the job description here..."
        />
      </div>
      <div>
        <Label htmlFor="custom-considerations" className="block mb-2 text-sm">Custom Considerations</Label>
        <Textarea
          id="custom-considerations"
          value={customConsiderations}
          onChange={(e) => setCustomConsiderations(e.target.value)}
          className="mb-4"
          rows={3}
          placeholder="Add any custom considerations for candidate assessment..."
        />
      </div>
      <Button onClick={handleGenerateCriteria}>Generate Criteria</Button>
    </div>
  )
}