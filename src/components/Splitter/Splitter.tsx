import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import { classes, style } from "typestyle";
import { color, radius } from "../../tokens";

export type SplitterLayout = "horizontal" | "vertical";

export type SplitterPanelProps = {
  children: ReactNode;
  className?: string;
  defaultSize?: number | string;
  max?: number | string;
  min?: number | string;
  resizable?: boolean;
  size?: number | string;
};

export type SplitterProps = {
  children: ReactNode;
  className?: string;
  layout?: SplitterLayout;
  /** Shorthand for layout="vertical", like antd Slider/Splitter ergonomics. */
  vertical?: boolean;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  style?: CSSProperties;
};

type NormalizedPanel = {
  className?: string;
  content: ReactNode;
  defaultSize?: number | string;
  key: string;
  max?: number | string;
  min?: number | string;
  resizable: boolean;
  size?: number | string;
};

const HANDLE_SIZE = 6;

const SplitterPanel = (_props: SplitterPanelProps) => {
  return null;
};

const parsePanelElement = (child: ReactNode, index: number): NormalizedPanel => {
  if (isValidElement(child) && child.type === SplitterPanel) {
    const props = child.props as SplitterPanelProps;

    return {
      key: `panel-${index}`,
      content: props.children,
      className: props.className,
      defaultSize: props.defaultSize,
      min: props.min,
      max: props.max,
      resizable: props.resizable ?? true,
      size: props.size
    };
  }

  return {
    key: `panel-${index}`,
    content: child,
    resizable: true
  };
};

const parseBound = (value: number | string | undefined, containerSize: number, fallbackRatio: number) => {
  if (value === undefined) return fallbackRatio;

  if (typeof value === "string" && value.endsWith("%")) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed / 100 : fallbackRatio;
  }

  if (typeof value === "number" && containerSize > 0) {
    return value / containerSize;
  }

  return fallbackRatio;
};

const normalizeRatios = (ratios: number[]) => {
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0) || 1;
  return ratios.map(ratio => Math.max(ratio, 0) / total);
};

const buildInitialRatios = (panels: NormalizedPanel[], containerSize: number) => {
  const availableSize = Math.max(containerSize - HANDLE_SIZE * Math.max(panels.length - 1, 0), 1);
  const explicit = panels.map(panel => {
    if (panel.defaultSize === undefined) return null;
    return parseBound(panel.defaultSize, availableSize, 0);
  });

  if (explicit.some(value => value !== null)) {
    const specifiedTotal = explicit.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const unspecifiedCount = explicit.filter(value => value === null).length;
    const remainder = Math.max(1 - specifiedTotal, 0);
    const fallback = unspecifiedCount > 0 ? remainder / unspecifiedCount : 0;

    return normalizeRatios(
      explicit.map(value => (value === null ? fallback : value))
    );
  }

  return normalizeRatios(panels.map(() => 1 / panels.length));
};

