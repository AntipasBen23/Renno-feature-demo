"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import AnalysisLoader from "@/components/AnalysisLoader";
import VerificationResults from "@/components/VerificationResults";
import DisputeModal from "@/components/DisputeModal";
import CashFlowTimeline from "@/components/CashFlowTimeline";
import VerificationHistory from "@/components/VerificationHistory";
import { analyzeImage, type AnalysisResult } from "@/lib/aiAnalysis";

type AnalysisStage = "idle" | "uploading" | "extracting" | "analyzing" | "complete";

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState(2); // Start with 2 completed

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Start analysis simulation
    setAnalysisStage("uploading");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnalysisStage("extracting");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAnalysisStage("analyzing");
    const result = await analyzeImage(file);
    
    setAnalysisStage("complete");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAnalysisResult(result);
    setAnalysisStage("idle");

    // Add to verification history
    const now = new Date();
    const milestoneNames = [
      "Electrical & Drywall",
      "Kitchen Installation",
      "Flooring & Finishes",
      "Painting & Touch-ups",
    ];
    
    const newRecord: VerificationRecord = {
      id: Date.now(),
      milestone: milestoneNames[completedMilestones] || "Additional Work",
      date: now.toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" }),
      time: now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      score: result.score,
      status: result.score >= 85 ? "verified" : "disputed",
      contractor: "BuildPro NL",
      payment: result.score >= 85 ? 12000 : 0,
      images: 1,
    };

    setVerificationHistory(prev => [newRecord, ...prev]);

    // Update completed milestones if verified
    if (result.score >= 85) {
      setCompletedMilestones(prev => prev + 1);
    }

    // Auto-open dispute modal if score is low
    if (result.score < 85) {
      setTimeout(() => setShowDisputeModal(true), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Renno Vision AI</h1>
                <p className="text-sm text-gray-500">Autonomous Milestone Verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Project: Kitchen Renovation - Amsterdam</span>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs font-medium">MS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("upload")}
              className={`${
                activeTab === "upload"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upload & Verify
            </button>
            <button
              onClick={() => setActiveTab("cashflow")}
              className={`${
                activeTab === "cashflow"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Predictive Cash Flow
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`${
                activeTab === "history"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Verification History
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Milestone Photo</h2>
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>

            {analysisStage !== "idle" && (
              <AnalysisLoader stage={analysisStage} />
            )}

            {analysisResult && (
              <VerificationResults
                score={analysisResult.score}
                confidence={analysisResult.confidence}
                issues={analysisResult.issues}
                detectedItems={analysisResult.detectedItems}
                timestamp={analysisResult.timestamp}
                location={analysisResult.location}
              />
            )}
          </div>
        )}

        {activeTab === "cashflow" && (
          <CashFlowTimeline completedMilestones={completedMilestones} />
        )}

        {activeTab === "history" && (
          <VerificationHistory history={verificationHistory} />
        )}
      </main>

      {/* Dispute Modal */}
      {showDisputeModal && previewUrl && analysisResult && (
        <DisputeModal
          isOpen={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          score={analysisResult.score}
          imageSrc={previewUrl}
        />
      )}
    </div>
  );
}