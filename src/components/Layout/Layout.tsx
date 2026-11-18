import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { classes, media, style } from "typestyle";
import { MOBILE_HEADER_HEIGHT, RESPONSIVE_BREAKPOINTS, color, shadow, zIndex } from "../../tokens";

export type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export type LayoutRegionProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type LayoutContentProps = LayoutRegionProps;

export type LayoutFitContentProps = LayoutRegionProps & {
  padding?: number;
  minWidth?: number;
};

export type LayoutRightPanelProps = LayoutRegionProps & {
  open?: boolean;
  width?: number | string;
};

const LAYOUT_OBSTACLE_EDGE_TOLERANCE = 1;

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={classes(layoutStyles.root, className)} data-shkit-layout-root>
      {children}
    </div>
  );
}

export const LayoutSidebar = ({ children, className, style }: LayoutRegionProps) => {
  return (
    <div className={classes(layoutStyles.sidebar, className)} style={style}>
      {children}
    </div>
  );
}

export const LayoutHeader = ({ children, className, style }: LayoutRegionProps) => {
  return (
    <div className={classes(layoutStyles.header, className)} style={style}>
      {children}
    </div>
  );
}

export const LayoutContent = ({ children, className, style }: LayoutContentProps) => {
  return (
    <main className={classes(layoutStyles.content, className)} style={style}>
      {children}
    </main>
  );
}

