import { keyframes } from "typestyle";

export const shkitSpin = keyframes({
  to: {
    transform: "rotate(360deg)"
  }
});

export const shkitSkeletonShimmer = keyframes({
  to: {
    transform: "translateX(100%)"
  }
});

export const shkitCollapseIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(-4px)"
  },
  to: {
    opacity: 1,
    transform: "translateY(0)"
  }
});

export const shkitOverlayIn = keyframes({
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
});

export const shkitDialogIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(10px) scale(0.985)"
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)"
  }
});
