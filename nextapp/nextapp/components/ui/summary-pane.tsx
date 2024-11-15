'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Edit, Users, BarChart } from 'lucide-react'

type SummaryPaneProps = {
  jobDescription: string;
  criteriaCount: number;
  resumeCount: number;
  rankingsCount: number;
}

export function SummaryPane({
  jobDescription,
  criteriaCount,
  resumeCount,
  rankingsCount
}: SummaryPaneProps) {
  return (
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
              <span>Criteria: {criteriaCount}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Resumes: {resumeCount}</span>
            </div>
            <div className="flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              <span>Rankings: {rankingsCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}