import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { classes, style } from "typestyle";
import {
  HEADER_HEIGHT,
  MOBILE_COLLAPSED_WIDTH,
  MOBILE_HEADER_HEIGHT,
  RESPONSIVE_BREAKPOINTS,
  color,
  radius,
  space,
  zIndex,
} from "../../tokens";
import { Button } from "../Button";
import { CloseButton } from "../CloseButton";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

export type SidebarItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
};

export type SidebarProps = {
  items: SidebarItem[];
  activeId?: string;
  logo?: ReactNode;
  collapsedLogo?: ReactNode;
  logoHeight?: number | string;
  footer?: ReactNode | ((state: { collapsed: boolean }) => ReactNode);
  panel?: ReactNode;
  panelTitle?: ReactNode;
  panelActions?: ReactNode;
  panelMobileHeight?: number | string;
  panelOpen?: boolean;
  defaultPanelOpen?: boolean;
  pinned?: boolean;
  defaultPinned?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  hidden?: boolean;
  defaultHidden?: boolean;
  collapsible?: boolean;
  expandedWidth?: number;
  collapsedWidth?: number;
  collapseIcon?: ReactNode;
  expandIcon?: ReactNode;
  mobileToggle?: ReactNode;
  pinIcon?: ReactNode;
  unpinIcon?: ReactNode;
  autoCollapseOnSelect?: boolean;
  showMobileToggle?: boolean;
  onSelect?: (id: string, item: SidebarItem) => void;
  onPanelClose?: () => void;
  onPanelOpenChange?: (open: boolean) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  onHiddenChange?: (hidden: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
  className?: string;
};

export const Sidebar = ({
  items,
  activeId,
  logo,
  collapsedLogo,
  logoHeight,
  footer,
  panel,
  panelTitle,
  panelActions,
  panelMobileHeight = "50dvh",
  panelOpen,
  defaultPanelOpen = true,
  pinned,
  defaultPinned = true,
  collapsed,
  defaultCollapsed = true,
  hidden,
  defaultHidden = false,
  collapsible = true,
  expandedWidth = 200,
  collapsedWidth = 58,
  collapseIcon = <Icon name="chevron-left" />,
  expandIcon = <Icon name="chevron-right" />,
  mobileToggle = <Icon name="menu" />,
  pinIcon = <Icon name="pin" />,
  unpinIcon = <Icon name="unpin" />,
  autoCollapseOnSelect = true,
  showMobileToggle = true,
  onSelect,
  onPanelClose,
  onPanelOpenChange,
  onCollapsedChange,
  onHiddenChange,
  onPinnedChange,
  className,
}: SidebarProps) => {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const [innerHidden, setInnerHidden] = useState(defaultHidden);
  const [innerPanelOpen, setInnerPanelOpen] = useState(defaultPanelOpen);
  const [innerPinned, setInnerPinned] = useState(defaultPinned);
  const [hoveredPanel, setHoveredPanel] = useState(false);
  const isCollapsed = collapsed ?? innerCollapsed;
  const isHidden = hidden ?? innerHidden;
  const isPinned = pinned ?? innerPinned;
  const isPanelOpen = Boolean(panel) && (panelOpen ?? innerPanelOpen);
  const [panelRendered, setPanelRendered] = useState(isPanelOpen && !isHidden);
  const [panelClosing, setPanelClosing] = useState(false);
  const [panelVisible, setPanelVisible] = useState(isPanelOpen && !isHidden);
  const siderWidth = isCollapsed ? collapsedWidth : expandedWidth;
  const panelPeek = 14;
  const visibleItems = items.filter((item) => !item.hidden);
  const workspaceHidden = isHidden && !showMobileToggle;
  const resolvedPanelMobileHeight =
    typeof panelMobileHeight === "number"
      ? `${panelMobileHeight}px`
      : panelMobileHeight;

  useEffect(() => {
    if (isPanelOpen && !isHidden) {
      if (!panelRendered) {
        setPanelRendered(true);
        setPanelVisible(false);
        let nextFrameId = 0;
        const frameId = window.requestAnimationFrame(() => {
          nextFrameId = window.requestAnimationFrame(() => {
            setPanelVisible(true);
          });
        });
        setPanelClosing(false);
        return () => {
          window.cancelAnimationFrame(frameId);
          window.cancelAnimationFrame(nextFrameId);
        };
      }

      setPanelVisible(true);
      setPanelClosing(false);
      return undefined;
    }

    if (!panelRendered) return undefined;

    setPanelClosing(true);
    setPanelVisible(false);
    const timeoutId = window.setTimeout(() => {
      setPanelRendered(false);
      setPanelClosing(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [isHidden, isPanelOpen, panelRendered]);

  const setCollapsed = (nextCollapsed: boolean) => {
    setInnerCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  };

  const setHidden = (nextHidden: boolean) => {
    setInnerHidden(nextHidden);
    onHiddenChange?.(nextHidden);
  };

  const setPinned = (nextPinned: boolean) => {
    setInnerPinned(nextPinned);
    onPinnedChange?.(nextPinned);
  };

  const setPanelOpen = (nextPanelOpen: boolean) => {
    setInnerPanelOpen(nextPanelOpen);
    onPanelOpenChange?.(nextPanelOpen);
  };

  const closePanel = () => {
    setPanelOpen(false);
    onPanelClose?.();
  };

  return (
    <div className={classes(sidebarStyles.shell, className)}>
      {showMobileToggle && (
        <button
          type="button"
          className={sidebarStyles.mobileToggle}
          onClick={() => setHidden(!isHidden)}
        >
          {mobileToggle}
        </button>
      )}
      <div
        className={classes(
          sidebarStyles.workspace,
          workspaceHidden && sidebarStyles.hidden,
        )}
        onMouseLeave={() => setHoveredPanel(false)}
      >
        <aside
          className={classes(
            sidebarStyles.sider,
            isHidden && sidebarStyles.siderHidden,
          )}
          style={{ width: siderWidth }}
          onMouseEnter={() => {
            if (!isPinned) setHoveredPanel(true);
          }}
        >
          <button
            type="button"
            className={sidebarStyles.logo}
            style={
              logoHeight === undefined
                ? undefined
                : { height: logoHeight, minHeight: logoHeight }
            }
            onClick={() => setCollapsed(false)}
          >
            {isCollapsed ? (collapsedLogo ?? logo) : (logo ?? collapsedLogo)}
          </button>
          <nav className={sidebarStyles.nav} role="menu">
            {visibleItems.map((item) => {
              const selected = activeId === item.id;
              return (
                <Tooltip
                  key={item.id}
                  content={item.label}
                  placement="right"
                  disabled={!isCollapsed || item.disabled}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-selected={selected}
                    disabled={item.disabled}
                    className={classes(
                      sidebarStyles.item(isCollapsed),
                      selected && sidebarStyles.active,
                    )}
                    onClick={() => {
                      onSelect?.(item.id, item);
                      if (panel) setPanelOpen(true);
                      if (autoCollapseOnSelect) {
                        setCollapsed(true);
                      }
                    }}
                  >
                    {item.icon && (
                      <span className={sidebarStyles.icon}>{item.icon}</span>
                    )}
                    {!isCollapsed && (
                      <span className={sidebarStyles.label}>{item.label}</span>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </nav>
          <div className={sidebarStyles.footer}>
            {typeof footer === "function"
              ? footer({ collapsed: isCollapsed })
              : footer}
          </div>
          {collapsible && (
            <Tooltip
              content={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
              placement="right"
            >
              <button
                type="button"
                className={sidebarStyles.trigger}
                onClick={() => setCollapsed(!isCollapsed)}
              >
                {isCollapsed ? expandIcon : collapseIcon}
              </button>
            </Tooltip>
          )}
        </aside>

        {panel && panelRendered && !isHidden && (
          <aside
            data-shkit-layout-obstacle={
              isPinned && panelVisible ? "left" : undefined
            }
            className={classes(
              sidebarStyles.panel,
              isPinned
                ? sidebarStyles.panelPinned(panelVisible, siderWidth)
                : sidebarStyles.panelFloating(
                    panelVisible,
                    hoveredPanel,
                    siderWidth,
                    panelPeek,
                  ),
              panelClosing && sidebarStyles.panelClosing,
            )}
            style={
              {
                "--shkit-sidebar-panel-mobile-height":
                  resolvedPanelMobileHeight,
              } as CSSProperties
            }
            onMouseEnter={() => setHoveredPanel(true)}
            onMouseLeave={() => setHoveredPanel(false)}
          >
            <div className={sidebarStyles.panelToolbar}>
              <div className={sidebarStyles.panelTitle}>{panelTitle}</div>
              {panelActions}
              <Tooltip
                content={isPinned ? "Открепить панель" : "Закрепить панель"}
                placement="bottom"
              >
                <Button
                  square
                  size="sm"
                  variant="ghost"
                  aria-label={
                    isPinned ? "Открепить панель" : "Закрепить панель"
                  }
                  icon={isPinned ? pinIcon : unpinIcon}
                  onClick={() => setPinned(!isPinned)}
                />
              </Tooltip>
              <CloseButton onClick={closePanel} />
            </div>
            <div className={sidebarStyles.panelContent}>{panel}</div>
          </aside>
        )}
      </div>
    </div>
  );
};

const sidebarStyles = {
  shell: style({
    height: "100%",
    minHeight: 0,
    overflow: "visible",
    position: "relative",
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
        position: "relative",
        zIndex: zIndex.rightPanel,
      },
    },
  }),
  workspace: style({
    display: "flex",
    height: "100%",
    minHeight: 0,
    overflow: "visible",
    position: "relative",
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        flex: 1,
        height: "auto",
        pointerEvents: "auto",
        paddingTop: 0,
        position: "relative",
      },
    },
  }),
  hidden: style({
    display: "none",
  }),
  mobileToggle: style({
    alignItems: "center",
    background: color.sidebarRail,
    border: 0,
    color: color.sidebarRailText,
    cursor: "pointer",
    display: "none",
    fontSize: 18,
    fontWeight: 900,
    height: MOBILE_HEADER_HEIGHT,
    justifyContent: "center",
    width: MOBILE_COLLAPSED_WIDTH,
    zIndex: zIndex.sidebarPanel,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        display: "flex",
        flexShrink: 0,
        pointerEvents: "auto",
      },
    },
  }),
  sider: style({
    background: color.sidebarRail,
    color: color.sidebarRailText,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    transition: "width 0.2s ease",
    zIndex: zIndex.layoutOverlay,
    $nest: {
      "& > span": {
        display: "flex",
        flexShrink: 0,
        width: "100%",
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        boxShadow: "8px 0 22px rgba(25, 25, 25, 0.18)",
      },
    },
  }),
  siderHidden: style({
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        pointerEvents: "none",
        transform: "translateX(-100%)",
        width: "0 !important",
      },
    },
  }),
  logo: style({
    background: `linear-gradient(135deg, ${color.sidebarLogoAccent}, ${color.sidebarLogo})`,
    border: 0,
    borderRadius: radius.xs,
    cursor: "pointer",
    display: "grid",
    flexShrink: 0,
    margin: space[4],
    minHeight: 42,
    padding: space[8],
    placeItems: "center",
    textAlign: "center",
    $nest: {
      "& > img, & > svg": {
        display: "block",
        maxHeight: "100%",
        maxWidth: "100%",
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        marginTop: space[8],
      },
    },
  }),
  nav: style({
    flex: 1,
    listStyle: "none",
    margin: 0,
    minHeight: 0,
    overflow: "hidden auto",
    padding: `${space[4]}px 0`,
    $nest: {
      "& > span": {
        display: "flex",
        width: "100%",
      },
    },
  }),
  item: (collapsed: boolean) =>
    style({
      alignItems: "center",
      backgroundColor: "transparent",
      border: 0,
      borderRadius: radius.xs,
      color: color.sidebarRailText,
      cursor: "pointer",
      display: "flex",
      fontSize: 14,
      fontWeight: 800,
      gap: space[10],
      height: 40,
      justifyContent: collapsed ? "center" : "flex-start",
      margin: `0 ${space[4]}px`,
      overflow: "hidden",
      padding: collapsed ? 0 : `0 ${space[16]}px`,
      position: "relative",
      transition:
        "background 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.22s ease",
      whiteSpace: "nowrap",
      width: `calc(100% - ${space[8]}px)`,
      $nest: {
        "&::before": {
          background: color.accent,
          borderRadius: `0 ${radius.xs}px ${radius.xs}px 0`,
          bottom: 7,
          content: '""',
          left: 0,
          opacity: 0,
          position: "absolute",
          top: 7,
          transform: "scaleY(0.36)",
          transformOrigin: "center",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          width: 3,
        },
        "&::after": {
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
          content: '""',
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          position: "absolute",
          transform: "translateX(-42%)",
          transition: "opacity 0.24s ease, transform 0.34s ease",
        },
        "&:hover:not(:disabled)": {
          background: "rgba(255,255,255,0.14)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.14), 0 8px 18px rgba(0,0,0,0.16)",
          color: color.surface,
          transform: collapsed ? "translateY(-1px)" : "translateX(3px)",
        },
        "&:hover:not(:disabled)::before": {
          opacity: 1,
          transform: "scaleY(1)",
        },
        "&:hover:not(:disabled)::after": {
          opacity: 1,
          transform: "translateX(0)",
        },
        "&:hover:not(:disabled) span:first-child": {
          transform: "translateX(1px) scale(1.12) rotate(-3deg)",
        },
        "&:hover:not(:disabled) span:last-child": {
          transform: "translateX(2px)",
        },
        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.45,
        },
      },
    }),
  active: style({
    background: color.primaryHover,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
    color: color.surface,
    $nest: {
      "&::before": {
        opacity: 1,
        transform: "scaleY(1)",
      },
      "&:hover:not(:disabled)": {
        background: color.accent,
        color: color.primary,
      },
    },
  }),
  icon: style({
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    fontSize: 16,
    justifyContent: "center",
    position: "relative",
    transition: "transform 0.22s ease",
    zIndex: 1,
  }),
  label: style({
    overflow: "hidden",
    position: "relative",
    textOverflow: "ellipsis",
    transition: "transform 0.22s ease",
    zIndex: 1,
    whiteSpace: "nowrap",
  }),
  footer: style({
    flexShrink: 0,
  }),
  trigger: style({
    alignItems: "center",
    background: color.sidebarRail,
    border: "none",
    color: color.sidebarRailText,
    cursor: "pointer",
    display: "flex",
    flexShrink: 0,
    fontSize: 18,
    fontWeight: 900,
    height: 48,
    justifyContent: "center",
    transition: "background 0.2s ease",
    width: "100%",
    $nest: {
      "&:hover": {
        background: color.primaryHover,
      },
    },
  }),
  panel: style({
    background: color.surface,
    borderRight: `1px solid ${color.border}`,
    boxShadow: "10px 0 26px rgba(25, 25, 25, 0.12)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    bottom: 0,
    height: "auto",
    minHeight: 0,
    position: "absolute",
    top: HEADER_HEIGHT,
    transformOrigin: "left center",
    transition:
      "opacity 0.32s ease, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.42s ease, filter 0.32s ease",
    willChange: "opacity, transform, filter",
    $nest: {
      "&::before": {
        background: `linear-gradient(90deg, ${color.accent}, transparent)`,
        bottom: 0,
        content: '""',
        left: 0,
        opacity: 0,
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        transition: "opacity 0.32s ease",
        width: 2,
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        borderTop: `1px solid ${color.border}`,
        boxShadow: "0 -14px 32px rgba(25, 25, 25, 0.14)",
        height: "var(--shkit-sidebar-panel-mobile-height)",
        maxHeight: `calc(100dvh - ${MOBILE_HEADER_HEIGHT}px)`,
        width: `calc(100vw - ${MOBILE_COLLAPSED_WIDTH}px)`,
        top: "auto",
      },
    },
  }),
  panelPinned: (visible: boolean, siderWidth: number) =>
    style({
      filter: visible ? "blur(0)" : "blur(0.8px)",
      left: siderWidth,
      opacity: visible ? 1 : 0,
      transform: visible
        ? "translateX(0) scaleX(1)"
        : "translateX(calc(-100% - 20px)) scaleX(0.985)",
      zIndex: zIndex.sticky,
      $nest: {
        "&::before": {
          opacity: visible ? 0.7 : 0,
        },
      },
    }),
  panelFloating: (
    visible: boolean,
    hovered: boolean,
    siderWidth: number,
    peek: number,
  ) =>
    style({
      boxShadow: hovered
        ? "12px 0 32px rgba(25, 25, 25, 0.18)"
        : "6px 0 18px rgba(25, 25, 25, 0.1)",
      filter: visible ? "blur(0)" : "blur(0.8px)",
      left: siderWidth,
      opacity: visible ? 1 : 0,
      transform: visible
        ? hovered
          ? "translateX(0) scaleX(1)"
          : `translateX(calc(-100% + ${peek}px)) scaleX(1)`
        : "translateX(calc(-100% - 20px)) scaleX(0.985)",
      zIndex: zIndex.sticky,
      $nest: {
        "&::before": {
          opacity: visible && hovered ? 0.7 : 0,
        },
      },
    }),
  panelClosing: style({
    filter: "blur(0.8px)",
    opacity: 0,
    pointerEvents: "none",
    transitionDuration: "0.24s",
  }),
  panelToolbar: style({
    alignItems: "center",
    borderBottom: `1px solid ${color.border}`,
    display: "flex",
    gap: space[6],
    justifyContent: "flex-end",
    padding: space[8],
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        minHeight: MOBILE_HEADER_HEIGHT,
        padding: `${space[6]}px ${space[8]}px`,
      },
    },
  }),
  panelTitle: style({
    color: color.text,
    flex: 1,
    fontSize: 16,
    fontWeight: 900,
    minWidth: 0,
    overflow: "hidden",
    paddingLeft: space[8],
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  panelContent: style({
    flex: 1,
    minHeight: 0,
    overflow: "auto",
  }),
};
