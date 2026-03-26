'use client';

import { PAGES, FEATURES, calculateQuote } from '@/lib/pricing';

interface QuoteSummaryProps {
  selectedPageIds: string[];
  selectedFeatureIds: string[];
}

export default function QuoteSummary({ selectedPageIds, selectedFeatureIds }: QuoteSummaryProps) {
  const quote = calculateQuote(selectedPageIds, selectedFeatureIds);
  const selectedPages = PAGES.filter((p) => selectedPageIds.includes(p.id));
  const selectedFeatures = FEATURES.filter((f) => selectedFeatureIds.includes(f.id));

  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Quote Breakdown</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base (4 pages + shell)</span>
          <span className="font-medium">£{quote.basePrice}</span>
        </div>

        {quote.extraPages > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Extra pages ({quote.extraPages} × £10)</span>
            <span className="font-medium">£{quote.pagesCost}</span>
          </div>
        )}

        {selectedFeatures.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-gray-200">
            {selectedFeatures.map((f) => (
              <div key={f.id} className="flex justify-between">
                <span className="text-gray-600">{f.label}</span>
                <span className="font-medium">£{f.price}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-3 border-t border-gray-300 font-semibold text-lg">
          <span>Total</span>
          <span className="text-blue-600">£{quote.total}</span>
        </div>
      </div>

      {selectedPages.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Pages:</p>
          <div className="flex flex-wrap gap-2">
            {selectedPages.map((p) => (
              <span key={p.id} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                {p.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
