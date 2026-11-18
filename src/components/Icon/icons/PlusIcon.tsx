import type { ShKitIconProps } from "./types";

export const PlusIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </g>
  );
}
