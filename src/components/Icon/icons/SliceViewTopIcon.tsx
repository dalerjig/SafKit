import type { ShKitIconProps } from "./types";

export const SliceViewTopIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M7 14.5h10" stroke="currentColor" strokeWidth={1.75} />
      <path d="M12 14.5 8 7.5h8Z" fill="currentColor" stroke="none" />
    </g>
  );
}
