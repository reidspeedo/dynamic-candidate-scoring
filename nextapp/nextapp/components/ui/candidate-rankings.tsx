'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts'
import { Download, FileText } from 'lucide-react'
import { useResumes } from '@/lib/ResumeContext'

type Score = {
  criterion_id: string;
  area: string;
  score: number;
  evaluation: string;
  reasoning: string;
  weight: number;
}

type Ranking = {
  resume_id: string;
  resume_name: string;
  scores: Score[];
  total_score: number;
}

type CandidateRankingsProps = {
  rankings: Ranking[];
}

export function CandidateRankings({ rankings }: CandidateRankingsProps) {
  const { resumes } = useResumes();
  const [selectedCandidate, setSelectedCandidate] = useState<Ranking | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const chartData = useMemo(() => {
    return rankings
      .map(ranking => ({
        name: ranking.resume_name,
        ...ranking.scores.reduce((acc, score) => ({
          ...acc,
          [score.area]: score.score
        }), {}),
        totalScore: ranking.total_score,
        ranking: ranking
      }))
      .sort((a, b) => a.totalScore - b.totalScore);
  }, [rankings]);

  const areas = rankings[0]?.scores.map(score => score.area) || [];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const handleBarClick = (data: any) => {
    setSelectedCandidate(data.ranking);
    handlePreviewResume(data.ranking.resume_name);
    setIsDialogOpen(true);
  };

  const handlePreviewResume = (resumeName: string) => {
    const resume = resumes.find(r => r.name === resumeName);
    if (resume) {
      const fileUrl = URL.createObjectURL(resume);
      setSelectedResume(fileUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedResume) {
        URL.revokeObjectURL(selectedResume);
      }
    };
  }, [selectedResume]);

  const exportData = () => {
    const headers = ["Candidate", "Total Score", ...areas.map(area => `${area} Evaluation`), ...areas.map(area => `${area} Reasoning`)];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rankings.map(ranking => {
          const scoreData = ranking.scores.reduce((acc, score) => {
            acc[`${score.area} Evaluation`] = score.evaluation;
            acc[`${score.area} Reasoning`] = score.reasoning;
            return acc;
          }, {} as Record<string, string>);
          
          return [
            ranking.resume_name,
            ranking.total_score,
            ...areas.map(area => scoreData[`${area} Evaluation`] || ""),
            ...areas.map(area => scoreData[`${area} Reasoning`] || "")
          ].join(",");
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidate_rankings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Score Comparison</CardTitle>
          <CardDescription>
            This chart shows how well each candidate measured against your criteria. 
            Click on a bar to see detailed scores for that candidate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={false}
                  label={{ value: 'Total Score', angle: -90, position: 'insideLeft' }}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                />
                {areas.map((area, index) => (
                  <Bar 
                    key={area} 
                    dataKey={area} 
                    stackId="a" 
                    fill={colors[index % colors.length]}
                    onClick={handleBarClick}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setSelectedCandidate(null);
          setSelectedResume(null);
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{selectedCandidate?.resume_name} - Detailed Scores</DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-0 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Evaluation</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Reasoning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCandidate?.scores.map((score) => (
                    <TableRow key={score.criterion_id}>
                      <TableCell>{score.area}</TableCell>
                      <TableCell>{score.evaluation}</TableCell>
                      <TableCell>{score.weight}</TableCell>
                      <TableCell>{score.reasoning}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedResume && (
              <div className="flex-1 border-l pl-4">
                <iframe
                  src={selectedResume}
                  className="w-full h-full min-h-[70vh]"
                  title="Resume Preview"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button onClick={exportData}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
    </div>
  )
}