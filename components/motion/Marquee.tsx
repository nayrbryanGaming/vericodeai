"use client";

/** Seamless horizontal marquee. Content is duplicated so the CSS translateX
 *  loop is continuous. Pure CSS (transform), pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex w-max gap-12 group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-medium tracking-wide text-muted-foreground whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
