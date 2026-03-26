'use client';

import { PAGES } from '@/lib/pricing';

interface PageSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function PageSelector({ selected, onChange }: PageSelectorProps) {
  const togglePage = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        Select the pages your website needs. The first {4} are included in the base price.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PAGES.map((page) => {
          const isSelected = selected.includes(page.id);
          return (
            <button
              key={page.id}
              onClick={() => togglePage(page.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
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
                  <div className="font-medium text-gray-900">{page.label}</div>
                  <div className="text-sm text-gray-500">{page.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
