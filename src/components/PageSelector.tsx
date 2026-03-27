'use client';

import { PAGES } from '@/lib/pricing';

interface PageSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  siteType: 'one-page' | 'multi-page';
  onSiteTypeChange: (siteType: 'one-page' | 'multi-page') => void;
}

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  about: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  services: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  contact: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  gallery: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  testimonials: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  team: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  faq: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  pricing: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  blog: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
};

export default function PageSelector({ selected, onChange, siteType, onSiteTypeChange }: PageSelectorProps) {
  const isOnePage = siteType === 'one-page';
  const maxPages = isOnePage ? 1 : 4;

  const togglePage = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      if (isOnePage) {
        onChange([id]);
      } else if (selected.length < maxPages) {
        onChange([...selected, id]);
      }
    }
  };

  const handleSiteTypeChange = (type: 'one-page' | 'multi-page') => {
    onSiteTypeChange(type);
    if (type === 'one-page') {
      onChange(selected.includes('home') ? ['home'] : []);
    }
  };

  return (
    <div>
      {/* Site type toggle */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <span className="text-xs font-medium text-[#64748b]">Website type:</span>
        <div className="flex bg-[rgba(255,255,255,0.04)] rounded-lg p-0.5 border border-[rgba(255,255,255,0.06)]">
          <button
            onClick={() => handleSiteTypeChange('one-page')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              isOnePage
                ? 'bg-[#818cf8] text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            One page
          </button>
          <button
            onClick={() => handleSiteTypeChange('multi-page')}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              !isOnePage
                ? 'bg-[#818cf8] text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Multi-page
          </button>
        </div>
        <span className="ml-auto text-xs text-[#818cf8] font-medium">£250</span>
      </div>

      {/* Pages info */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          {isOnePage ? 'Single landing page' : 'First 4 pages included'}
        </div>
        <div className="ml-auto text-xs text-[#818cf8] bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.2)] rounded-full px-2.5 py-0.5 font-medium">
          {isOnePage ? '1 page' : `${selected.length} selected`}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 stagger-children">
        {PAGES.map((page) => {
          const isSelected = selected.includes(page.id);
          const isDisabled = isOnePage && page.id !== 'home' && !selected.includes('home');

          return (
            <button
              key={page.id}
              onClick={() => togglePage(page.id)}
              disabled={isDisabled}
              className={`select-card p-4 ${isSelected ? 'selected' : ''} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3 relative z-10">
                <div
                  className={`checkbox flex-shrink-0 ${isSelected ? 'checked' : ''}`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`flex-shrink-0 ${isSelected ? 'text-[#818cf8]' : 'text-[#64748b]'}`}
                       style={{ transition: 'color 0.2s' }}>
                    {PAGE_ICONS[page.id]}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-medium text-white text-sm leading-tight">{page.label}</div>
                    <div className="text-xs text-[#64748b] leading-tight mt-0.5">{page.description}</div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
