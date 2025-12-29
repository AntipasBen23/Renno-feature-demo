"use client";

interface VerificationRecord {
  id: number;
  milestone: string;
  date: string;
  time: string;
  score: number;
  status: "verified" | "disputed";
  contractor: string;
  payment: number;
  images: number;
}

interface VerificationHistoryProps {
  history: VerificationRecord[];
}

export default function VerificationHistory({ history }: VerificationHistoryProps) {
  // Static initial history (shown when no uploads yet)
  const initialHistory = [
    {
      id: 1,
      milestone: "Foundation & Concrete",
      date: "14 Dec, 2025",
      time: "14:32",
      score: 92,
      status: "verified" as const,
      contractor: "BuildPro NL",
      payment: 8500,
      images: 4,
    },
    {
      id: 2,
      milestone: "Plumbing Rough-In",
      date: "21 Dec, 2025",
      time: "09:15",
      score: 88,
      status: "verified" as const,
      contractor: "BuildPro NL",
      payment: 6200,
      images: 6,
    },
    {
      id: 3,
      milestone: "Foundation Inspection",
      date: "10 Dec, 2025",
      time: "16:45",
      score: 73,
      status: "disputed" as const,
      contractor: "BuildPro NL",
      payment: 0,
      images: 3,
    },
  ];

  // Combine new uploads with initial history
  const allHistory = [...history, ...initialHistory];

  const verifiedCount = allHistory.filter(h => h.status === "verified").length;
  const disputedCount = allHistory.filter(h => h.status === "disputed").length;
  const totalPaid = allHistory.reduce((sum, h) => sum + h.payment, 0) / 1000;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Verified</p>
          <p className="text-3xl font-bold text-green-900">{verifiedCount}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">Disputed</p>
          <p className="text-3xl font-bold text-yellow-900">{disputedCount}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">Total Paid</p>
          <p className="text-3xl font-bold text-blue-900">€{totalPaid.toFixed(1)}k</p>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Verification History</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {allHistory.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{item.milestone}</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "verified" ? "✓ Verified" : "⚠ Disputed"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{item.contractor}</span>
                    <span>•</span>
                    <span>
                      {item.date} at {item.time}
                    </span>
                    <span>•</span>
                    <span>{item.images} images</span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="text-right ml-4">
                  <div className="mb-2">
                    <span
                      className={`text-2xl font-bold ${
                        item.score >= 85
                          ? "text-green-600"
                          : item.score >= 70
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.score}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">score</span>
                  </div>
                  {item.payment > 0 && (
                    <p className="text-lg font-semibold text-gray-900">
                      €{item.payment.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.score >= 85
                        ? "bg-green-500"
                        : item.score >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center space-x-3">
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View Details
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud Alert Example */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-red-900 text-sm">Fraud Prevention Alert</p>
            <p className="text-red-700 text-sm mt-1">
              Foundation Inspection (Dec 10) was rejected due to photo timestamp mismatch and 
              location 12km from project site. Contractor notified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}