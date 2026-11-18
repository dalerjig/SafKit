import {
  Children,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";

export type CarouselRef = {
  goTo: (index: number, animate?: boolean) => void;
  next: () => void;
  prev: () => void;
};

export type CarouselProps = {
  children: ReactNode;
  activeIndex?: number;
  defaultActiveIndex?: number;
  dots?: boolean;
  infinite?: boolean;
  onChange?: (index: number) => void;
  className?: string;
};

export const Carousel = forwardRef<CarouselRef, CarouselProps>(function Carousel(
  {
    children,
    activeIndex,
    defaultActiveIndex = 0,
    dots = true,
    infinite = false,
    onChange,
    className
  },
  ref
) {
  const slides = useMemo(() => Children.toArray(children).filter(Boolean), [children]);
  const [innerIndex, setInnerIndex] = useState(defaultActiveIndex);
  const [animate, setAnimate] = useState(true);
  const currentIndex = activeIndex ?? innerIndex;

  const setIndex = useCallback((nextIndex: number, shouldAnimate = true) => {
    if (slides.length === 0) return;

    let resolvedIndex = nextIndex;
    if (infinite) {
      resolvedIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
    } else {
      resolvedIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    }

    setAnimate(shouldAnimate);
    if (activeIndex === undefined) {
      setInnerIndex(resolvedIndex);
    }
    onChange?.(resolvedIndex);
  }, [activeIndex, infinite, onChange, slides.length]);

  useImperativeHandle(ref, () => ({
    goTo: (index, shouldAnimate = true) => setIndex(index, shouldAnimate),
    next: () => setIndex(currentIndex + 1),
    prev: () => setIndex(currentIndex - 1)
  }), [currentIndex, setIndex]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={classes(carouselStyles.root, className)}>
      <div className={carouselStyles.viewport}>
        <div
          className={classes(carouselStyles.track, animate && carouselStyles.trackAnimated)}
          style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className={carouselStyles.slide} aria-hidden={index !== currentIndex}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {dots && slides.length > 1 && (
        <div className={carouselStyles.dots} role="tablist" aria-label="Carousel slides">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              className={classes(carouselStyles.dot, index === currentIndex && carouselStyles.dotActive)}
              onClick={() => setIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const carouselStyles = {
  root: style({
    display: "grid",
    gap: space[12],
    minWidth: 0,
    width: "100%"
  }),
  viewport: style({
    minWidth: 0,
    overflow: "hidden",
    width: "100%"
  }),
  track: style({
    display: "flex",
    minWidth: 0,
    width: "100%",
    willChange: "transform"
  }),
  trackAnimated: style({
    transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)"
  }),
  slide: style({
    boxSizing: "border-box",
    flex: "0 0 100%",
    minWidth: 0,
    width: "100%"
  }),
  dots: style({
    alignItems: "center",
    display: "flex",
    gap: space[8],
    justifyContent: "center",
    minWidth: 0
  }),
  dot: style({
    background: color.border,
    border: 0,
    borderRadius: radius.round,
    cursor: "pointer",
    height: 8,
    padding: 0,
    transition: "background 0.18s ease, transform 0.18s ease, width 0.18s ease",
    width: 8,
    $nest: {
      "&:hover": {
        background: color.borderStrong
      }
    }
  }),
  dotActive: style({
    background: color.primary,
    transform: "scale(1.05)",
    width: 18
  })
};
