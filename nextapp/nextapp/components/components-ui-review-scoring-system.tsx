'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, ChevronRight, X } from 'lucide-react'

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const criterionTypes = ["skills", "experience", "education", "certifications"];

  const handleEditCriterion = (index: number, field: keyof Criterion, value: string | number) => {
    const updatedCriteria = [...scoringSystem.criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setScoringSystem({ ...scoringSystem, criteria: updatedCriteria });
  };

  const handleAddCriterion = () => {
    setScoringSystem({
      ...scoringSystem,
      criteria: [...scoringSystem.criteria, { type: 'skills', description: '', weight: 5 }]
    });
  };

  const handleRemoveCriterion = (index: number) => {
    const updatedCriteria = scoringSystem.criteria.filter((_, i) => i !== index);
    setScoringSystem({ ...scoringSystem, criteria: updatedCriteria });
  };

  const handleNext = () => {
    if (scoringSystem.criteria.length === 0) {
      setError("At least one criterion is required.");
      return;
    }
    if (scoringSystem.criteria.some(c => c.description.trim() === '' || c.type.trim() === '')) {
      setError("All criteria must have a type and description.");
      return;
    }
    setError(null);
    goToStep(3);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-12 gap-4 items-start mb-4">
            <div className="col-span-3">
              <Label className="block mb-2 text-sm font-bold">Type</Label>
              <p className="text-xs text-muted-foreground">Select the category of this criterion. Required.</p>
            </div>
            <div className="col-span-7">
              <Label className="block mb-2 text-sm font-bold">Criteria</Label>
              <p className="text-xs text-muted-foreground">Describe the specific requirement or skill. Required.</p>
            </div>
            <div className="col-span-2">
              <Label className="block mb-2 text-sm font-bold">Weight</Label>
              <p className="text-xs text-muted-foreground">Set importance (0-10).</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {scoringSystem.criteria.map((criterion, index) => (
        <Card 
          key={index} 
          className="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CardContent className="pt-6">
            {hoveredIndex === index && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleRemoveCriterion(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove criterion</span>
              </Button>
            )}
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3">
                <Select
                  value={criterion.type}
                  onValueChange={(value) => handleEditCriterion(index, 'type', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {criterionTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-7">
                <Textarea
                  value={criterion.description}
                  onChange={(e) => handleEditCriterion(index, 'description', e.target.value)}
                  placeholder="Enter criterion description"
                  className="resize-none"
                  rows={2}
                  required
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[criterion.weight]}
                    onValueChange={(value) => handleEditCriterion(index, 'weight', value[0])}
                    max={10}
                    step={1}
                  />
                  <span className="text-sm font-medium w-8 text-center">{criterion.weight}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between">
        <Button onClick={handleAddCriterion}>
          <Edit className="w-4 h-4 mr-2" />
          Add Criterion
        </Button>
        <Button onClick={handleNext}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}