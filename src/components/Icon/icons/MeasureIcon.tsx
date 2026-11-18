import type { ShKitIconProps } from "./types";

export const MeasureIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 16.5 16.5 4 20 7.5 7.5 20 4 16.5Z" />
      <path d="m13.5 7 3.5 3.5" />
      <path d="m10.8 9.8 2 2" />
      <path d="m8.1 12.5 3.5 3.5" />
    </g>
  );
}