export const LayoutFitContent = ({
  children,
  className,
  minWidth = 280,
  padding = 50,
  style
}: LayoutFitContentProps) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ height: 0, left: 0, top: 0, width: 0 });

  useLayoutEffect(() => {
    const updateBounds = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const root = anchor.closest("[data-shkit-layout-root]");
      const content = anchor.parentElement;
      if (!content) return;

      const contentRect = content.getBoundingClientRect();
      let availableLeft = contentRect.left;
      let availableTop = contentRect.top;
      let availableRight = contentRect.right;
      let availableBottom = contentRect.bottom;

      root?.querySelectorAll<HTMLElement>("[data-shkit-layout-obstacle]").forEach(obstacle => {
        if (obstacle.contains(anchor)) return;

        const obstacleRect = obstacle.getBoundingClientRect();
        const side = obstacle.dataset.shkitLayoutObstacle;
        const overlapsVertically = obstacleRect.bottom > contentRect.top && obstacleRect.top < contentRect.bottom;
        const overlapsHorizontally = obstacleRect.right > contentRect.left && obstacleRect.left < contentRect.right;

        if (side === "left" && overlapsVertically && obstacleRect.left <= contentRect.left + LAYOUT_OBSTACLE_EDGE_TOLERANCE) {
          availableLeft = Math.max(availableLeft, Math.min(obstacleRect.right, contentRect.right));
        }

        if (side === "right" && overlapsVertically && obstacleRect.right >= contentRect.right - LAYOUT_OBSTACLE_EDGE_TOLERANCE) {
          availableRight = Math.min(availableRight, Math.max(obstacleRect.left, contentRect.left));
        }

        if (side === "top" && overlapsHorizontally && obstacleRect.top <= contentRect.top + LAYOUT_OBSTACLE_EDGE_TOLERANCE) {
          availableTop = Math.max(availableTop, Math.min(obstacleRect.bottom, contentRect.bottom));
        }

        if (side === "bottom" && overlapsHorizontally && obstacleRect.bottom >= contentRect.bottom - LAYOUT_OBSTACLE_EDGE_TOLERANCE) {
          availableBottom = Math.min(availableBottom, Math.max(obstacleRect.top, contentRect.top));
        }
      });

      const left = Math.max(0, availableLeft - contentRect.left);
      const top = Math.max(0, availableTop - contentRect.top);
      const width = Math.max(minWidth, availableRight - availableLeft - padding);
      const height = Math.max(0, availableBottom - availableTop - padding);

      setBounds(current =>
        current.left === left && current.top === top && current.width === width && current.height === height
          ? current
          : { height, left, top, width }
      );
    };

    updateBounds();
    const transitionTimer = window.setTimeout(updateBounds, 340);
    const lateTimer = window.setTimeout(updateBounds, 680);
    const resizeObserver = new ResizeObserver(updateBounds);
    const root = anchorRef.current?.closest("[data-shkit-layout-root]");
    const content = anchorRef.current?.parentElement;
    const mutationObserver = new MutationObserver(() => {
      updateBounds();
      window.setTimeout(updateBounds, 340);
    });

    if (root) resizeObserver.observe(root);
    if (content) resizeObserver.observe(content);
    root?.querySelectorAll<HTMLElement>("[data-shkit-layout-obstacle]").forEach(obstacle => resizeObserver.observe(obstacle));
    if (root) {
      mutationObserver.observe(root, {
        attributeFilter: ["class", "data-shkit-layout-obstacle", "style"],
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    window.addEventListener("resize", updateBounds);

    return () => {
      window.clearTimeout(transitionTimer);
      window.clearTimeout(lateTimer);
      window.removeEventListener("resize", updateBounds);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [minWidth, padding]);

  return (
    <div ref={anchorRef} className={layoutStyles.fitAnchor}>
      <div
        className={classes(layoutStyles.fitContentBox, className)}
        style={{ height: bounds.height, left: bounds.left, top: bounds.top, width: bounds.width, ...style }}
      >
        {children}
      </div>
    </div>
  );
}

export const LayoutRightPanel = ({ children, className, open = true, width = 360, style }: LayoutRightPanelProps) => {
  return (
    <aside
      data-shkit-layout-obstacle="right"
      className={classes(layoutStyles.rightPanel, !open && layoutStyles.rightPanelClosed, className)}
      style={{ ...style, width: open ? width : 0 }}
    >
      {open && children}
    </aside>
  );
}

const layoutStyles = {
  root: style(
    {
      background: color.surface,
      display: "grid",
      gridTemplateAreas: `
        "sidebar header header"
        "sidebar content right"
      `,
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
      gridTemplateRows: "auto minmax(0, 1fr)",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      overflow: "hidden",
      position: "relative"
    },
    media(
      { maxWidth: RESPONSIVE_BREAKPOINTS.M },
      {
        gridTemplateAreas: `
          "sidebar header"
          "content content"
        `,
        gridTemplateColumns: "auto minmax(0, 1fr)",
        gridTemplateRows: `${MOBILE_HEADER_HEIGHT}px minmax(0, 1fr)`
      }
    )
  ),
  sidebar: style({
    gridArea: "sidebar",
    minHeight: 0,
    minWidth: 0
  },
  media(
    { maxWidth: RESPONSIVE_BREAKPOINTS.M },
    {
      gridColumn: "1 / 2",
      gridRow: "1 / -1",
      pointerEvents: "none",
      position: "relative",
      zIndex: zIndex.rightPanel
    }
  )),
  header: style({
    gridArea: "header",
    minWidth: 0,
    zIndex: zIndex.layoutHeader
  }),
  content: style({
    gridArea: "content",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    position: "relative"
  }),
  fitAnchor: style({
    height: 0,
    pointerEvents: "none",
    position: "absolute",
    width: 0
  }),
  fitContentBox: style({
    boxSizing: "border-box",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    $nest: {
      "& > *": {
        pointerEvents: "auto"
      },
      "& [data-shkit-layout-pass-through]": {
        pointerEvents: "none"
      },
      "& [data-shkit-layout-interactive]": {
        pointerEvents: "auto"
      }
    }
  }),
  rightPanel: style(
    {
      background: color.surface,
      borderLeft: `1px solid ${color.border}`,
      boxShadow: "-10px 0 26px rgba(25, 25, 25, 0.08)",
      gridArea: "right",
      minHeight: 0,
      minWidth: 0,
      overflow: "auto",
      transition: "width 0.24s ease",
      zIndex: zIndex.layoutSidebar
    },
    media(
      { maxWidth: RESPONSIVE_BREAKPOINTS.M },
      {
        bottom: 0,
        boxShadow: shadow.panel,
        maxWidth: "calc(100vw - 44px)",
        position: "absolute",
        right: 0,
        top: MOBILE_HEADER_HEIGHT,
        zIndex: zIndex.layoutOverlay
      }
    )
  ),
  rightPanelClosed: style({
    borderLeft: 0,
    boxShadow: "none",
    overflow: "hidden"
  })
};
