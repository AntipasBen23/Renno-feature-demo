"use client";

interface VerificationResultsProps {
  score: number;
  confidence: "High" | "Medium" | "Low";
  issues: string[];
  detectedItems: string[];
  timestamp: string;
  location?: string;
}

export default function VerificationResults({
  score,
  confidence,
  issues,
  detectedItems,
  timestamp,
  location,
}: VerificationResultsProps) {
  const getScoreColor = () => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (score >= 85) return "bg-green-50";
    if (score >= 70) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getScoreBorderColor = () => {
    if (score >= 85) return "border-green-200";
    if (score >= 70) return "border-yellow-200";
    return "border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div
        className={`rounded-lg border-2 p-6 ${getScoreBorderColor()} ${getScoreBgColor()}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Verification Score
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Confidence: {confidence}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {score}%
            </div>
            {score >= 85 ? (
              <span className="inline-flex items-center text-green-600 text-sm font-medium mt-2">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center text-yellow-600 text-sm font-medium mt-2">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Requires Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Photo Metadata</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Timestamp:</span>
            <p className="font-medium text-gray-900">{timestamp}</p>
          </div>
          {location && (
            <div>
              <span className="text-gray-500">Location:</span>
              <p className="font-medium text-gray-900">{location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detected Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Detected Elements</h4>
        <div className="flex flex-wrap gap-2">
          {detectedItems.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Flagged Issues
          </h4>
          <ul className="space-y-2">
            {issues.map((issue, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}