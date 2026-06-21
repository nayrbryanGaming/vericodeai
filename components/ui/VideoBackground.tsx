"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  className?: string;
  playbackRate?: number;
}

export function VideoBackground({ src, className = "", playbackRate = 0.4 }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) {
      // Ensure video plays automatically even on strict browsers
      videoRef.current.play().catch(e => {
        console.warn("Video auto-play failed:", e);
      });
    }
  }, [src]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        // scale(1.15) and translate to crop out the Veo logo typically found at the edges
        className="absolute w-full h-full object-cover"
        style={{
          transform: "scale(1.15) translateY(3%)", 
          // Apply a subtle color grading/darkening to ensure text remains readable
          filter: "brightness(0.8) contrast(1.1) saturate(1.2)",
        }}
      />
    </div>
  );
}
