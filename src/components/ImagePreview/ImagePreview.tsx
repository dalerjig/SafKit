import { type ImgHTMLAttributes, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space, zIndex } from "../../tokens";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Modal } from "../Modal";

export type ImagePreviewProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "title"> & {
  title?: ReactNode;
  caption?: ReactNode;
  actions?: ReactNode;
  preview?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fallback?: ReactNode;
};

export const ImagePreview = ({
  title,
  caption,
  actions,
  preview = true,
  open,
  onOpenChange,
  fallback,
  className,
  src,
  alt = "",
  onError,
  ...rest
}: ImagePreviewProps) => {
  const [innerOpen, setInnerOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const isOpen = open ?? innerOpen;
  const isSideways = Math.abs(rotation % 180) === 90;
  const naturalWidth = naturalSize.width || 960;
  const naturalHeight = naturalSize.height || 540;
  const rotatedWidth = isSideways ? naturalHeight : naturalWidth;
  const rotatedHeight = isSideways ? naturalWidth : naturalHeight;
  const viewerScale = useMemo(() => {
    const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
    const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
    const maxWidth = viewportWidth * 0.8 - 36;
    const maxHeight = viewportHeight * 0.8 - 88;
    return Math.min(1, maxWidth / rotatedWidth, maxHeight / rotatedHeight);
  }, [rotatedHeight, rotatedWidth]);
  const imageWidth = Math.max(1, naturalWidth * viewerScale * zoom);
  const imageHeight = Math.max(1, naturalHeight * viewerScale * zoom);
  const frameWidth = Math.max(1, rotatedWidth * viewerScale * zoom);
  const frameHeight = Math.max(1, rotatedHeight * viewerScale * zoom);

  const setOpen = (nextOpen: boolean) => {
    if (!preview || failed) return;
    setInnerOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    setZoom(1);
    setRotation(0);
  }, [isOpen, src]);

  const changeZoom = (direction: 1 | -1) => {
    setZoom(currentZoom => clampZoom(currentZoom * (direction > 0 ? 1.12 : 0.88)));
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    stageRef.current?.scrollTo({ left: 0, top: 0 });
  };

  const image = failed ? (
    <div className={imagePreviewStyles.fallback}>{fallback ?? "Не удалось загрузить изображение"}</div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={event => {
        setFailed(true);
        onError?.(event);
      }}
      {...rest}
    />
  );

  const viewerTitle = (title || caption) ? (
    <span className={imagePreviewStyles.viewerTitle}>
      {title && <strong>{title}</strong>}
      {caption && <small>{caption}</small>}
    </span>
  ) : undefined;

  const viewerActions = (
    <>
      <Button
        aria-label="Повернуть влево"
        icon={<Icon name="rotate-left" size={18} />}
        onClick={() => setRotation(currentRotation => currentRotation - 90)}
        size="sm"
        square
        tooltip="Повернуть влево"
        variant="ghost"
      />
      <Button
        aria-label="Повернуть вправо"
        icon={<Icon name="rotate-right" size={18} />}
        onClick={() => setRotation(currentRotation => currentRotation + 90)}
        size="sm"
        square
        tooltip="Повернуть вправо"
        variant="ghost"
      />
      <Button
        aria-label="Сбросить вид"
        icon={<Icon name="reset" size={18} />}
        onClick={resetView}
        size="sm"
        square
        tooltip="Сбросить вид"
        variant="ghost"
      />
      <span className={imagePreviewStyles.zoomValue}>{Math.round(zoom * 100)}%</span>
    </>
  );

  const viewer = isOpen && src && !failed ? (
    <Modal
      open
      title={viewerTitle}
      headerActions={viewerActions}
      width="80dvw"
      className={imagePreviewStyles.viewer}
      overlayClassName={imagePreviewStyles.overlay}
      bodyClassName={imagePreviewStyles.viewerBody}
      onClose={() => setOpen(false)}
    >
      <div
        ref={stageRef}
        className={imagePreviewStyles.stage}
        onWheel={event => {
          event.preventDefault();
          changeZoom(event.deltaY < 0 ? 1 : -1);
        }}
      >
        <span className={imagePreviewStyles.imageFrame} style={{ height: frameHeight, width: frameWidth }}>
          <img
            src={src}
            alt={alt}
            onLoad={event => {
              setNaturalSize({
                height: event.currentTarget.naturalHeight,
                width: event.currentTarget.naturalWidth
              });
            }}
            style={{
              height: imageHeight,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              width: imageWidth
            }}
          />
        </span>
      </div>
    </Modal>
  ) : null;

  return (
    <>
      <figure className={classes(imagePreviewStyles.root, className)}>
        <button
          type="button"
          className={imagePreviewStyles.mediaButton}
          disabled={!preview || failed}
          onClick={() => setOpen(true)}
        >
          {image}
        </button>
        {(title || caption || actions) && (
          <figcaption className={imagePreviewStyles.caption}>
            <span>
              {title && <strong>{title}</strong>}
              {caption && <small>{caption}</small>}
            </span>
            {actions && <span className={imagePreviewStyles.actions}>{actions}</span>}
          </figcaption>
        )}
      </figure>
      {viewer}
    </>
  );
}

