'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Download, ChevronRight, Bot, FileText, Users, BarChart } from 'lucide-react'

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
  const [resumes, setResumes] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [customConsiderations, setCustomConsiderations] = useState('');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>({ criteria: [] });
  const [rankings, setRankings] = useState<any[]>([]);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumes(prev => [...prev, ...Array.from(event.target.files || [])]);
      setStep(4);
    }
  };

  const handleGenerateCriteria = () => {
    // This would typically be an API call to your backend
    const mockScoringSystem: ScoringSystem = {
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
    setStep(2);
  };

  const handleEditCriterion = (index: number, field: keyof Criterion, value: string | number) => {
    const updatedCriteria = [...scoringSystem.criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setScoringSystem({ ...scoringSystem, criteria: updatedCriteria });
  };

  const handleAddCriterion = () => {
    setScoringSystem({
      ...scoringSystem,
      criteria: [...scoringSystem.criteria, { type: '', description: '', weight: 5 }]
    });
  };

  const handleRemoveCriterion = (index: number) => {
    const updatedCriteria = scoringSystem.criteria.filter((_, i) => i !== index);
    setScoringSystem({ ...scoringSystem, criteria: updatedCriteria });
  };

  const handleRankCandidates = () => {
    // This would typically be an API call to your backend
    const mockRankings = resumes.map((resume, index) => ({
      name: `Candidate ${index + 1}`,
      score: Math.floor(Math.random() * 100),
      reasoning: "Mock reasoning for candidate ranking"
    }));
    setRankings(mockRankings);
    setStep(4);
  };

  const handleExportRankings = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Score,Reasoning\n"
      + rankings.map(r => `${r.name},${r.score},"${r.reasoning}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidate_rankings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToStep = (newStep: number) => {
    if (newStep >= 1 && newStep <= 4) {
      setStep(newStep);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex">
        <div className="w-16 bg-black flex flex-col items-center py-8 relative">
          {[1, 2, 3, 4].map((s, index) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 cursor-pointer ${
                  s <= step ? 'bg-white text-black' : 'bg-gray-700 text-white'
                }`}
                onClick={() => goToStep(s)}
              >
                {s}
              </div>
              {index < 3 && (
                <div className="h-16 w-0.5 bg-gray-600 -mb-4"></div>
              )}
            </div>
          ))}
          <Bot className="h-8 w-8 text-white mt-4" />
        </div>
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Candidate Evaluation Dashboard</h1>

          <div className="flex gap-8">
            <div className="flex-1">
              <Accordion 
                type="single" 
                collapsible 
                className="w-full" 
                value={`step-${step}`}
                onValueChange={(value) => goToStep(parseInt(value.split('-')[1]))}
              >
                <AccordionItem value="step-1">
                  <AccordionTrigger>Step 1: Generate Scoring System</AccordionTrigger>
                  <AccordionContent>
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-2">
                  <AccordionTrigger>Step 2: Review and Edit Scoring System</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {scoringSystem.criteria.map((criterion, index) => (
                        <div key={index} className="p-4 border rounded">
                          <div className="grid grid-cols-3 gap-4 mb-2">
                            <Input
                              value={criterion.type}
                              onChange={(e) => handleEditCriterion(index, 'type', e.target.value)}
                              placeholder="Criterion Type"
                              className="text-sm"
                            />
                            <Input
                              value={criterion.description}
                              onChange={(e) => handleEditCriterion(index, 'description', e.target.value)}
                              placeholder="Description"
                              className="text-sm"
                            />
                            <Input
                              type="number"
                              value={criterion.weight}
                              onChange={(e) => handleEditCriterion(index, 'weight', parseInt(e.target.value))}
                              placeholder="Weight"
                              min="1"
                              max="10"
                              className="text-sm"
                            />
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveCriterion(index)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-4">
                        <Button onClick={handleAddCriterion}>
                          <Edit className="w-4 h-4 mr-2" />
                          Add Criterion
                        </Button>
                        <Button onClick={() => setStep(3)}>
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-3">
                  <AccordionTrigger>Step 3: Upload Resumes</AccordionTrigger>
                  <AccordionContent>
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-4">
                  <AccordionTrigger>Step 4: Candidate Rankings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {rankings.map((ranking, index) => (
                        <div key={index} className="p-4 border rounded">
                          <h3 className="text-md font-semibold">{ranking.name}</h3>
                          <p className="text-sm">Score: {ranking.score}</p>
                          <p className="text-sm">Reasoning: {ranking.reasoning}</p>
                        </div>
                      ))}
                      <Button onClick={handleExportRankings}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Rankings
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      <span>Job Description: {jobDescription ? 'Provided' : 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Edit className="w-5 h-5 mr-2" />
                      <span>Criteria: {scoringSystem.criteria.length}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <span>Resumes: {resumes.length}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="w-5 h-5 mr-2" />
                      <span>Rankings: {rankings.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}