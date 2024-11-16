'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

type Resume = File

type ResumeContextType = {
  resumes: Resume[]
  addResumes: (newResumes: Resume[]) => void
  removeResume: (index: number) => void
  clearResumes: () => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([])

  const addResumes = (newResumes: Resume[]) => {
    setResumes(prevResumes => [...prevResumes, ...newResumes])
  }

  const removeResume = (index: number) => {
    setResumes(prevResumes => prevResumes.filter((_, i) => i !== index))
  }

  const clearResumes = () => {
    setResumes([])
  }

  return (
    <ResumeContext.Provider value={{ resumes, addResumes, removeResume, clearResumes }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResumes() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error('useResumes must be used within a ResumeProvider')
  }
  return context
}