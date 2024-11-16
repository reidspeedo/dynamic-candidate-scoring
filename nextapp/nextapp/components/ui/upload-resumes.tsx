'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileText } from 'lucide-react'
import { useResumes } from '@/lib/ResumeContext'

type UploadResumesProps = {
  goToStep: (step: number) => void;
  setRankings: (rankings: any[]) => void;
}

const mockRankCandidates = (resumes: File[]) => {
  // This is a mock function to simulate the API call
  const mockData = [
    {'resume_id': 'ID_1', 'resume_name': 'test_resume_1.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 8, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has extensive experience with Python, as indicated by their proficiency in Python and related technologies, although specific years of Python development experience are not detailed.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 4, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Mechanical Engineering, which is not directly related to Computer Science or a similar field.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 3, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate has strong experience with Workday APIs but does not specifically mention FastAPI, indicating a lack of direct experience with that technology.', 'weight': 7}], 'total_score': 51.90476190476191},
    {'resume_id': 'ID_2', 'resume_name': 'test_resume_2.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 3, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has experience in software development but does not specifically mention Python development experience, which is a key requirement.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 6, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Electrical and Computer Engineering, which is related to Computer Science.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 2, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate does not mention experience with FastAPI or REST APIs, which are essential for this role.', 'weight': 7}], 'total_score': 35.23809523809524},
    {'resume_id': 'ID_3', 'resume_name': 'test_resume_3.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 8, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has extensive experience with Python, as indicated by their proficiency in Python and related technologies, although specific years of Python development experience are not detailed.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 4, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Mechanical Engineering, which is not directly related to Computer Science or a similar field.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 3, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate has strong experience with Workday APIs but does not specifically mention FastAPI, indicating a lack of direct experience with that technology.', 'weight': 7}], 'total_score': 51.90476190476191},
    {'resume_id': 'ID_4', 'resume_name': 'test_resume_4.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 3, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has experience in software development but does not specifically mention Python development experience, which is a key requirement.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 6, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Electrical and Computer Engineering, which is related to Computer Science.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 2, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate does not mention experience with FastAPI or REST APIs, which are essential for this role.', 'weight': 7}], 'total_score': 35.23809523809524},
    {'resume_id': 'ID_5', 'resume_name': 'test_resume_5.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 8, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has extensive experience with Python, as indicated by their proficiency in Python and related technologies, although specific years of Python development experience are not detailed.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 4, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Mechanical Engineering, which is not directly related to Computer Science or a similar field.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 3, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate has strong experience with Workday APIs but does not specifically mention FastAPI, indicating a lack of direct experience with that technology.', 'weight': 7}], 'total_score': 51.90476190476191},
    {'resume_id': 'ID_6', 'resume_name': 'test_resume_6.pdf', 'scores': [{'criterion_id': 'crit_69a4c6e9', 'area': 'work_experience', 'score': 3, 'evaluation': '5+ years of Python development experience', 'reasoning': 'The candidate has experience in software development but does not specifically mention Python development experience, which is a key requirement.', 'weight': 8}, {'criterion_id': 'crit_676e75d8', 'area': 'education', 'score': 6, 'evaluation': "Bachelor's degree in Computer Science or related field", 'reasoning': "The candidate holds a Bachelor's degree in Electrical and Computer Engineering, which is related to Computer Science.", 'weight': 6}, {'criterion_id': 'crit_67103e2d', 'area': 'skills_certification', 'score': 2, 'evaluation': 'Strong experience with FastAPI and REST APIs', 'reasoning': 'The candidate does not mention experience with FastAPI or REST APIs, which are essential for this role.', 'weight': 7}], 'total_score': 35.23809523809524},

  ];

  // Only return data for the number of resumes uploaded
  return mockData.slice(0, resumes.length);
};

export function UploadResumes({
  goToStep,
  setRankings
}: UploadResumesProps) {
  const { resumes, addResumes, removeResume } = useResumes();
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const duplicates: string[] = [];
    const newResumes: File[] = [];

    acceptedFiles.forEach(file => {
      if (resumes.some(existingFile => existingFile.name === file.name)) {
        duplicates.push(file.name);
      } else {
        newResumes.push(file);
      }
    });

    if (duplicates.length > 0) {
      setError(`The following file(s) have already been uploaded: ${duplicates.join(', ')}. Please rename the file(s) and try again.`);
    }

    if (newResumes.length > 0) {
      addResumes(newResumes);
      if (duplicates.length === 0) {
        setError(null);
      }
    }
  }, [resumes, addResumes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true
  });

  const handleRemoveResume = (index: number) => {
    removeResume(index);
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
    const rankings = mockRankCandidates(resumes);
    setRankings(rankings);
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
                    onClick={() => handleRemoveResume(index)}
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