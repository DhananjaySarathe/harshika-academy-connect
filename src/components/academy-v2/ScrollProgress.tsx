import { useEffect, useState } from "react";

import { onViewportChange } from "@/hooks/use-motion";

/** 2px read-progress line. Lime works here: it's a fill, not text. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(
    () =>
      onViewportChange(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable <= 0 ? 0 : Math.min(100, (window.scrollY / scrollable) * 100));
      }),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5" aria-hidden="true">
      <div className="h-full bg-lime-strong" style={{ width: `${progress}%` }} />
    </div>
  );
}
