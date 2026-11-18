import { type KeyboardEvent, type ReactNode, useState } from "react";
import { classes, media, style } from "typestyle";
import { color, radius, shkitSkeletonShimmer, space } from "../../tokens";
import { Badge, type BadgeSize, type BadgeTone } from "../Badge";
import { Icon } from "../Icon";
import { ImagePreview } from "../ImagePreview";

export const FILE_ITEM_HEIGHT = 60;

export type FileElementActionPlacement = "file" | "folder" | "all";

export type FileElementAction = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  placement?: FileElementActionPlacement;
  active?: boolean;
  disabled?: boolean;
};

export type FileItemPreview = {
  src: string;
  alt?: string;
  title?: ReactNode;
  caption?: ReactNode;
  actions?: ReactNode;
  fallback?: ReactNode;
  preview?: boolean;
};

export type FileItemProps = {
  title: ReactNode;
  description?: ReactNode;
  activeContent?: ReactNode | ((state: { selected: boolean; hovered: boolean }) => ReactNode);
  showActiveContent?: boolean;
  label?: ReactNode;
  labelTone?: BadgeTone;
  labelSize?: BadgeSize;
  preview?: FileItemPreview;
  icon?: ReactNode | ((state: { selected: boolean; hovered: boolean }) => ReactNode) | null;
  actions?: ReactNode | ((state: { selected: boolean; hovered: boolean }) => ReactNode);
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  className?: string;
  onSelect?: () => void;
};

export type FolderItemProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | ((state: { selected: boolean; hovered: boolean; containsItems: boolean }) => ReactNode);
  actions?: ReactNode | ((state: { selected: boolean; hovered: boolean }) => ReactNode);
  selected?: boolean;
  containsItems?: boolean;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  className?: string;
  onOpen?: () => void;
  onIconClick?: (nextSelected: boolean) => void;
};

