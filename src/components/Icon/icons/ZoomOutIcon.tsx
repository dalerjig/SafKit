import type { ShKitIconProps } from "./types";

export const ZoomOutIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 20 20" />
      <path d="M8.4 11h5.2" />
    </g>
  );
}
