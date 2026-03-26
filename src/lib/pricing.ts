export const BASE_PRICE = 100;
export const PAGES_INCLUDED = 4;
export const PRICE_PER_EXTRA_PAGE = 10;

export const PAGES = [
  { id: 'home', label: 'Home', description: 'Landing page with hero section and overview' },
  { id: 'about', label: 'About', description: 'Company story, mission, and values' },
  { id: 'services', label: 'Services', description: 'What you offer to clients' },
  { id: 'contact', label: 'Contact', description: 'Contact form and business details' },
  { id: 'gallery', label: 'Gallery', description: 'Photo or media showcase' },
  { id: 'testimonials', label: 'Testimonials', description: 'Client reviews and feedback' },
  { id: 'team', label: 'Team', description: 'Meet your team or staff' },
  { id: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { id: 'pricing', label: 'Pricing', description: 'Pricing for your services' },
  { id: 'blog', label: 'Blog / News', description: 'Articles and updates' },
];

export const FEATURES = [
  { id: 'ai-chatbot', label: 'AI Chatbot', price: 80, description: 'Intelligent assistant for visitor support' },
  { id: 'shopping-cart', label: 'Shopping Cart + Payments', price: 120, description: 'E-commerce with checkout and payment processing' },
  { id: 'booking', label: 'Booking / Reservations', price: 90, description: 'Appointment scheduling system' },
  { id: 'cms', label: 'CMS / Blog', price: 60, description: 'Manage your own content and articles' },
  { id: 'user-accounts', label: 'User Accounts', price: 70, description: 'Login, profiles, and saved data' },
  { id: 'newsletter', label: 'Newsletter Signup', price: 30, description: 'Email list collection' },
  { id: 'social', label: 'Social Media Integration', price: 20, description: 'Connect your social profiles' },
  { id: 'analytics', label: 'Google Analytics', price: 15, description: 'Visitor tracking and reporting' },
  { id: 'multilang', label: 'Multi-language Support', price: 50, description: 'Localized content in multiple languages' },
];

export function calculateQuote(selectedPageIds: string[], selectedFeatureIds: string[]) {
  const pageCount = selectedPageIds.length;
  const extraPages = Math.max(0, pageCount - PAGES_INCLUDED);
  const pagesCost = extraPages * PRICE_PER_EXTRA_PAGE;

  const featuresCost = selectedFeatureIds.reduce((total, id) => {
    const feature = FEATURES.find((f) => f.id === id);
    return total + (feature?.price ?? 0);
  }, 0);

  const total = BASE_PRICE + pagesCost + featuresCost;

  return {
    basePrice: BASE_PRICE,
    pagesCost,
    extraPages,
    featuresCost,
    total,
  };
}
