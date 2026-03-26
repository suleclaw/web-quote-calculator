'use client';

import { PAGES_INCLUDED } from '@/lib/pricing';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Pages', 'Features', 'Review', 'Submit'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-600 text-white'
                  : isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {isCompleted ? '✓' : stepNum}
            </div>
            <span className={`text-sm hidden sm:block ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {STEP_LABELS[i]}
            </span>
            {i < totalSteps - 1 && (
              <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
