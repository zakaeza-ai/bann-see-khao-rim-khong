"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // เบราว์เซอร์บล็อกการเล่นเสียงอัตโนมัติ ต้องให้ผู้ใช้กดก่อนถึงจะเล่นได้
    // ลองเล่นแบบ muted ก่อนเผื่อบางเบราว์เซอร์อนุญาต แต่ปกติจะไม่เล่นจนกว่าจะมีการคลิก
  }, []);

  function toggleMusic() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />
      <button
        onClick={toggleMusic}
        aria-label={playing ? "ปิดเพลง" : "เปิดเพลง"}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-river-600 hover:bg-river-700 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        {playing ? <Music size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
