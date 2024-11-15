'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileText } from 'lucide-react'

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
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setResumes(prevResumes => [...prevResumes, ...acceptedFiles]);
    setError(null);
  }, [setResumes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true
  });

  const removeResume = (index: number) => {
    setResumes(resumes.filter((_, i) => i !== index));
    if (selectedResume) {
      URL.revokeObjectURL(selectedResume);
      setSelectedResume(null);
    }
  };

  const handleRankCandidates = () => {
    if (resumes.length === 0) {
      setError("At least one resume is required.");
      return;
    }
    setError(null);
    const mockRankings = resumes.map((resume, index) => ({
      name: `Candidate ${index + 1}`,
      score: Math.floor(Math.random() * 100),
      reasoning: "Mock reasoning for candidate ranking"
    }));
    setRankings(mockRankings);
    goToStep(4);
  };

  const handlePreviewResume = (file: File) => {
    if (selectedResume) {
      URL.revokeObjectURL(selectedResume);
    }
    const fileUrl = URL.createObjectURL(file);
    setSelectedResume(fileUrl);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? "Drop the files here ..."
                : "Drag 'n' drop some files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-500">Only .pdf files are accepted</p>
          </div>
        </CardContent>
      </Card>
      {resumes.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Uploaded Resumes</h3>
            <ul className="space-y-2">
              {resumes.map((resume, index) => (
                <li key={index} className="flex items-center justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="flex items-center" onClick={() => handlePreviewResume(resume)}>
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">{resume.name}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[90vh] p-0">
                      <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>{resume.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 w-full h-[calc(90vh-80px)]">
                        <iframe
                          src={selectedResume as string}
                          className="w-full h-full rounded-b-lg"
                          title="Resume Preview"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResume(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleRankCandidates}>
        Rank Candidates
      </Button>
    </div>
  )
}