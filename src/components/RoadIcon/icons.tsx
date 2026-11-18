import type { ShKitIconProps } from "../Icon/icons/types";

// Fixed sign colours keep their meaning on either light or dark UI surfaces.
const red = "#D8202F";
const blue = "#0756A5";
const white = "#FFFFFF";
const black = "#171717";

export const RoadStopIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M7.7 1.5h8.6l6.2 6.2v8.6l-6.2 6.2H7.7l-6.2-6.2V7.7Z" fill={red} stroke={white} strokeWidth=".65" />
    <path d="M7.6 10.1H6.2a1 1 0 0 0 0 2h.4a1 1 0 0 1 0 2H5.2m3.4-4h2.8m-1.4 0v4m3.1-4h.6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm3.2 4v-4h1.5a1 1 0 0 1 0 2h-1.5" fill="none" stroke={white} strokeWidth=".9" strokeLinecap="square" strokeLinejoin="round" />
  </g>
);

export const RoadGiveWayIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M2 3h20L12 21Z" fill={red} stroke={white} strokeWidth=".5" strokeLinejoin="round" />
    <path d="M5.5 5.5h13L12 17.2Z" fill={white} />
  </g>
);

export const RoadPriorityRoadIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="m12 1 11 11-11 11L1 12Z" fill={white} stroke={black} strokeWidth=".45" />
    <path d="m12 4 8 8-8 8-8-8Z" fill="#FFCF26" stroke={black} strokeWidth=".35" />
  </g>
);

export const RoadNoEntryIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={red} stroke={white} strokeWidth=".5" />
    <path d="M4.5 10h15v4h-15Z" fill={white} />
  </g>
);

export const RoadSpeedLimit60Icon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={red} stroke={white} strokeWidth=".5" />
    <circle cx="12" cy="12" r="7.9" fill={white} />
    <path d="M10.1 8.2H8.7c-1.1 0-1.8 1-1.8 2.2v3.2c0 1.2.6 2 1.7 2s1.7-.8 1.7-1.9-.6-1.9-1.7-1.9H6.9m8.2-3.6c-1.2 0-1.8.9-1.8 2.1v3.2c0 1.3.6 2.1 1.8 2.1s1.8-.8 1.8-2.1v-3.2c0-1.2-.6-2.1-1.8-2.1Z" fill="none" stroke={black} strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="round" />
  </g>
);

export const RoadPedestrianCrossingIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx=".7" fill={blue} stroke={white} strokeWidth=".5" />
    <path d="m12 3.8 9 16.3H3Z" fill={white} />
    <path d="m6 17.4-1.3 2m4.5-2-1.3 2m4.5-2-1.3 2m4.5-2-1.3 2m4.5-2-1.3 2" stroke={black} strokeWidth="1.15" />
    <circle cx="12.9" cy="8.6" r="1.05" fill={black} />
    <path d="m12.4 10.6-1.1 3.1m.7-2.6-2 1.4H8.7m3.7-1.9 1.5 2.1h1.4m-4 1 2 1.3 1.5 2m-3.5-3.3-1 1.8-1.8 1.4" fill="none" stroke={black} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const RoadRoadworksIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="m12 1.8 10.5 19H1.5Z" fill={red} stroke={white} strokeWidth=".5" strokeLinejoin="round" />
    <path d="m12 6 6.7 12.2H5.3Z" fill={white} />
    <circle cx="11.2" cy="10.1" r=".95" fill={black} />
    <path d="m10.9 11.8 2 1.8m-1.7-1.5-1.5 2.6m3.2-1.1 1.4.3m-4.6.8-1 2.7m1-2.7 2.2.8.4 1.9m1.2-4.6 2.6 3.6" fill="none" stroke={black} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m14 18 2.6-2.2 2 2.2Zm1.2-1.8 1.3 1.3-1.5.2Z" fill={black} />
  </g>
);

export const RoadParkingIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx=".7" fill={blue} stroke={white} strokeWidth=".5" />
    <path d="M8 18V6h5a4 4 0 0 1 0 8h-2.5v4Zm2.5-10v3.7H13a1.85 1.85 0 0 0 0-3.7Z" fill={white} fillRule="evenodd" />
  </g>
);

export const RoadNoStoppingIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={red} stroke={white} strokeWidth=".5" />
    <circle cx="12" cy="12" r="8" fill={blue} />
    <path d="m6.3 6.3 11.4 11.4m0-11.4L6.3 17.7" stroke={red} strokeWidth="2" />
  </g>
);

export const RoadRoundaboutIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={blue} stroke={white} strokeWidth=".5" />
    {[0, 120, 240].map(angle => (
      <g key={angle} transform={`rotate(${angle} 12 12)`}>
        <path d="M12 6.3a5.7 5.7 0 0 0-5.7 5.7" fill="none" stroke={white} strokeWidth="1.65" />
        <path d="m3.8 10.2 2.5 3.3 2.5-3.3Z" fill={white} />
      </g>
    ))}
  </g>
);