const SplitterRoot = ({
  children,
  className,
  layout,
  vertical = false,
  onResize,
  onResizeEnd,
  style: inlineStyle
}: SplitterProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const ratiosRef = useRef<number[]>([]);
  const [containerSize, setContainerSize] = useState(0);
  const [ratios, setRatios] = useState<number[]>([]);
  const [activeHandle, setActiveHandle] = useState<number | null>(null);

  const panels = useMemo(
    () => Children.toArray(children).map((child, index) => parsePanelElement(child, index)),
    [children]
  );

  const resolvedLayout: SplitterLayout = layout ?? (vertical ? "vertical" : "horizontal");
  const isHorizontal = resolvedLayout === "horizontal";

  useLayoutEffect(() => {
    ratiosRef.current = ratios;
  }, [ratios]);

  useLayoutEffect(() => {
    if (panels.length === 0) return;
    if (containerSize <= 0) return;

    setRatios(previous => {
      if (previous.length === panels.length) return previous;
      return buildInitialRatios(panels, containerSize);
    });
  }, [containerSize, panels]);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setContainerSize(isHorizontal ? rect.width : rect.height);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [isHorizontal]);

  useLayoutEffect(() => {
    if (containerSize <= 0 || panels.length === 0) return;

    const controlled = panels.some(panel => panel.size !== undefined);
    if (!controlled) return;

    const availableSize = Math.max(containerSize - HANDLE_SIZE * Math.max(panels.length - 1, 0), 1);
    setRatios(
      normalizeRatios(
        panels.map(panel => parseBound(panel.size ?? panel.defaultSize, availableSize, 1 / panels.length))
      )
    );
  }, [containerSize, panels]);

  const availableSize = Math.max(containerSize - HANDLE_SIZE * Math.max(panels.length - 1, 0), 0);
  const pixelSizes = ratios.map(ratio => ratio * availableSize);

  const emitSizes = useCallback(
    (nextRatios: number[]) => onResize?.(nextRatios.map(ratio => ratio * availableSize)),
    [availableSize, onResize]
  );

  const startResize = useCallback(
    (handleIndex: number) => {
      const element = rootRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const startRatios = [...ratiosRef.current];
      const leftPanel = panels[handleIndex];
      const rightPanel = panels[handleIndex + 1];

      if (!leftPanel?.resizable || !rightPanel?.resizable) return;

      setActiveHandle(handleIndex);
      document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      const getPointer = (event: PointerEvent) => (isHorizontal ? event.clientX : event.clientY);
      const getOrigin = () => (isHorizontal ? rect.left : rect.top);
      const getTotal = () => (isHorizontal ? rect.width : rect.height);

      const handlePointerMove = (event: PointerEvent) => {
        const total = getTotal();
        const available = Math.max(total - HANDLE_SIZE * Math.max(panels.length - 1, 0), 1);
        const pointer = getPointer(event) - getOrigin();
        const beforePx =
          startRatios.slice(0, handleIndex).reduce((sum, ratio) => sum + ratio, 0) * available +
          HANDLE_SIZE * handleIndex;

        const minLeft = parseBound(leftPanel.min, available, 0.08);
        const maxLeft = parseBound(leftPanel.max, available, 0.92);
        const combined = startRatios[handleIndex] + startRatios[handleIndex + 1];

        let nextLeft = (pointer - beforePx) / available;
        nextLeft = Math.min(Math.max(nextLeft, minLeft), Math.min(maxLeft, combined - 0.08));

        const nextRatios = [...startRatios];
        nextRatios[handleIndex] = nextLeft;
        nextRatios[handleIndex + 1] = combined - nextLeft;

        setRatios(nextRatios);
        emitSizes(nextRatios);
      };

      const stopResize = () => {
        setActiveHandle(null);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", stopResize);
        onResizeEnd?.(ratiosRef.current.map(ratio => ratio * availableSize));
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", stopResize);
    },
    [availableSize, emitSizes, isHorizontal, onResizeEnd, panels]
  );

  if (panels.length === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={classes(
        splitterStyles.root,
        isHorizontal ? splitterStyles.horizontal : splitterStyles.vertical,
        activeHandle !== null && splitterStyles.resizing,
        className
      )}
      style={inlineStyle}
    >
      {panels.map((panel, index) => {
        const size = pixelSizes[index];
        const panelStyle: CSSProperties = isHorizontal
          ? { flex: `0 0 ${size}px`, width: `${size}px` }
          : { flex: `0 0 ${size}px`, height: `${size}px` };

        return (
          <Fragment key={panel.key}>
            <div className={classes(splitterStyles.panel, panel.className)} style={panelStyle}>
              {panel.content}
            </div>
            {index < panels.length - 1 && (
              <div
                className={classes(
                  splitterStyles.handle,
                  isHorizontal ? splitterStyles.handleHorizontal : splitterStyles.handleVertical,
                  (!panel.resizable || !panels[index + 1]?.resizable) && splitterStyles.handleDisabled,
                  activeHandle === index && splitterStyles.handleActive
                )}
                onPointerDown={event => {
                  event.preventDefault();
                  startResize(index);
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export const Splitter = Object.assign(SplitterRoot, {
  Panel: SplitterPanel
});

const splitterStyles = {
  root: style({
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    width: "100%"
  }),
  horizontal: style({
    flexDirection: "row"
  }),
  vertical: style({
    flexDirection: "column"
  }),
  resizing: style({
    $nest: {
      "& *": {
        userSelect: "none"
      }
    }
  }),
  panel: style({
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden"
  }),
  handle: style({
    background: color.border,
    flexShrink: 0,
    position: "relative",
    touchAction: "none",
    transition: "background 0.16s ease",
    $nest: {
      "&::after": {
        background: color.primary,
        borderRadius: radius.round,
        content: '""',
        opacity: 0,
        position: "absolute",
        transition: "opacity 0.16s ease"
      },
      "&:hover": {
        background: color.borderStrong
      },
      "&:hover::after": {
        opacity: 0.35
      }
    }
  }),
  handleHorizontal: style({
    cursor: "col-resize",
    width: HANDLE_SIZE,
    $nest: {
      "&::after": {
        height: 36,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 2
      }
    }
  }),
  handleVertical: style({
    cursor: "row-resize",
    height: HANDLE_SIZE,
    $nest: {
      "&::after": {
        height: 2,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 36
      }
    }
  }),
  handleActive: style({
    background: color.primary,
    $nest: {
      "&::after": {
        opacity: 0.8
      }
    }
  }),
  handleDisabled: style({
    cursor: "default",
    opacity: 0.35,
    pointerEvents: "none"
  })
};
