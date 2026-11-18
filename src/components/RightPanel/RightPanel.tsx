import { type ComponentType, type ReactNode, useEffect, useState } from "react";
import { classes, media, style } from "typestyle";
import {
  MOBILE_COLLAPSED_WIDTH,
  RESPONSIVE_BREAKPOINTS,
  color,
  space,
  zIndex,
} from "../../tokens";
import { useResponsive } from "../../hooks";
import { CloseButton } from "../CloseButton";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

export const RIGHT_PANEL_DEFAULT_WIDTH = 300;

export type RightPanelTab = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon: ComponentType<{ className?: string; size?: number }>;
  toolbar?: ReactNode;
  width?: number;
  maxWidth?: number;
  confirmClose?: boolean;
};

export type RightPanelProps = {
  tabs: RightPanelTab[];
  activeId?: string | null;
  open?: boolean;
  expanded?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  headerOffset?: number;
  mobileHeaderOffset?: number;
  className?: string;
  onActiveChange?: (id: string | null, tab: RightPanelTab | null) => void;
  onWidthChange?: (width: number, tab: RightPanelTab | null) => void;
  onOpenChange?: (open: boolean) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onCloseAll?: () => void;
};

export const RightPanel = ({
  tabs,
  activeId,
  open = tabs.length > 0,
  expanded = false,
  defaultWidth = RIGHT_PANEL_DEFAULT_WIDTH,
  minWidth = 250,
  maxWidth = 900,
  headerOffset = 72,
  mobileHeaderOffset = 56,
  className,
  onActiveChange,
  onWidthChange,
  onOpenChange,
  onExpandedChange,
  onCloseAll,
}: RightPanelProps) => {
  const { isMobile } = useResponsive();
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0] ?? null;
  const isOpen = open && Boolean(activeTab);
  const panelWidth = isOpen
    ? `min(${width}px, calc(100vw - ${MOBILE_COLLAPSED_WIDTH}px))`
    : 0;

  useEffect(() => {
    if (activeTab?.width) {
      setWidth(activeTab.width);
    } else {
      setWidth(defaultWidth);
    }
  }, [activeTab?.id, activeTab?.width, defaultWidth]);

  const startResize = (event: React.MouseEvent) => {
    if (isMobile) return;
    event.preventDefault();
    event.stopPropagation();
    const nextMaxWidth = activeTab?.maxWidth ?? maxWidth;
    const resizeTab = activeTab ?? null;
    let currentWidth = width;
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth =
        document.documentElement.clientWidth - moveEvent.clientX;
      const nextPanelWidth = Math.max(minWidth, Math.min(nextWidth, nextMaxWidth));
      if (nextPanelWidth === currentWidth) return;
      currentWidth = nextPanelWidth;
      setWidth(nextPanelWidth);
      onWidthChange?.(nextPanelWidth, resizeTab);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const selectTab = (tab: RightPanelTab) => {
    if (tab.id === activeTab?.id) {
      onOpenChange?.(!isOpen);
    } else {
      onActiveChange?.(tab.id, tab);
      onOpenChange?.(true);
    }
  };

  const closeAll = () => {
    onCloseAll?.();
    onOpenChange?.(false);
    onActiveChange?.(null, null);
  };

  return (
    <aside
      data-shkit-layout-obstacle="right"
      className={classes(
        "right-panel-container",
        rightPanelStyles.root(headerOffset, mobileHeaderOffset),
        isResizing && rightPanelStyles.resizing,
        className,
      )}
      style={{ width: panelWidth }}
    >
      <div
        className={rightPanelStyles.container}
        style={{
          width: isOpen ? "100%" : 0,
          overflow: isOpen ? undefined : "hidden",
        }}
      >
        {activeTab && (
          <>
            <header className={rightPanelStyles.title}>
              <CloseButton onClick={closeAll} />
              <strong>{activeTab.title}</strong>
              {onExpandedChange && (
                <Tooltip
                  content={expanded ? "Свернуть" : "Развернуть"}
                  placement="bottom"
                  className={rightPanelStyles.expandButton}
                >
                  <Button
                    type="button"
                    square
                    size="sm"
                    variant="ghost"
                    aria-label={expanded ? "Свернуть" : "Развернуть"}
                    aria-pressed={expanded}
                    icon={<Icon name={expanded ? "fullscreen-exit" : "fullscreen"} size={18} />}
                    onClick={() => onExpandedChange(!expanded)}
                  />
                </Tooltip>
              )}
            </header>
            <div className={rightPanelStyles.content}>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  style={{
                    display: tab.id === activeTab.id ? "block" : "none",
                  }}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!isMobile &&
        tabs.map((tab, index) => {
          const TabIcon = tab.icon;
          const selected = tab.id === activeTab?.id;
          return (
            <Tooltip key={tab.id} content={tab.title} placement="left">
              <button
                type="button"
                className={classes(
                  rightPanelStyles.tab,
                  selected && rightPanelStyles.activeTab,
                )}
                style={{ top: index * 40 }}
                onClick={() => selectTab(tab)}
              >
                <TabIcon className={rightPanelStyles.tabIcon} size={18} />
              </button>
            </Tooltip>
          );
        })}

      {!isMobile && isOpen && activeTab?.toolbar && (
        <div
          className={rightPanelStyles.toolRail}
          style={{ top: tabs.length * 40 + 8 }}
        >
          {activeTab.toolbar}
        </div>
      )}

      {isOpen && (
        <div
          className={rightPanelStyles.resizeMarker}
          onMouseDown={startResize}
        />
      )}

      {isMobile && isOpen && activeTab?.toolbar && (
        <div className={rightPanelStyles.mobileToolBar}>
          {activeTab.toolbar}
        </div>
      )}

      {isMobile && (
        <div className={rightPanelStyles.mobileTabBar}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const selected = tab.id === activeTab?.id;
            return (
              <Tooltip key={tab.id} content={tab.title} placement="top">
                <button
                  type="button"
                  className={classes(
                    rightPanelStyles.mobileTab,
                    selected && rightPanelStyles.mobileTabActive,
                  )}
                  onClick={() => selectTab(tab)}
                >
                  <TabIcon className={rightPanelStyles.tabIcon} size={18} />
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}
    </aside>
  );
};

const rightPanelStyles = {
  root: (headerOffset: number, mobileHeaderOffset: number) =>
    style(
      {
        background: color.surface,
        borderLeft: `1px solid ${color.border}`,
        bottom: 0,
        boxShadow: "-14px 0 32px rgba(25, 25, 25, 0.14)",
        color: color.text,
        pointerEvents: "none",
        position: "absolute",
        right: 0,
        top: headerOffset,
        transition: "width 0.3s ease",
        zIndex: zIndex.rightPanel,
      },
      media(
        { maxWidth: RESPONSIVE_BREAKPOINTS.S },
        {
          top: mobileHeaderOffset,
        },
      ),
    ),
  resizing: style({
    transition: "none",
  }),
  container: style({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: 0,
    pointerEvents: "auto",
  }),
  title: style({
    alignItems: "center",
    borderBottom: `1px solid ${color.border}`,
    display: "flex",
    gap: space[8],
    minHeight: 52,
    padding: `${space[8]}px ${space[10]}px`,
    $nest: {
      "& strong": {
        fontSize: 16,
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  }),
  expandButton: style({
    marginLeft: "auto",
    flexShrink: 0,
  }),
  content: style({
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    padding: space[10],
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        paddingBottom: 104,
      },
    },
  }),
  tab: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.border}`,
    color: color.textMuted,
    cursor: "pointer",
    display: "flex",
    height: 40,
    justifyContent: "center",
    left: -40,
    padding: 4,
    pointerEvents: "auto",
    position: "absolute",
    transition: "background 0.2s ease, color 0.2s ease",
    width: 40,
    $nest: {
      "&:hover": {
        background: color.surfaceSecondary,
        color: color.primary,
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        height: 42,
        left: -42,
        width: 42,
      },
    },
  }),
  activeTab: style({
    background: color.accent,
    color: "#103E36",
    $nest: {
      "&:hover": {
        background: color.accent,
      },
    },
  }),
  tabIcon: style({
    color: "currentColor",
  }),
  toolRail: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: "8px 0 0 8px",
    boxShadow: "-10px 10px 24px rgba(25, 25, 25, 0.14)",
    display: "grid",
    gap: space[6],
    left: -88,
    padding: space[6],
    pointerEvents: "auto",
    position: "absolute",
    width: 48,
    zIndex: zIndex.rightPanel,
    $nest: {
      "& > span, & > button": {
        display: "inline-flex",
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        left: -88,
        width: 46,
      },
    },
  }),
  resizeMarker: style({
    bottom: 0,
    cursor: "ew-resize",
    left: -6,
    pointerEvents: "auto",
    position: "absolute",
    top: 0,
    width: 12,
    zIndex: zIndex.sidebarPanel,
    $nest: {
      "&:hover": {
        background: "rgba(16, 62, 54, 0.12)",
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        display: "none",
      },
    },
  }),
  mobileToolBar: style({
    alignItems: "center",
    background: color.surface,
    borderTop: `1px solid ${color.border}`,
    bottom: 50,
    boxShadow: "0 -8px 18px rgba(25, 25, 25, 0.08)",
    display: "flex",
    gap: space[6],
    justifyContent: "center",
    minHeight: 48,
    padding: `${space[6]}px ${space[8]}px`,
    pointerEvents: "auto",
    position: "absolute",
    right: 0,
    width: `calc(100vw - ${MOBILE_COLLAPSED_WIDTH}px)`,
    boxSizing: "border-box",
    zIndex: zIndex.rightPanel,
  }),
  mobileTabBar: style({
    alignItems: "center",
    background: color.surface,
    borderTop: `1px solid ${color.border}`,
    bottom: 0,
    display: "flex",
    gap: 1,
    justifyContent: "center",
    minHeight: 50,
    padding: `${space[4]}px ${space[6]}px`,
    pointerEvents: "auto",
    position: "absolute",
    right: 0,
    boxSizing: "border-box",
    width: `calc(100vw - ${MOBILE_COLLAPSED_WIDTH}px)`,
    zIndex: zIndex.rightPanel,
  }),
  mobileTab: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: 6,
    color: color.textMuted,
    cursor: "pointer",
    display: "inline-flex",
    height: 40,
    justifyContent: "center",
    minWidth: 48,
    padding: 0,
  }),
  mobileTabActive: style({
    background: color.accent,
    color: "#103E36",
  }),
};
