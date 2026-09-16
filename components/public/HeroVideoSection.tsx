"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { HeroVideo } from "@/lib/actions/hero-videos";

export function HeroVideoSection({ videos }: { videos: HeroVideo[] }) {
  const [activeSlot, setActiveSlot] = useState(1);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = videos.find((v) => v.slot === activeSlot);

  function handleSwitch(slot: number) {
    setActiveSlot(slot);
  }

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  }

  if (!active || (!active.video_url && videos.every((v) => !v.video_url))) {
    return null;
  }

  return (
    <section className="relative w-full h-[45vh] md:h-[60vh] max-h-[560px] overflow-hidden bg-river-900">
      {active.video_url ? (
        <video
          ref={videoRef}
          key={active.video_url}
          src={active.video_url}
          autoPlay
          muted={muted}
          loop
          playsInline
          poster={active.poster_url || undefined}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/70">
          ยังไม่มีวิดีโอ
        </div>
      )}

      {/* ปุ่มเปิด/ปิดเสียง */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {videos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {videos.map((v) => (
            <button
              key={v.slot}
              onClick={() => handleSwitch(v.slot)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                v.slot === activeSlot
                  ? "bg-white text-river-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
