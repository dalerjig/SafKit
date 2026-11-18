import type { ShKitIconProps } from "./types";

export const FullscreenIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M4 9V4h5" />
    <path d="M4 4l5 5" />
    <path d="M15 4h5v5" />
    <path d="M20 4l-5 5" />
    <path d="M20 15v5h-5" />
    <path d="M20 20l-5-5" />
    <path d="M9 20H4v-5" />
    <path d="M4 20l5-5" />
  </g>
);
