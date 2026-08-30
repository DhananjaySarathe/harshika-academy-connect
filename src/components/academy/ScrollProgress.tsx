import { useEffect, useState } from "react";

import { onViewportChange } from "@/hooks/use-motion";

/** 2px gold read-progress line pinned to the very top of the viewport. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(
    () =>
      onViewportChange(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        // A page shorter than the viewport has nothing to progress through.
        setProgress(scrollable <= 0 ? 0 : Math.min(100, (window.scrollY / scrollable) * 100));
      }),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
