"use client";

import { useState } from "react";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  imageSrc: string;
}

export default function DisputeModal({
  isOpen,
  onClose,
  score,
  imageSrc,
}: DisputeModalProps) {
  const [paymentPercentage, setPaymentPercentage] = useState(score);

  if (!isOpen) return null;

  const suggestedPayment = (12000 * (paymentPercentage / 100)).toFixed(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Dispute Resolution
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            AI confidence below 85% - Review required
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image with AI Overlay */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              AI-Highlighted Issues
            </h3>
            <div className="relative">
              <img
                src={imageSrc}
                alt="Construction milestone"
                className="w-full rounded-lg"
              />
              {/* Simulated AI overlay boxes */}
              <div className="absolute top-[20%] right-[15%] w-32 h-24 border-2 border-red-500 bg-red-500 bg-opacity-10 rounded"></div>
              <div className="absolute top-[22%] right-[10%] bg-red-500 text-white text-xs px-2 py-1 rounded">
                Issue detected
              </div>
            </div>
          </div>

          {/* Payment Slider */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Suggested Partial Payment
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="text-2xl font-bold text-orange-600">
                  {paymentPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={paymentPercentage}
                onChange={(e) => setPaymentPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment amount:</span>
                <span className="text-xl font-semibold text-gray-900">
                  €{suggestedPayment}
                </span>
              </div>
            </div>
          </div>

          {/* Contractor Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contractor Reliability</p>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold text-gray-900">4.7</span>
                  <span className="text-gray-500 ml-2">/5.0</span>
                  <span className="text-xs text-gray-500 ml-2">(23 projects)</span>
                </div>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4 ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Request Video Review
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}