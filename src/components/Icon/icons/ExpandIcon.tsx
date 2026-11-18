import type { ShKitIconProps } from "./types";

export const ExpandIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M8 4H4v4" />
    <path d="m4 4 5 5" />
    <path d="M16 4h4v4" />
    <path d="m20 4-5 5" />
    <path d="M8 20H4v-4" />
    <path d="m4 20 5-5" />
    <path d="M16 20h4v-4" />
    <path d="m20 20-5-5" />
  </g>
);
