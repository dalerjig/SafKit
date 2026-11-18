import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { style } from "typestyle";

const hiddenHorizontalScrollbar = style({
  $nest: {
    "&&::-webkit-scrollbar": { height: 0 },
    "@supports not selector(::-webkit-scrollbar)": { scrollbarWidth: "none" },
  },
});

export function useAlwaysHorizontalScroll(
  enabled: boolean,
  external: boolean,
  container: HTMLElement | null | undefined,
  rootRef: RefObject<HTMLElement | null>,
  shellRef: RefObject<HTMLDivElement | null>,
  barRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
) {
  const updateRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const shell = shellRef.current;
    const bar = barRef.current;
    const track = trackRef.current;
    const source = external ? container : shell;
    if (!enabled || !root || !shell || !bar || !track || !source) return;

    const syncFromSource = () => {
      if (Math.abs(bar.scrollLeft - source.scrollLeft) > 0.5) {
        bar.scrollLeft = source.scrollLeft;
      }
    };
    const syncFromBar = () => {
      if (Math.abs(source.scrollLeft - bar.scrollLeft) > 0.5) {
        source.scrollLeft = bar.scrollLeft;
      }
    };
    const update = () => {
      const range = Math.max(0, source.scrollWidth - source.clientWidth);
      bar.hidden = range === 0;
      bar.style.width = `${Math.max(0, source.clientWidth - (external ? root.clientLeft * 2 : 0))}px`;
      track.style.width = `${bar.clientWidth + range}px`;
      syncFromSource();
    };

    const alreadyHidden = source.classList.contains(hiddenHorizontalScrollbar);
    source.classList.add(hiddenHorizontalScrollbar);
    source.addEventListener("scroll", syncFromSource, { passive: true });
    bar.addEventListener("scroll", syncFromBar, { passive: true });
    const observer = new ResizeObserver(update);
    for (const element of new Set([source, root, shell, ...Array.from(shell.children)])) {
      observer.observe(element);
    }
    updateRef.current = update;
    update();

    return () => {
      observer.disconnect();
      source.removeEventListener("scroll", syncFromSource);
      bar.removeEventListener("scroll", syncFromBar);
      if (!alreadyHidden) source.classList.remove(hiddenHorizontalScrollbar);
      updateRef.current = null;
    };
  }, [enabled, external, container, rootRef, shellRef, barRef, trackRef]);

  useLayoutEffect(() => {
    updateRef.current?.();
  });
}
