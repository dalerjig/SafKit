import { type ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { classes, style } from "typestyle";
import { color, radius, shadow, shkitDialogIn, shkitOverlayIn, space, zIndex } from "../../tokens";
import { useShKitPortalTarget } from "../../provider";
import { CloseButton } from "../CloseButton";

export type ModalProps = {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  /** compact: ширина 360px и внутренние отступы 12px. */
  size?: "default" | "compact";
  width?: number | string;
  className?: string;
  overlayClassName?: string;
  bodyClassName?: string;
  onClose?: () => void;
};

export const Modal = ({ open, title, children, headerActions, footer, size = "default", width, className, overlayClassName, bodyClassName, onClose }: ModalProps) => {
  const portalTarget = useShKitPortalTarget();
  const dialogRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => {
      const [firstFocusable] = getFocusableElements(dialogRef.current);
      (firstFocusable ?? dialogRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={classes(modalStyles.overlay, overlayClassName)} role="presentation" onPointerDown={onClose}>
      <section
        ref={dialogRef}
        aria-labelledby={title ? titleId : undefined}
        className={classes(modalStyles.dialog, className)}
        role="dialog"
        aria-modal="true"
        style={{ width: formatModalWidth(width ?? (size === "compact" ? 360 : 520)) }}
        tabIndex={-1}
        onPointerDown={event => event.stopPropagation()}
      >
        {(title || headerActions || onClose) && (
          <header className={classes(modalStyles.header, size === "compact" && modalStyles.compactPadding)}>
            {title && <h3 id={titleId}>{title}</h3>}
            {headerActions && <span className={modalStyles.headerActions}>{headerActions}</span>}
            {onClose && <CloseButton className={modalStyles.close} onClick={onClose} />}
          </header>
        )}
        <div className={classes(modalStyles.body, size === "compact" && modalStyles.compactPadding, bodyClassName)}>{children}</div>
        {footer && <footer className={classes(modalStyles.footer, size === "compact" && modalStyles.compactPadding)}>{footer}</footer>}
      </section>
    </div>,
    portalTarget ?? document.body
  );
}

const formatModalWidth = (width: number | string) => {
  return typeof width === "number" ? `min(100%, ${width}px)` : width;
}

const getFocusableElements = (root: HTMLElement | null) => {
  if (!root) return [];

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",")
    )
  ).filter(element => !element.hasAttribute("disabled") && element.offsetParent !== null);
}

const modalStyles = {
  overlay: style({
    alignItems: "center",
    animationDuration: "140ms",
    animationName: shkitOverlayIn,
    animationTimingFunction: "ease",
    background: "rgba(25, 25, 25, 0.32)",
    boxSizing: "border-box",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    padding: space[24],
    position: "fixed",
    zIndex: zIndex.modal
  }),
  dialog: style({
    animationDuration: "180ms",
    animationName: shkitDialogIn,
    animationTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.lg,
    boxShadow: shadow.panel,
    boxSizing: "border-box",
    color: color.text,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto",
    maxHeight: "calc(100vh - 48px)",
    maxWidth: "100%",
    overflow: "hidden",
    width: "min(100%, 520px)"
  }),
  header: style({
    alignItems: "center",
    display: "flex",
    gap: space[12],
    justifyContent: "space-between",
    padding: `${space[18]}px ${space[20]}px ${space[10]}px`,
    $nest: {
      "& h3": {
        flex: "1 1 auto",
        fontSize: 24,
        lineHeight: 1.1,
        margin: 0,
        minWidth: 0
      }
    }
  }),
  compactPadding: style({
    $nest: {
      "&&": { padding: space[12] }
    }
  }),
  headerActions: style({
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    gap: space[6],
    marginLeft: "auto"
  }),
  close: style({
    marginLeft: "auto"
  }),
  body: style({
    minHeight: 0,
    overflow: "auto",
    padding: `${space[12]}px ${space[20]}px ${space[20]}px`
  }),
  footer: style({
    borderTop: `1px solid ${color.border}`,
    display: "flex",
    gap: space[8],
    justifyContent: "flex-end",
    padding: `${space[14]}px ${space[20]}px`
  })
};
