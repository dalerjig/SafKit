import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { classes, keyframes, style } from "typestyle";
import { Button } from "../Button";
import { CloseButton } from "../CloseButton";
import { color, palette, radius, shadow, space, zIndex } from "../../tokens";

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPlacement = "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";

export type ToastAction = {
  label: ReactNode;
  onClick: () => void;
};

export const DEFAULT_TOAST_WIDTH = 420;

export type ToastOptions = {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  duration?: number;
  /** Ширина карточки в px. Если не задана — берётся `ToastProvider.width`. */
  width?: number;
};

export type ToastItem = ToastOptions & {
  id: string;
  variant: ToastVariant;
};

export type ToastApi = {
  show: (variant: ToastVariant, options: ToastOptions | ReactNode) => string;
  info: (options: ToastOptions | ReactNode) => string;
  success: (options: ToastOptions | ReactNode) => string;
  warning: (options: ToastOptions | ReactNode) => string;
  error: (options: ToastOptions | ReactNode) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export type ToastProviderProps = {
  children: ReactNode;
  placement?: ToastPlacement;
  /** Отступ viewport от края (px): top-* — от верха, bottom-* — от низа. По умолчанию 20. */
  offset?: number;
  maxToasts?: number;
  defaultDuration?: number;
  /** Ширина toast в px. По умолчанию 420. */
  width?: number;
};

const ToastContext = createContext<ToastApi | null>(null);

const variantMeta: Record<ToastVariant, { marker: string; role: "status" | "alert"; label: string }> = {
  info: { marker: palette.darkGreen, role: "status", label: "i" },
  success: { marker: palette.babyGreen, role: "status", label: "✓" },
  warning: { marker: palette.orange, role: "alert", label: "!" },
  error: { marker: palette.red, role: "alert", label: "!" }
};

export const ToastProvider = ({
  children,
  placement = "top-right",
  offset = 20,
  maxToasts = 5,
  defaultDuration = 5000,
  width = DEFAULT_TOAST_WIDTH
}: ToastProviderProps) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current.clear();
    setItems([]);
  }, []);

  const show = useCallback(
    (variant: ToastVariant, options: ToastOptions | ReactNode) => {
      const normalized = normalizeToastOptions(options);
      const id = normalized.id ?? createToastId();
      const duration = normalized.duration ?? defaultDuration;

      setItems(current => {
        const next = [{ ...normalized, id, variant }, ...current.filter(item => item.id !== id)];
        return next.slice(0, maxToasts);
      });

      const existingTimeout = timeoutsRef.current.get(id);
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
        timeoutsRef.current.delete(id);
      }

      if (duration > 0) {
        const timeoutId = window.setTimeout(() => dismiss(id), duration);
        timeoutsRef.current.set(id, timeoutId);
      }

      return id;
    },
    [defaultDuration, dismiss, maxToasts]
  );

  useEffect(
    () => () => {
      timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    },
    []
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      info: options => show("info", options),
      success: options => show("success", options),
      warning: options => show("warning", options),
      error: options => show("error", options),
      dismiss,
      clear
    }),
    [clear, dismiss, show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport items={items} placement={placement} offset={offset} width={width} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error("useToast must be used inside ToastProvider.");
  }
  return api;
}

