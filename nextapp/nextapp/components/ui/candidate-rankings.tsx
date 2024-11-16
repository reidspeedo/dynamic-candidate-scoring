'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts'
import { Download, FileText } from 'lucide-react'

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
  resumes: File[];
}

export function CandidateRankings({ rankings, resumes }: CandidateRankingsProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Ranking | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const chartData = rankings.map(ranking => ({
    name: ranking.resume_name,
    ...ranking.scores.reduce((acc, score) => ({
      ...acc,
      [score.area]: score.score
    }), {}),
    totalScore: ranking.total_score,
    ranking: ranking
  }));

  const areas = rankings[0]?.scores.map(score => score.area) || [];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const handleBarClick = (data: any) => {
    setSelectedCandidate(data.ranking);
    setIsDialogOpen(true);
  };

  const handlePreviewResume = () => {
    if (selectedCandidate) {
      const resume = resumes.find(r => r.name === selectedCandidate.resume_name);
      if (resume) {
        const fileUrl = URL.createObjectURL(resume);
        setSelectedResume(fileUrl);
      }
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
    const headers = ["Candidate", "Total Score", ...areas, ...areas.map(area => `${area} Evaluation`), ...areas.map(area => `${area} Reasoning`)];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rankings.map(ranking => {
          const scoreData = ranking.scores.reduce((acc, score) => {
            acc[score.area] = score.score;
            acc[`${score.area} Evaluation`] = score.evaluation;
            acc[`${score.area} Reasoning`] = score.reasoning;
            return acc;
          }, {} as Record<string, string | number>);
          
          return [
            ranking.resume_name,
            ranking.total_score,
            ...areas.map(area => scoreData[area] || ""),
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
        <DialogContent className="max-w-6xl max-h-[90vh] flex overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedCandidate?.resume_name} - Detailed Scores</span>
                <Button variant="outline" size="sm" onClick={handlePreviewResume}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Resume
                </Button>
              </DialogTitle>
            </DialogHeader>
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
            <div className="flex-1 border-l">
              <iframe
                src={selectedResume}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          )}
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