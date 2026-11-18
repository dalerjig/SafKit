import type { ShKitIconProps } from "./types";

export const UserIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </g>
  );
}
