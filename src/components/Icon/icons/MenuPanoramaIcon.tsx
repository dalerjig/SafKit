import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

/** Панорама: высокий кадр и подпись 360. */
export const MenuPanoramaIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M5 6Q12 8.8 19 6V18Q12 15.2 5 18V6Z"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.52}
        fontSize="6.0"
        fontWeight="120"
        textAnchor="middle"
        dominantBaseline="middle"
        paintOrder="stroke"
        //style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        360
      </text>
    </g>
  );
};
