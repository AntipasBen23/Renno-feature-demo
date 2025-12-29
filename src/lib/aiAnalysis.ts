// Simulated AI analysis with realistic delays and scoring

export interface AnalysisResult {
  score: number;
  confidence: "High" | "Medium" | "Low";
  issues: string[];
  detectedItems: string[];
  timestamp: string;
  location?: string;
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  // Simulate processing delay
  await delay(2500);

  // Extract basic metadata
  const timestamp = new Date(file.lastModified).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generate realistic score with some randomness
  const baseScore = 75 + Math.random() * 20; // 75-95%
  const score = Math.round(baseScore);

  // Determine confidence based on score
  let confidence: "High" | "Medium" | "Low" = "High";
  if (score < 85) confidence = "Medium";
  if (score < 70) confidence = "Low";

  // Mock detected items (construction-related)
  const allItems = [
    "Concrete foundation",
    "Rebar placement",
    "Formwork alignment",
    "Surface finish",
    "Corner joints",
    "Expansion joints",
    "Waterproofing layer",
    "Insulation material",
  ];

  const detectedItems = allItems
    .sort(() => Math.random() - 0.5)
    .slice(0, 4 + Math.floor(Math.random() * 3));

  // Generate issues if score is low
  const issues: string[] = [];
  if (score < 85) {
    const possibleIssues = [
      "Corner joint requires closer inspection",
      "Uneven surface finish detected in lower right section",
      "Potential gap in waterproofing layer",
      "Rebar spacing appears irregular in one area",
      "Minor formwork misalignment detected",
    ];
    const numIssues = score < 70 ? 2 : 1;
    issues.push(...possibleIssues.slice(0, numIssues));
  }

  return {
    score,
    confidence,
    issues,
    detectedItems,
    timestamp,
    location: "Amsterdam, Noord-Holland",
  };
}

export async function extractEXIF(file: File): Promise<{
  dateTaken: string;
  camera?: string;
  location?: { lat: number; lng: number };
}> {
  // Simulate EXIF extraction delay
  await delay(500);

  // For demo, use file metadata
  const dateTaken = new Date(file.lastModified).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    dateTaken,
    camera: "iPhone 14 Pro",
    location: {
      lat: 52.3676 + (Math.random() - 0.5) * 0.01,
      lng: 4.9041 + (Math.random() - 0.5) * 0.01,
    },
  };
}

export function validateLocation(
  photoLocation: { lat: number; lng: number },
  projectLocation: { lat: number; lng: number }
): { isValid: boolean; distance: number } {
  // Calculate distance using Haversine formula (simplified)
  const R = 6371; // Earth's radius in km
  const dLat = ((projectLocation.lat - photoLocation.lat) * Math.PI) / 180;
  const dLng = ((projectLocation.lng - photoLocation.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((photoLocation.lat * Math.PI) / 180) *
      Math.cos((projectLocation.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return {
    isValid: distance < 0.5, // Within 500m
    distance: Math.round(distance * 1000) / 1000,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function extractEXIF(file: File): Promise<{
  dateTaken: string;
  camera?: string;
  location?: { lat: number; lng: number };
}> {
  // Simulate EXIF extraction delay
  await delay(500);

  // For demo, use file metadata
  const dateTaken = new Date(file.lastModified).toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    dateTaken,
    camera: "iPhone 14 Pro",
    location: {
      lat: 52.3676 + (Math.random() - 0.5) * 0.01,
      lng: 4.9041 + (Math.random() - 0.5) * 0.01,
    },
  };
}

export function validateLocation(
  photoLocation: { lat: number; lng: number },
  projectLocation: { lat: number; lng: number }
): { isValid: boolean; distance: number } {
  // Calculate distance using Haversine formula (simplified)
  const R = 6371; // Earth's radius in km
  const dLat = ((projectLocation.lat - photoLocation.lat) * Math.PI) / 180;
  const dLng = ((projectLocation.lng - photoLocation.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((photoLocation.lat * Math.PI) / 180) *
      Math.cos((projectLocation.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return {
    isValid: distance < 0.5, // Within 500m
    distance: Math.round(distance * 1000) / 1000,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}