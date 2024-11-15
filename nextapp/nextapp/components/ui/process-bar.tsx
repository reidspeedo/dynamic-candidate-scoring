'use client'

import { Bot, Lock } from 'lucide-react'

type ProgressBarProps = {
  step: number;
  goToStep: (step: number) => void;
  isStepComplete: (step: number) => boolean;
}

export function ProgressBar({ step, goToStep, isStepComplete }: ProgressBarProps) {
  const handleStepClick = (clickedStep: number) => {
    if (clickedStep <= step || isStepComplete(step)) {
      goToStep(clickedStep);
    }
  };

  return (
    <div className="w-16 bg-black flex flex-col items-center py-8 relative">
      {[1, 2, 3, 4].map((s, index) => (
        <div key={s} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 cursor-pointer ${
              s <= step ? 'bg-white text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => handleStepClick(s)}
          >
            {s <= step || isStepComplete(s - 1) ? (
              s
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </div>
          {index < 3 && (
            <div className="h-16 w-0.5 bg-gray-600 -mb-4"></div>
          )}
        </div>
      ))}
      <Bot className="h-8 w-8 text-white mt-4" />
    </div>
  )
}