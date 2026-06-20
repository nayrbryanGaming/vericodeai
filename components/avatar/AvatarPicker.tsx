"use client";

import { useRef, useState } from "react";
import { Camera, Sparkles, Trash2 } from "lucide-react";
import Avatar3DStudio from "./Avatar3DStudio";
import { type AvatarConfig } from "./avatarConfig";

export type AvatarValue = {
  type: "upload" | "3d" | "none";
  src: string; // data uri or remote url; "" when none
  config?: AvatarConfig;
};

type Props = {
  fallbackInitial?: string; // letter shown when no avatar
  value?: AvatarValue;
  onChange?: (value: AvatarValue) => void;
};

const MAX_BYTES = 5 * 1024 * 1024;

export default function AvatarPicker({ fallbackInitial = "?", value, onChange }: Props) {
  const [avatar, setAvatar] = useState<AvatarValue>(value ?? { type: "none", src: "" });
  const [studioOpen, setStudioOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function commit(next: AvatarValue) {
    setAvatar(next);
    onChange?.(next);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is larger than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => commit({ type: "upload", src: reader.result as string });
    reader.readAsDataURL(file);
    // TODO (backend): also POST file to /api/user/avatar (FormData) and store returned URL.
    e.target.value = "";
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Profile picture</h2>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center overflow-hidden ring-2 ring-border shrink-0">
          {avatar.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar.src} alt="Profile avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-brand-text uppercase">{fallbackInitial}</span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStudioOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-brand-foreground bg-brand px-3 py-1.5 rounded-lg hover:bg-brand-text transition-colors"
            >
              <Sparkles size={14} /> {avatar.type === "3d" ? "Edit 3D avatar" : "Create 3D avatar"}
            </button>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm font-medium text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Camera size={14} /> Upload photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            {avatar.src && (
              <button
                type="button"
                onClick={() => commit({ type: "none", src: "" })}
                className="flex items-center gap-2 text-sm font-medium text-destructive border border-border px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Build a Bitmoji-style 3D avatar, or upload JPG/PNG/GIF (max 5MB).
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>

      {studioOpen && (
        <Avatar3DStudio
          initialConfig={avatar.type === "3d" ? avatar.config : undefined}
          onClose={() => setStudioOpen(false)}
          onSave={(dataUri, config) => {
            commit({ type: "3d", src: dataUri, config });
            setStudioOpen(false);
            // TODO (backend): persist `config` (JSON) so the avatar can be re-rendered/edited later.
          }}
        />
      )}
    </div>
  );
}
