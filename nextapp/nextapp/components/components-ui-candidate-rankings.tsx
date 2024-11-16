'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCandidate, setSelectedCandidate] = useState<Ranking | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(10);

  const sortedRankings = useMemo(() => 
    [...rankings].sort((a, b) => 
      sortOrder === 'desc' ? b.total_score - a.total_score : a.total_score - b.total_score
    ),
    [rankings, sortOrder]
  );

  const displayedRankings = useMemo(() => 
    sortedRankings.slice(0, displayCount),
    [sortedRankings, displayCount]
  );

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedRankings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handlePreviewResume = (resumeName: string) => {
    const resume = resumes.find(r => r.name === resumeName);
    if (resume) {
      const fileUrl = URL.createObjectURL(resume);
      setSelectedResume(fileUrl);
    }
  };

  const chartData = useMemo(() => 
    displayedRankings.map(ranking => ({
      name: ranking.resume_name,
      ...ranking.scores.reduce((acc, score) => ({
        ...acc,
        [score.area]: score.score
      }), {})
    })),
    [displayedRankings]
  );

  const areas = rankings[0]?.scores.map(score => score.area) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Candidate Rankings
            <div className="flex items-center space-x-2">
              <Select
                value={displayCount.toString()}
                onValueChange={(value) => setDisplayCount(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={parentRef} className="h-[400px] overflow-auto">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const ranking = sortedRankings[virtualRow.index];
                return (
                  <div
                    key={ranking.resume_id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>{virtualRow.index + 1}</TableCell>
                          <TableCell>
                            <Button variant="link" onClick={() => handlePreviewResume(ranking.resume_name)}>
                              {ranking.resume_name}
                            </Button>
                          </TableCell>
                          <TableCell>{ranking.total_score.toFixed(2)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(ranking)}>
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{ranking.resume_name} - Detailed Scores</DialogTitle>
                                </DialogHeader>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Area</TableHead>
                                      <TableHead>Evaluation</TableHead>
                                      <TableHead>Score</TableHead>
                                      <TableHead>Weight</TableHead>
                                      <TableHead>Reasoning</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {ranking.scores.map((score) => (
                                      <TableRow key={score.criterion_id}>
                                        <TableCell>{score.area}</TableCell>
                                        <TableCell>{score.evaluation}</TableCell>
                                        <TableCell>{score.score}</TableCell>
                                        <TableCell>{score.weight}</TableCell>
                                        <TableCell>{score.reasoning}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[400px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis hide />
              <Legend />
              {areas.map((area, index) => (
                <Bar 
                  key={area} 
                  dataKey={area} 
                  stackId="a" 
                  fill={`hsl(var(--chart-${index + 1}))`}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Dialog open={!!selectedResume} onOpenChange={() => setSelectedResume(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-[calc(90vh-80px)]">
            {selectedResume && (
              <iframe
                src={selectedResume}
                className="w-full h-full rounded-b-lg"
                title="Resume Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}