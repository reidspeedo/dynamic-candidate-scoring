'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UploadResumesProps = {
  resumes: File[];
  setResumes: (resumes: File[]) => void;
  goToStep: (step: number) => void;
  setRankings: (rankings: any[]) => void;
}

export function UploadResumes({
  resumes,
  setResumes,
  goToStep,
  setRankings
}: UploadResumesProps) {
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumes([...resumes, ...Array.from(event.target.files)]);
    }
  };

  const handleRankCandidates = () => {
    // This would typically be an API call to your backend
    const mockRankings = resumes.map((resume, index) => ({
      name: `Candidate ${index + 1}`,
      score: Math.floor(Math.random() * 100),
      reasoning: "Mock reasoning for candidate ranking"
    }));
    setRankings(mockRankings);
    goToStep(4);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          id="resume-upload"
          type="file"
          accept=".pdf"
          multiple
          onChange={handleResumeUpload}
          className="hidden"
        />
        <Label htmlFor="resume-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Choose Files
        </Label>
        <span className="text-sm text-muted-foreground">
          {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} selected
        </span>
      </div>
      {resumes.length > 0 && (
        <ul className="list-disc list-inside">
          {resumes.map((resume, index) => (
            <li key={index} className="text-sm">{resume.name}</li>
          ))}
        </ul>
      )}
      {resumes.length > 0 && (
        <Button onClick={handleRankCandidates}>
          Rank Candidates
        </Button>
      )}
    </div>
  )
}