export const ToastViewport = ({
  items,
  placement = "top-right",
  offset = 20,
  width = DEFAULT_TOAST_WIDTH,
  onDismiss
}: {
  items: ToastItem[];
  placement?: ToastPlacement;
  offset?: number;
  width?: number;
  onDismiss: (id: string) => void;
}) => {
  if (items.length === 0) return null;

  const stackWidth = Math.max(width, ...items.map(item => item.width ?? 0));

  return (
    <div className={toastStyles.viewport(placement, offset, stackWidth)} aria-live="polite" aria-relevant="additions removals">
      {items.map(item => (
        <ToastCard key={item.id} item={item} defaultWidth={width} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastCard = ({
  item,
  defaultWidth,
  onDismiss
}: {
  item: ToastItem;
  defaultWidth: number;
  onDismiss: (id: string) => void;
}) => {
  const meta = variantMeta[item.variant];
  const cardWidth = item.width ?? defaultWidth;

  return (
    <div
      className={classes(toastStyles.card, toastStyles.variant(item.variant))}
      role={meta.role}
      style={{ width: cardWidth, maxWidth: "100%" }}
    >
      <span className={toastStyles.icon(meta.marker)} aria-hidden="true">
        {meta.label}
      </span>
      <div className={toastStyles.content}>
        {item.title && <strong>{item.title}</strong>}
        {item.description && <p>{item.description}</p>}
        {item.action && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              item.action?.onClick();
              onDismiss(item.id);
            }}
          >
            {item.action.label}
          </Button>
        )}
      </div>
      <CloseButton className={toastStyles.close} label="Закрыть уведомление" onClick={() => onDismiss(item.id)} />
    </div>
  );
};

const normalizeToastOptions = (options: ToastOptions | ReactNode): ToastOptions  => {
  if (isToastOptions(options)) {
    return options;
  }

  return { title: options };
}

const isToastOptions = (options: ToastOptions | ReactNode): options is ToastOptions  => {
  return (
    typeof options === "object" &&
    options !== null &&
    ("title" in options || "description" in options || "action" in options || "duration" in options || "id" in options || "width" in options)
  );
}

const createToastId = () => {
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const toastIn = keyframes({
  "0%": { opacity: 0, transform: "translate3d(0, -10px, 0) scale(0.98)" },
  "100%": { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }
});

const variantBackground: Record<ToastVariant, string> = {
  info: color.surface,
  success: color.surface,
  warning: color.surface,
  error: color.surface
};

const variantBorder: Record<ToastVariant, string> = {
  info: color.border,
  success: color.accent,
  warning: color.warning,
  error: color.danger
};

const toastStyles = {
  viewport: (placement: ToastPlacement, offset: number, width: number) =>
    style({
      display: "grid",
      gap: space[10],
      justifyItems: placement.endsWith("left") ? "start" : placement.endsWith("center") ? "center" : "end",
      left: placement.endsWith("left") ? offset : placement.endsWith("center") ? "50%" : undefined,
      pointerEvents: "none",
      position: "fixed",
      right: placement.endsWith("right") ? offset : undefined,
      top: placement.startsWith("top") ? offset : undefined,
      bottom: placement.startsWith("bottom") ? offset : undefined,
      transform: placement.endsWith("center") ? "translateX(-50%)" : undefined,
      width: `min(${width}px, calc(100vw - ${offset * 2}px))`,
      zIndex: zIndex.toast
    }),
  card: style({
    alignItems: "flex-start",
    animation: `${toastIn} 180ms cubic-bezier(0.16, 1, 0.3, 1)`,
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    boxShadow: shadow.panel,
    boxSizing: "border-box",
    color: color.text,
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "28px minmax(0, 1fr) 32px",
    minWidth: 0,
    padding: space[12],
    pointerEvents: "auto",
    transformOrigin: "top right"
  }),
  variant: (variant: ToastVariant) =>
    style({
      background: variantBackground[variant],
      borderColor: variantBorder[variant]
    }),
  icon: (marker: string) =>
    style({
      alignItems: "center",
      background: marker,
      borderRadius: radius.round,
      color: marker === palette.babyGreen ? color.primary : color.surface,
      display: "inline-flex",
      fontSize: 14,
      fontWeight: 900,
      height: 28,
      justifyContent: "center",
      lineHeight: 1,
      width: 28
    }),
  content: style({
    display: "grid",
    gap: space[6],
    minWidth: 0,
    paddingTop: 2,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 14,
        fontWeight: 900,
        lineHeight: 1.25,
        overflowWrap: "anywhere"
      },
      "& p": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.4,
        margin: 0,
        overflowWrap: "anywhere"
      }
    }
  }),
  close: style({
    marginTop: -2
  })
};