export const FileItem = ({
  title,
  description,
  activeContent,
  showActiveContent,
  label,
  labelTone,
  labelSize,
  preview,
  icon,
  actions,
  selected = false,
  disabled,
  loading,
  height = FILE_ITEM_HEIGHT,
  className,
  onSelect
}: FileItemProps) => {
  const [hovered, setHovered] = useState(false);
  const state = { selected, hovered };
  const shouldShowActiveContent = showActiveContent ?? selected;
  const resolvedActiveContent = typeof activeContent === "function" ? activeContent(state) : activeContent;
  const handleKeyDown = createRowKeyDownHandler(disabled, onSelect);

  const isInactive = disabled || loading;

  return (
    <div
      role="button"
      aria-busy={loading || undefined}
      aria-disabled={isInactive}
      aria-selected={selected || undefined}
      tabIndex={isInactive ? -1 : 0}
      className={classes(
        elementStyles.row,
        selected && elementStyles.selected,
        disabled && elementStyles.disabled,
        loading && elementStyles.loading,
        className
      )}
      style={{ height }}
      onClick={isInactive ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? (
        <FileElementLoadingSkeleton />
      ) : (
        <span className={elementStyles.itemLayout}>
          <span
            className={classes(
              elementStyles.content,
              preview && elementStyles.contentWithPreview,
              !preview && icon === null && elementStyles.contentWithoutIcon
            )}
          >
            {preview ? (
              <span className={elementStyles.preview} onClick={event => event.stopPropagation()}>
                <ImagePreview
                  src={preview.src}
                  alt={preview.alt ?? ""}
                  title={preview.title}
                  caption={preview.caption}
                  actions={preview.actions}
                  fallback={preview.fallback}
                  preview={preview.preview}
                  className={elementStyles.previewImage}
                />
              </span>
            ) : icon !== null ? (
              <span className={elementStyles.icon}>{typeof icon === "function" ? icon(state) : icon ?? <Icon name="file" />}</span>
            ) : null}
            <span className={elementStyles.info}>
              <span className={elementStyles.titleLine}>
                <span className={elementStyles.title} title={typeof title === "string" ? title : undefined}>
                  {title}
                </span>
              </span>
              {resolvedActiveContent && shouldShowActiveContent ? (
                <span className={elementStyles.metaLine}>
                  <span className={elementStyles.activeContent}>{resolvedActiveContent}</span>
                </span>
              ) : (
                (description || label) && (
                  <span className={elementStyles.metaLine}>
                    {description ? <span className={elementStyles.description}>{description}</span> : <span />}
                    {label && <Badge className={elementStyles.label} tone={labelTone} size={labelSize} fontWeight={500} text={label} />}
                  </span>
                )
              )}
            </span>
          </span>
          {actions && (
            <span className={classes(elementStyles.actions, elementStyles.overlayActions, hovered && elementStyles.actionsVisible)} onClick={event => event.stopPropagation()}>
              {typeof actions === "function" ? actions(state) : actions}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export const FolderItem = ({
  title,
  description,
  icon,
  actions,
  selected = false,
  containsItems = false,
  disabled,
  loading,
  height = FILE_ITEM_HEIGHT,
  className,
  onOpen,
  onIconClick
}: FolderItemProps) => {
  const [hovered, setHovered] = useState(false);
  const state = { selected, hovered, containsItems };
  const handleKeyDown = createRowKeyDownHandler(disabled, onOpen);

  const isInactive = disabled || loading;

  return (
    <div
      role="button"
      aria-busy={loading || undefined}
      aria-disabled={isInactive}
      aria-selected={selected || undefined}
      tabIndex={isInactive ? -1 : 0}
      className={classes(
        elementStyles.row,
        selected && elementStyles.selected,
        disabled && elementStyles.disabled,
        loading && elementStyles.loading,
        className
      )}
      style={{ height }}
      onClick={isInactive ? undefined : onOpen}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? (
        <FileElementLoadingSkeleton />
      ) : (
        <span className={elementStyles.itemLayout}>
          <span className={elementStyles.content}>
            <span
              className={classes(elementStyles.icon, onIconClick && elementStyles.iconAction)}
              onClick={event => {
                if (!onIconClick) return;
                event.stopPropagation();
                onIconClick(!selected);
              }}
            >
              {typeof icon === "function" ? icon(state) : icon ?? getDefaultFolderIcon(selected, containsItems)}
            </span>
            <span className={elementStyles.info}>
              <span className={elementStyles.title} title={typeof title === "string" ? title : undefined}>
                {title}
              </span>
              {description && <span className={elementStyles.description}>{description}</span>}
            </span>
          </span>
          {actions && (
            <span className={classes(elementStyles.actions, elementStyles.overlayActions, hovered && elementStyles.actionsVisible)} onClick={event => event.stopPropagation()}>
              {typeof actions === "function" ? actions({ selected, hovered }) : actions}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

const createRowKeyDownHandler = (disabled: boolean | undefined, action: (() => void) | undefined) => {
  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || !action) return;
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    action();
  };
};

const getDefaultFolderIcon = (selected: boolean, containsItems: boolean) => {
  if (selected) return <Icon name="folder-active" />;
  if (containsItems) return <Icon name="folder" />;
  return <Icon name="folder-empty" />;
};

const skeletonShimmer = "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.72), rgba(255,255,255,0))";

const skeletonBlock = (blockHeight: number, blockWidth: string) =>
  style({
    background: color.surfaceMuted,
    borderRadius: radius.xs,
    display: "block",
    height: blockHeight,
    overflow: "hidden",
    position: "relative",
    width: blockWidth,
    $nest: {
      "&::after": {
        animationDuration: "1.25s",
        animationIterationCount: "infinite",
        animationName: shkitSkeletonShimmer,
        animationTimingFunction: "ease-in-out",
        background: skeletonShimmer,
        content: '""',
        inset: 0,
        position: "absolute",
        transform: "translateX(-100%)"
      }
    }
  });

const FileElementLoadingSkeleton = () => (
  <span className={elementStyles.itemLayout} aria-hidden="true">
    <span className={elementStyles.content}>
      <span className={elementStyles.skeletonIcon} />
      <span className={elementStyles.info}>
        <span className={elementStyles.skeletonTitle} />
        <span className={elementStyles.skeletonDescription} />
      </span>
    </span>
  </span>
);

const selectedRow = style({
  boxShadow: `inset 3px 0 0 ${color.primary}`
});

const elementStyles = {
  row: style(
    {
      alignItems: "center",
      background: color.surface,
      border: 0,
      borderBottom: `1px solid ${color.border}`,
      color: color.text,
      cursor: "pointer",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      height: FILE_ITEM_HEIGHT,
      padding: `0 ${space[12]}px`,
      textAlign: "left",
      width: "100%",
      $nest: {
        "&:hover:not([aria-disabled='true'])": {
          background: color.surfaceMuted
        },
        [`&.${selectedRow}`]: {
          background: color.surfaceSecondary
        },
        [`&.${selectedRow}[aria-selected='true']`]: {
          background: color.surfaceSecondary
        }
      }
    },
    media(
      { maxWidth: 720 },
      {
        padding: `0 ${space[10]}px`
      }
    )
  ),
  selected: selectedRow,
  disabled: style({
    cursor: "not-allowed",
    opacity: 0.55
  }),
  loading: style({
    cursor: "default",
    pointerEvents: "none"
  }),
  skeletonIcon: skeletonBlock(28, "28px"),
  skeletonTitle: skeletonBlock(16, "58%"),
  skeletonDescription: skeletonBlock(12, "36%"),
  content: style({
    alignItems: "center",
    display: "grid",
    gap: space[16],
    gridTemplateColumns: "28px minmax(0, 1fr)",
    minWidth: 0
  }),
  contentWithPreview: style({
    gridTemplateColumns: "40px minmax(0, 1fr)"
  }),
  contentWithoutIcon: style({
    gap: 0,
    gridTemplateColumns: "minmax(0, 1fr)"
  }),
  itemLayout: style({
    alignItems: "center",
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "minmax(0, 1fr)",
    minWidth: 0,
    position: "relative",
    width: "100%"
  }),
  icon: style({
    alignItems: "center",
    color: color.primary,
    display: "inline-flex",
    fontSize: 20,
    fontWeight: 900,
    height: 28,
    justifyContent: "center",
    width: 28
  }),
  preview: style({
    alignItems: "center",
    background: color.surfaceSecondary,
    borderRadius: radius.sm,
    display: "inline-flex",
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 40
  }),
  previewImage: style({
    border: 0,
    borderRadius: 0,
    boxShadow: "none",
    display: "block",
    height: "100%",
    width: "100%",
    $nest: {
      "& button": {
        display: "block",
        height: "100%",
        minHeight: 0,
        width: "100%"
      },
      "& img": {
        aspectRatio: "auto",
        height: "100%",
        objectFit: "cover",
        width: "100%"
      },
      "& figcaption": {
        display: "none"
      }
    }
  }),
  iconAction: style({
    borderRadius: radius.xs,
    $nest: {
      "&:hover": {
        background: color.surfaceSecondary
      }
    }
  }),
  info: style({
    display: "grid",
    gap: 4,
    minWidth: 0
  }),
  titleLine: style({
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    minWidth: 0
  }),
  metaLine: style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minWidth: 0
  }),
  title: style(
    {
      color: color.text,
      fontSize: 16,
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      $nest: {
        [`${selectedRow} &`]: {
          color: color.primary
        }
      }
    },
    media(
      { maxWidth: 720 },
      {
        display: "-webkit-box",
        fontSize: 13,
        lineHeight: 1.2,
        maxHeight: "2.4em",
        whiteSpace: "normal",
        WebkitBoxOrient: "vertical",
        "-webkit-line-clamp": 2,
        wordBreak: "break-word"
      }
    )
  ),
  label: style({
    display: "inline-flex",
    flexShrink: 1,
    maxWidth: "min(220px, 45vw)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  description: style({
    color: color.textSubtle,
    fontSize: 12,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  activeContent: style({
    color: color.text,
    display: "block",
    minWidth: 0
  }),
  actions: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6],
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.12s ease"
  }),
  overlayActions: style({
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    $nest: {
      "& button": {
        background: color.surface,
        borderColor: color.border
      },
      "& button:hover:not(:disabled)": {
        background: color.surfaceSecondary
      }
    }
  }),
  actionsVisible: style({
    opacity: 1,
    pointerEvents: "auto"
  })
};
