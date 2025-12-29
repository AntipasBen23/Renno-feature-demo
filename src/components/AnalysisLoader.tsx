"use client";

interface AnalysisLoaderProps {
  stage: "uploading" | "extracting" | "analyzing" | "complete";
}

export default function AnalysisLoader({ stage }: AnalysisLoaderProps) {
  const stages = [
    { key: "uploading", label: "Uploading image..." },
    { key: "extracting", label: "Extracting EXIF data..." },
    { key: "analyzing", label: "Analyzing construction work..." },
    { key: "complete", label: "Analysis complete!" },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Stage Labels */}
        <div className="space-y-3 w-full max-w-md">
          {stages.map((s, index) => (
            <div
              key={s.key}
              className={`flex items-center space-x-3 transition-all ${
                index <= currentStageIndex
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {index < currentStageIndex ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : index === currentStageIndex ? (
                <div className="w-5 h-5 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              )}
              <span className="text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}