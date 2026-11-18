import type { ShKitIconProps } from "./types";

export const MediaIcon = (props: ShKitIconProps) => (
    <g {...props}>
        <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M8.5 8.5h.01" />
        <path d="M4 16l5-5 3 3 4-5 4 7" />
    </g>
);