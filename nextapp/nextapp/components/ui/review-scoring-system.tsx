'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, ChevronRight } from 'lucide-react'

type Criterion = {
  type: string;
  description: string;
  weight: number;
}

type ScoringSystem = {
  criteria: Criterion[];
}

type ReviewScoringSystemProps = {
  scoringSystem: ScoringSystem;
  setScoringSystem: (value: ScoringSystem) => void;
  goToStep: (step: number) => void;
}

export function ReviewScoringSystem({
  scoringSystem,
  setScoringSystem,
  goToStep
}: ReviewScoringSystemProps) {
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

  return (
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
        <Button onClick={() => goToStep(3)}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}