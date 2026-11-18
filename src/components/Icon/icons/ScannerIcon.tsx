import type { ShKitIconProps } from "./types";

export const ScannerIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M8 7.5H6.5V9" />
    <path d="M16 7.5h1.5V9" />
    <path d="M8 16.5H6.5V15" />
    <path d="M16 16.5h1.5V15" />
    <path d="M6.5 12H17.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </g>
);
