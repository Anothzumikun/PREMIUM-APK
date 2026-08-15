"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FloatingDock({
  whatsappLink,
  musicUrl,
}: {
  whatsappLink: string;
  musicUrl?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState<"music" | "wa" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.18;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [musicUrl]);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        /* browser mungkin butuh interaksi user dulu, sudah terpenuhi via klik ini */
      });
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {musicUrl && (
        <div
          className="relative"
          onMouseEnter={() => setHovered("music")}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === "music" && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 font-body text-xs text-ink-100 shadow-panel"
              >
                {isPlaying ? "Jeda musik" : "Putar musik"}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border border-base-700 bg-base-900/90 text-ink-100 shadow-panel backdrop-blur transition-all duration-200 hover:border-accent-indigo/60",
              isPlaying && "border-accent-indigo/70 text-accent-sky"
            )}
          >
            {isPlaying ? (
              <Volume2 className="h-5 w-5 animate-pulse-soft" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
        </div>
      )}

      {whatsappLink && (
        <div
          className="relative"
          onMouseEnter={() => setHovered("wa")}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === "wa" && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 font-body text-xs text-ink-100 shadow-panel"
              >
                Chat Admin
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat Customer Service via WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gradient text-white shadow-glow transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>
      )}
    </div>
  );
}
