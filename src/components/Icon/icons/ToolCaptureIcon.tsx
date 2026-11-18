import type { ShKitIconProps } from "./types";

export const ToolCaptureIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </g>
  );
}
