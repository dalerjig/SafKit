import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { classes, style } from "typestyle";
import { useShKitPortalTarget } from "../../provider";
import { zIndex } from "../../tokens";

export type DropdownAlign = "start" | "end";

export type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  /** start — левый край панели у левого края триггера; end — правый у правого (панель влево). */
  align?: DropdownAlign;
  /** Доп. сдвиг панели в px после привязки к триггеру; положительный — вправо / вниз. */
  offsetX?: number;
  offsetY?: number;
  /** Ширина панели = ширина триггера (без расширения под контент и min 160px). */
  matchTriggerWidth?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const Dropdown = ({
  trigger,
  children,
  align = "start",
  offsetX = 0,
  offsetY = 0,
  matchTriggerWidth = false,
  open,
  onOpenChange,
  className
}: DropdownProps) => {
  const portalTarget = useShKitPortalTarget();
  const [internalOpen, setInternalOpen] = useState(false);
  const [popupRect, setPopupRect] = useState<DropdownPopupRect | null>(null);
  const [positioned, setPositioned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isOpen = open ?? internalOpen;

  const setOpen = useCallback((nextOpen: boolean) => {
    if (nextOpen && !isOpen && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }

    setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      setPositioned(false);
      setPopupRect(null);
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        target instanceof Element &&
        target.closest("[data-shkit-portal]")
      ) {
        return;
      }
      if (!rootRef.current?.contains(target) && !contentRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        previousFocusRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setPositioned(false);

    const updatePopupRect = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPopupRect(getFloatingRect(rect, contentRef.current?.offsetWidth, align, offsetX, offsetY, matchTriggerWidth));
    };

    updatePopupRect();
    window.addEventListener("resize", updatePopupRect);
    window.addEventListener("scroll", updatePopupRect, true);
    return () => {
      window.removeEventListener("resize", updatePopupRect);
      window.removeEventListener("scroll", updatePopupRect, true);
    };
  }, [align, isOpen, matchTriggerWidth, offsetX, offsetY]);

  useLayoutEffect(() => {
    if (!isOpen || !popupRect) return;

    const rect = triggerRef.current?.getBoundingClientRect();
    const contentWidth = contentRef.current?.offsetWidth;
    if (!rect || !contentWidth) return;

    const nextRect = getFloatingRect(rect, contentWidth, align, offsetX, offsetY, matchTriggerWidth);
    if (
      nextRect.left !== popupRect.left ||
      nextRect.maxWidth !== popupRect.maxWidth ||
      nextRect.top !== popupRect.top ||
      nextRect.bottom !== popupRect.bottom
    ) {
      setPopupRect(nextRect);
      return;
    }

    setPositioned(true);
  }, [align, isOpen, matchTriggerWidth, offsetX, offsetY, popupRect, children]);

  return (
    <div ref={rootRef} className={classes(dropdownStyles.root, className)}>
      <div ref={triggerRef} onClick={() => setOpen(!isOpen)}>{trigger}</div>
      {isOpen &&
        popupRect &&
        createPortal(
          <div
            ref={contentRef}
            data-shkit-portal
            className={classes(
              dropdownStyles.content,
              popupRect.placeBelow
                ? align === "end"
                  ? dropdownStyles.contentBelowEnd
                  : dropdownStyles.contentBelow
                : align === "end"
                  ? dropdownStyles.contentAboveEnd
                  : dropdownStyles.contentAbove,
              positioned && dropdownStyles.contentVisible
            )}
            style={{
              bottom: popupRect.bottom,
              left: popupRect.left,
              maxHeight: popupRect.maxHeight,
              maxWidth: popupRect.maxWidth,
              minWidth: matchTriggerWidth ? undefined : popupRect.width,
              top: popupRect.top,
              width: matchTriggerWidth ? popupRect.width : undefined
            }}
          >
            {children}
          </div>,
          portalTarget ?? document.body
        )}
    </div>
  );
}

type DropdownPopupRect = {
  bottom?: number;
  left: number;
  maxHeight: number;
  maxWidth: number;
  placeBelow: boolean;
  top?: number;
  width: number;
};

const getFloatingRect = (
  rect: DOMRect,
  contentWidth: number | undefined,
  align: DropdownAlign,
  offsetX: number,
  offsetY: number,
  matchTriggerWidth: boolean
): DropdownPopupRect => {
  const margin = 12;
  const gap = 6;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const availableBelow = viewportHeight - rect.bottom - gap - margin;
  const availableAbove = rect.top - gap - margin;
  const placeBelow = availableBelow >= Math.min(320, availableAbove);
  const viewportMaxWidth = Math.max(viewportWidth - margin * 2, 160);
  const triggerWidth = Math.max(rect.width, 1);
  const width = matchTriggerWidth
    ? Math.min(triggerWidth, viewportMaxWidth)
    : Math.min(Math.max(rect.width, 160), viewportMaxWidth);
  const measuredWidth = matchTriggerWidth
    ? width
    : Math.min(contentWidth ?? width, viewportMaxWidth);
  const unclampedLeft = align === "end" ? rect.right - measuredWidth : rect.left;
  const left = Math.min(
    Math.max(unclampedLeft + offsetX, margin),
    viewportWidth - measuredWidth - margin
  );

  return {
    bottom: placeBelow ? undefined : viewportHeight - rect.top + gap - offsetY,
    left,
    maxHeight: Math.max(placeBelow ? availableBelow : availableAbove, 120),
    maxWidth: matchTriggerWidth ? width : viewportMaxWidth,
    placeBelow,
    top: placeBelow ? rect.bottom + gap + offsetY : undefined,
    width
  };
}

const dropdownStyles = {
  root: style({
    display: "inline-flex",
    position: "relative"
  }),
  content: style({
    left: 0,
    opacity: 0,
    overflow: "auto",
    position: "fixed",
    transform: "translateY(-6px) scale(0.98)",
    transition: "opacity 150ms ease, transform 190ms cubic-bezier(0.2, 0, 0, 1)",
    visibility: "hidden",
    willChange: "opacity, transform",
    zIndex: zIndex.dropdown
  }),
  contentBelow: style({
    transformOrigin: "top left"
  }),
  contentBelowEnd: style({
    transformOrigin: "top right"
  }),
  contentAbove: style({
    transform: "translateY(6px) scale(0.98)",
    transformOrigin: "bottom left"
  }),
  contentAboveEnd: style({
    transform: "translateY(6px) scale(0.98)",
    transformOrigin: "bottom right"
  }),
  contentVisible: style({
    opacity: 1,
    transform: "translateY(0) scale(1)",
    visibility: "visible"
  })
};