const imagePreviewStyles = {
  root: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.card,
    display: "grid",
    margin: 0,
    minWidth: 0,
    overflow: "hidden"
  }),
  mediaButton: style({
    background: color.surfaceMuted,
    border: 0,
    cursor: "zoom-in",
    display: "block",
    minHeight: 160,
    minWidth: 0,
    overflow: "hidden",
    padding: 0,
    width: "100%",
    $nest: {
      "&:disabled": {
        cursor: "default"
      },
      "& img": {
        aspectRatio: "16 / 9",
        display: "block",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.18s ease",
        width: "100%"
      },
      "&:hover:not(:disabled) img": {
        transform: "scale(1.025)"
      },
      "&:focus-visible": {
        boxShadow: `inset 0 0 0 3px ${color.accent}`,
        outline: "none"
      }
    }
  }),
  fallback: style({
    alignItems: "center",
    aspectRatio: "16 / 9",
    color: color.textMuted,
    display: "flex",
    fontSize: 13,
    fontWeight: 800,
    justifyContent: "center",
    padding: space[16]
  }),
  caption: style({
    alignItems: "center",
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minWidth: 0,
    padding: space[12],
    $nest: {
      "& strong, & small": {
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& strong": {
        color: color.primary,
        fontSize: 14,
        fontWeight: 900
      },
      "& small": {
        color: color.textMuted,
        fontSize: 12,
        fontWeight: 700,
        marginTop: 2
      }
    }
  }),
  actions: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6]
  }),
  overlay: style({
    background: "rgba(25, 25, 25, 0.72)",
    zIndex: zIndex.imagePreview
  }),
  viewer: style({
    height: "80dvh",
    $nest: {
      "& strong, & small": {
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& strong": {
        color: color.primary,
        fontSize: 15,
        fontWeight: 900
      },
      "& small": {
        color: color.textMuted,
        fontSize: 12,
        fontWeight: 700
      },
    }
  }),
  viewerBody: style({
    display: "grid",
    overflow: "hidden",
    padding: 0
  }),
  viewerTitle: style({
    display: "block",
    minWidth: 0
  }),
  zoomValue: style({
    color: color.textMuted,
    fontSize: 12,
    fontWeight: 900,
    minWidth: 42,
    textAlign: "right"
  }),
  stage: style({
    alignItems: "center",
    background: color.surfaceMuted,
    cursor: "zoom-in",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    minHeight: 0,
    overflow: "auto",
    padding: space[18],
    $nest: {
      "& img": {
        display: "block",
        left: "50%",
        objectFit: "contain",
        position: "absolute",
        top: "50%",
        transformOrigin: "center"
      }
    }
  }),
  imageFrame: style({
    display: "block",
    flexShrink: 0,
    position: "relative"
  })
};

const clampZoom = (value: number) => {
  return Math.min(6, Math.max(0.2, value));
}
