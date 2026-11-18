import type { ShKitIconProps } from "./types";

export const CopyIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="8" y="8" width="11" height="11" rx="1.5" />
    <path d="M6 16V6.5A1.5 1.5 0 0 1 7.5 5H16" />
  </g>
);
