import type { ShKitIconProps } from "./types";

export const DashboardIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 6v.01M6.5 12h.01M17.5 12h.01M7.8 7.8l.01.01M12 12l4-3" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </g>
);
