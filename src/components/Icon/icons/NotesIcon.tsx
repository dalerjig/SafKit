import type { ShKitIconProps } from "./types";

export const NotesIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h4" />
    </g>
  );
}
