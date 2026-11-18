import type { ShKitIconProps } from "./types";

export const FileIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M7 3.8h6.5L18 8.3V20H7V3.8Z" />
      <path d="M13.5 4v4.5H18" />
      <path d="M10 13h5" />
      <path d="M10 16h4" />
    </g>
  );
}
