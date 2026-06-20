"use client";

import { useMemo, useState } from "react";
import { Shuffle, Check, X } from "lucide-react";
import {
  CATEGORIES,
  DEFAULT_CONFIG,
  buildAvatarDataUri,
  buildOptionPreview,
  randomConfig,
  type AvatarConfig,
  type CategoryKey,
} from "./avatarConfig";

type Props = {
  initialConfig?: AvatarConfig;
  onSave: (dataUri: string, config: AvatarConfig) => void;
  onClose: () => void;
};

export default function Avatar3DStudio({ initialConfig, onSave, onClose }: Props) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [activeCat, setActiveCat] = useState<CategoryKey>("skinColor");

  const preview = useMemo(() => buildAvatarDataUri(config), [config]);
  const category = CATEGORIES.find((c) => c.key === activeCat)!;

  function set(key: CategoryKey, value: string) {
    setConfig((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Create your 3D Avatar</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Live preview */}
        <div className="flex flex-col items-center gap-3 py-5 bg-muted/40">
          <div className="w-28 h-28 rounded-full ring-4 ring-card shadow-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Avatar preview" className="w-full h-full" />
          </div>
          <button
            onClick={() => setConfig(randomConfig())}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-text hover:opacity-80 transition-opacity"
          >
            <Shuffle size={14} /> Shuffle
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 px-4 py-2 overflow-x-auto border-y border-border bg-card">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCat === c.key
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Options grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {category.type === "color" ? (
            <div className="grid grid-cols-6 gap-3 sm:grid-cols-8">
              {category.options.map((opt) => {
                const selected = config[activeCat] === opt.value;
                const isTransparent = opt.value === "transparent";
                return (
                  <button
                    key={opt.value}
                    onClick={() => set(activeCat, opt.value)}
                    title={opt.label}
                    className={`relative aspect-square rounded-full border-2 transition-all ${
                      selected ? "border-brand scale-110" : "border-border hover:border-muted-foreground/40"
                    }`}
                    style={
                      isTransparent
                        ? {
                            backgroundImage:
                              "linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,#fff 25%,#fff 75%,#ccc 75%)",
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0,4px 4px",
                          }
                        : { backgroundColor: `#${opt.value}` }
                    }
                  >
                    {selected && (
                      <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
              {category.options.map((opt) => {
                const selected = config[activeCat] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => set(activeCat, opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-1.5 transition-all ${
                      selected ? "border-brand bg-brand-light" : "border-border hover:border-muted-foreground/40 bg-card"
                    }`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={buildOptionPreview(config, activeCat, opt.value)}
                        alt={opt.label}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] leading-tight text-muted-foreground truncate w-full text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-border bg-card">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(preview, config)}
            className="flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-text transition-colors"
          >
            <Check size={14} /> Use this avatar
          </button>
        </div>
      </div>
    </div>
  );
}
