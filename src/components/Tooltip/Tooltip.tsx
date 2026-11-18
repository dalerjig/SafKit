import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { classes, style } from "typestyle";
import { useShKitPortalTarget } from "../../provider";
import { color, radius, space, zIndex } from "../../tokens";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  disabled?: boolean;
  delay?: number;
  /** Класс обёртки триггера. */
  className?: string;
  /** Класс всплывающей подсказки (portal). */
  popupClassName?: string;
};

export const Tooltip = ({
  content,
  children,
  placement = "top",
  disabled,
  delay = 250,
  className,
  popupClassName
}: TooltipProps) => {
  const portalTarget = useShKitPortalTarget();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<TooltipRect | null>(null);

  const show = () => {
    if (disabled) return;
    timerRef.current = window.setTimeout(() => {
      const nextRect = triggerRef.current?.getBoundingClientRect();
      if (!nextRect) return;
      setRect(getTooltipRect(nextRect, placement));
      setOpen(true);
    }, delay);
  };

  const hide = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const nextRect = triggerRef.current?.getBoundingClientRect();
      if (nextRect) setRect(getTooltipRect(nextRect, placement));
    };

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, placement]);

  useEffect(() => hide, []);

  return (
    <span
      ref={triggerRef}
      className={classes(tooltipStyles.trigger, className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open &&
        rect &&
        createPortal(
          <span
            className={classes(tooltipStyles.popup, popupClassName)}
            style={{ left: rect.left, top: rect.top }}
          >
            {content}
          </span>,
          portalTarget ?? document.body
        )}
    </span>
  );
};

type TooltipRect = {
  left: number;
  top: number;
};

const getTooltipRect = (rect: DOMRect, placement: TooltipPlacement): TooltipRect  => {
  const gap = 8;
  const margin = 8;
  const estimatedWidth = 180;
  const estimatedHeight = 34;
  const raw =
    placement === "right"
      ? { left: rect.right + gap, top: rect.top + rect.height / 2 - estimatedHeight / 2 }
      : placement === "left"
      ? { left: rect.left - estimatedWidth - gap, top: rect.top + rect.height / 2 - estimatedHeight / 2 }
      : placement === "bottom"
      ? { left: rect.left + rect.width / 2 - estimatedWidth / 2, top: rect.bottom + gap }
      : { left: rect.left + rect.width / 2 - estimatedWidth / 2, top: rect.top - estimatedHeight - gap };

  return {
    left: Math.max(margin, Math.min(raw.left, window.innerWidth - estimatedWidth - margin)),
    top: Math.max(margin, Math.min(raw.top, window.innerHeight - estimatedHeight - margin))
  };
}

const tooltipStyles = {
  trigger: style({
    display: "inline-flex",
    minWidth: 0
  }),
  popup: style({
    background: color.text,
    borderRadius: radius.xs,
    boxShadow: "0 10px 28px rgba(25, 25, 25, 0.2)",
    color: color.surface,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.25,
    maxWidth: 180,
    padding: `${space[6]}px ${space[8]}px`,
    pointerEvents: "none",
    position: "fixed",
    zIndex: zIndex.tooltip
  })
};
