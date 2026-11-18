import type { ShKitIconProps } from "./types";

export const ZoomResetIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 20 20" />
      <path d="M9.3 9.2a2.8 2.8 0 1 1-.4 3.5" />
      <path d="M9.3 7.6v1.6h1.6" />
    </g>
  );
}
