"use client";

interface CashFlowTimelineProps {
  completedMilestones: number;
}

export default function CashFlowTimeline({ completedMilestones }: CashFlowTimelineProps) {
  const allMilestones = [
    {
      id: 1,
      name: "Foundation & Concrete",
      payment: 8500,
      dueDate: "Dec 15, 2025",
      completedDate: "Dec 14, 2025",
    },
    {
      id: 2,
      name: "Plumbing Rough-In",
      payment: 6200,
      dueDate: "Dec 22, 2025",
      completedDate: "Dec 21, 2025",
    },
    {
      id: 3,
      name: "Electrical & Drywall",
      payment: 12000,
      dueDate: "Jan 5, 2026",
      predictedDate: "Jan 8, 2026",
    },
    {
      id: 4,
      name: "Kitchen Installation",
      payment: 15000,
      dueDate: "Jan 18, 2026",
      predictedDate: "Jan 20, 2026",
    },
  ];

  // Dynamically determine milestone status based on completedMilestones
  const milestones = allMilestones.map((m, index) => {
    if (index < completedMilestones) {
      return {
        ...m,
        status: "completed" as const,
        progress: 100,
        completedDate: m.completedDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    } else if (index === completedMilestones) {
      return {
        ...m,
        status: "in-progress" as const,
        progress: 67,
        predictedDate: m.predictedDate,
      };
    } else {
      return {
        ...m,
        status: "pending" as const,
        progress: 0,
        predictedDate: m.predictedDate,
      };
    }
  });

  const totalBudget = allMilestones.reduce((sum, m) => sum + m.payment, 0);
  const completedPayments = milestones
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.payment, 0);
  const progressPercentage = Math.round(
    (completedPayments / totalBudget) * 100
  );

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-orange-100 text-sm">Total Budget</p>
            <p className="text-2xl font-bold">€{totalBudget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Paid Out</p>
            <p className="text-2xl font-bold">€{completedPayments.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm">Progress</p>
            <p className="text-2xl font-bold">{progressPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Next Payment Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Next Payment Unlocks Soon</p>
            <p className="text-sm text-gray-600">€12,000 releases when "Electrical & Drywall" verified</p>
          </div>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          ~7 days
        </span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Milestone Timeline</h3>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {/* Connector Line */}
              {index < milestones.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}

              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.status === "completed"
                    ? "bg-green-100"
                    : milestone.status === "in-progress"
                    ? "bg-orange-100"
                    : "bg-gray-100"
                }`}>
                  {milestone.status === "completed" ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : milestone.status === "in-progress" ? (
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                    <span className="text-lg font-bold text-gray-900">
                      €{milestone.payment.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {milestone.status !== "pending" && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center space-x-4 text-sm">
                    {milestone.completedDate ? (
                      <span className="text-green-600 font-medium">
                        ✓ Completed {milestone.completedDate}
                      </span>
                    ) : milestone.predictedDate ? (
                      <>
                        <span className="text-gray-500">
                          Due: {milestone.dueDate}
                        </span>
                        <span className={`font-medium ${
                          milestone.predictedDate > milestone.dueDate
                            ? "text-yellow-600"
                            : "text-gray-700"
                        }`}>
                          Predicted: {milestone.predictedDate}
                          {milestone.predictedDate > milestone.dueDate && " (+3 days)"}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Due: {milestone.dueDate}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900 text-sm">AI Prediction</p>
            <p className="text-gray-700 text-sm mt-1">
              Based on current pace, project completion is tracking 2 days behind schedule. 
              Suggest increasing workforce for "Kitchen Installation" phase to meet original deadline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}