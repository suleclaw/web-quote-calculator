'use client';

import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import PageSelector from '@/components/PageSelector';
import FeatureSelector from '@/components/FeatureSelector';
import QuoteSummary from '@/components/QuoteSummary';
import InquiryForm from '@/components/InquiryForm';

const TOTAL_STEPS = 4;

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedPages, setSelectedPages] = useState<string[]>(['home']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = () => {
    if (step === 1) return selectedPages.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          selectedPageIds: selectedPages,
          selectedFeatureIds: selectedFeatures,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send inquiry');
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Quote Calculator</h1>
          <p className="text-gray-600">Build your quote step by step</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Choose Your Pages</h2>
              <PageSelector selected={selectedPages} onChange={setSelectedPages} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Add Extra Features</h2>
              <FeatureSelector selected={selectedFeatures} onChange={setSelectedFeatures} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Review Your Quote</h2>
              <QuoteSummary selectedPageIds={selectedPages} selectedFeatureIds={selectedFeatures} />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Submit Your Inquiry</h2>
              <QuoteSummary selectedPageIds={selectedPages} selectedFeatureIds={selectedFeatures} />
              <div className="mt-6">
                <InquiryForm
                  name={clientName}
                  email={clientEmail}
                  onNameChange={setClientName}
                  onEmailChange={setClientEmail}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  error={error}
                />
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < 3 && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Submit
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          All quotes are estimates. Final pricing may vary based on project specifics.
        </p>
      </div>
    </div>
  );
}
