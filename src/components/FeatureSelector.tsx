'use client';

import { FEATURES } from '@/lib/pricing';

interface FeatureSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function FeatureSelector({ selected, onChange }: FeatureSelectorProps) {
  const toggleFeature = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        Optional add-ons for advanced functionality. Select any that apply.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => {
          const isSelected = selected.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{feature.label}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
                </div>
                <div className="text-blue-600 font-semibold text-sm whitespace-nowrap">+£{feature.price}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
