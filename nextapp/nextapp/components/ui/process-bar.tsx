'use client'

import { Bot } from 'lucide-react'

type ProgressBarProps = {
  step: number;
  goToStep: (step: number) => void;
}

export function ProgressBar({ step, goToStep }: ProgressBarProps) {
  return (
    <div className="w-16 bg-black flex flex-col items-center py-8 relative">
      {[1, 2, 3, 4].map((s, index) => (
        <div key={s} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 cursor-pointer ${
              s <= step ? 'bg-white text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => goToStep(s)}
          >
            {s}
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