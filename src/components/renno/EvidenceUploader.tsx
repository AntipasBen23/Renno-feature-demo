"use client";

import { useState } from "react";
import { useRennoStore } from "../store/rennoStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function uid(prefix = "ev") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function EvidenceUploader({ milestoneId, disabled }: { milestoneId: string; disabled?: boolean }) {
  const addEvidence = useRennoStore((s) => s.addEvidence);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [geo, setGeo] = useState<{ lat: number; lon: number; accuracyM?: number } | null>(null);

  async function captureGeo() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracyM: pos.coords.accuracy });
      },
      () => setGeo(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(5);

    // create preview for demo
    const dataUrl = await new Promise<string | undefined>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });

    // fake upload progress
    for (let p = 10; p <= 95; p += Math.floor(Math.random() * 16) + 6) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(Math.min(95, p));
    }

    addEvidence(milestoneId, {
      id: uid("evidence"),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      previewDataUrl: dataUrl,
      createdAt: new Date().toISOString(),
      capturedAt: new Date().toISOString(),
      geo,
      deviceNote: "Captured via Renno Secure Camera (demo)",
    });

    setProgress(100);
    await new Promise((r) => setTimeout(r, 250));
    setUploading(false);
    setProgress(0);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          disabled={disabled || uploading}
          onClick={captureGeo}
        >
          Capture GPS (optional)
        </Button>
        {geo ? (
          <Badge variant="outline">
            GPS: {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)} (±{Math.round(geo.accuracyM ?? 0)}m)
          </Badge>
        ) : (
          <span className="text-xs text-renno-muted">GPS not captured</span>
        )}
      </div>

      <div className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
        <div className="text-sm font-extrabold mb-2">Evidence capture</div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-renno-muted">
            Upload 2–3 images/video for best AI confidence.
          </div>

          <label className="inline-flex">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={disabled || uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.currentTarget.value = "";
              }}
            />
            <span className={`cursor-pointer`}>
              <Button disabled={disabled || uploading}>
                {uploading ? "Uploading..." : "Add Evidence"}
              </Button>
            </span>
          </label>
        </div>

        {uploading && (
          <div className="mt-3 space-y-2">
            <Progress value={progress} />
            <div className="text-xs text-renno-muted">
              Simulating secure upload → object storage (pre-signed URL flow).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
