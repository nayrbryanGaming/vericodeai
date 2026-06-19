"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const dimensions = {
    sm: { w: 24, h: 24 },
    md: { w: 32, h: 32 },
    lg: { w: 48, h: 48 },
  };

  const { w, h } = dimensions[size];

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Image
          src={isDark ? "/vericode-logo-mark-white.png" : "/vericode-logo-mark.png"}
          alt="VeriCode AI Logo"
          width={w}
          height={h}
          className="object-contain"
          priority
        />
      </div>
      <span
        className={`font-bold tracking-tight text-foreground ${
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-3xl"
        }`}
      >
        VeriCode <span className="text-brand">AI</span>
      </span>
    </Link>
  );
}
