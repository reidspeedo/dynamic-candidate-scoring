'use client'

import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

type CandidateRankingsProps = {
  rankings: any[];
}

export function CandidateRankings({ rankings }: CandidateRankingsProps) {
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

  return (
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
  )
}