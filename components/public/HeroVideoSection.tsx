"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";
import type { HeroVideo } from "@/lib/actions/hero-videos";

export function HeroVideoSection({ videos }: { videos: HeroVideo[] }) {
  const [activeSlot, setActiveSlot] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = videos.find((v) => v.slot === activeSlot);

  function handlePlay() {
    setIsPlaying(true);
    // รอ DOM อัปเดตแล้วค่อยสั่งเล่น เพื่อให้ได้เสียง (ต้องเกิดจาก user gesture)
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  }

  function handleSwitch(slot: number) {
    setActiveSlot(slot);
    setIsPlaying(false);
  }

  if (!active || (!active.video_url && videos.every((v) => !v.video_url))) {
    return null; // ยังไม่มีวิดีโอเลย ไม่ต้องแสดง section นี้
  }

  return (
    <section className="relative w-full h-[70vh] min-h-[420px] max-h-[720px] overflow-hidden bg-river-900">
      {active.video_url ? (
        isPlaying ? (
          <video
            ref={videoRef}
            src={active.video_url}
            controls
            className="w-full h-full object-cover"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <button
            onClick={handlePlay}
            className="group relative w-full h-full flex items-center justify-center"
          >
            {active.poster_url ? (
              <img
                src={active.poster_url}
                alt={active.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-river-800 via-river-900 to-black" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-white">
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 group-hover:scale-105 transition-transform">
                <Play size={32} className="text-river-900 ml-1" fill="currentColor" />
              </span>
              <span className="text-lg font-semibold drop-shadow">{active.title}</span>
            </div>
          </button>
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/70">
          ยังไม่มีวิดีโอ
        </div>
      )}

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