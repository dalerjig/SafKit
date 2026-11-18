import { useEffect, useState } from "react";
import { RESPONSIVE_BREAKPOINTS } from "../tokens";

export const useResponsive = () => {
  const [state, setState] = useState(() => getResponsiveState());

  useEffect(() => {
    const update = () => setState(getResponsiveState());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return state;
}

const getResponsiveState = () => {
  if (typeof window === "undefined") {
    return {
      isXs: false,
      isMobile: false,
      isTab: false,
      isHorizontalTab: false,
      isWide: false
    };
  }

  return {
    isXs: window.matchMedia(`(max-width: ${RESPONSIVE_BREAKPOINTS.XS}px)`).matches,
    isMobile: window.matchMedia(`(max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`).matches,
    isTab: window.matchMedia(`(max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`).matches,
    isHorizontalTab: window.matchMedia(`(max-width: ${RESPONSIVE_BREAKPOINTS.L}px)`).matches,
    isWide: window.matchMedia(`(min-width: ${RESPONSIVE_BREAKPOINTS.XL}px)`).matches
  };
}
