import type { ShKitIconProps } from "./types";

export const CloseIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M6.5 6.5 17.5 17.5" />
      <path d="M17.5 6.5 6.5 17.5" />
    </g>
  );
}
