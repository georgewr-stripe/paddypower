'use client';

import { FaCheck } from 'react-icons/fa';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < currentStep
                  ? 'bg-green-600 text-white'
                  : i === currentStep
                    ? 'bg-green-600/20 text-green-400 ring-2 ring-green-500'
                    : 'bg-white/5 text-gray-500'
              }`}
            >
              {i < currentStep ? <FaCheck className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs mt-1.5 whitespace-nowrap ${
              i <= currentStep ? 'text-white' : 'text-gray-500'
            }`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 mt-[-16px] ${
              i < currentStep ? 'bg-green-600' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
