import type { ShKitIconProps } from "./types";

export const MoreIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <circle cx="6.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </g>
  );
}
