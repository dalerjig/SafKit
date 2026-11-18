import type { ReactNode } from "react";
import type { ShKitIconProps } from "../Icon/icons/types";
import { InformationSign, NumberMark, ProhibitionSign, WarningSign, signColors } from "./shapes";

const { white, black, blue } = signColors;

export const RoadSpeedLimit40Icon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign><NumberMark value="40" x={6.6} y={8.1} scale={1.2} /></ProhibitionSign></g>
);
export const RoadSpeedLimit50Icon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign><NumberMark value="50" x={6.6} y={8.1} scale={1.2} /></ProhibitionSign></g>
);

export const RoadLaneEndRightIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M6.2 19V8.5H4L7 5l3 3.5H7.8V19Z" fill={white} />
    <path d="M17 19v-4.5L13 10.5" stroke={white} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m11 8.5 4.5 1-3.5 3.5Z" fill={white} />
  </InformationSign></g>
);
export const RoadLaneEndLeftIcon = (props: ShKitIconProps) => (
  <g {...props}><g transform="translate(24 0) scale(-1 1)"><RoadLaneEndRightIcon /></g></g>
);

export const RoadLaneDirectionsIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M7.2 19V8.5H5L8 5l3 3.5H8.8V19Z" fill={white} />
    <path d="M8 14v-1.5a1 1 0 0 0-1-1H5" stroke={white} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m3 11.5 3-2.5v5Z" fill={white} />
    <path d="M16.2 19V8.5H14L17 5l3 3.5h-2.2V19Z" fill={white} />
    <path d="M12 4v16" stroke={white} strokeWidth=".5" strokeDasharray="2 2" />
  </InformationSign></g>
);

export function BusSymbol() {
  return <>
    <rect x="8" y="5" width="8" height="10" rx="1" fill={white} />
    <path d="M9 6h6v3H9Z" fill={blue} />
    <path d="M9 12h1m4 0h1" stroke={blue} strokeWidth="1" />
    <path d="M8.5 15v2m7-2v2" stroke={white} strokeWidth="1.5" />
  </>;
}
export const RoadBusLaneIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <g transform="translate(-3 0)"><BusSymbol /></g>
    <path d="M18 19V6m-2.5 2.5L18 6l2.5 2.5" stroke={white} strokeWidth="1.4" />
  </InformationSign></g>
);

export const RoadTramStopIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="4" y="1.5" width="16" height="21" rx=".6" fill={blue} stroke={white} strokeWidth=".5" />
    <rect x="5.5" y="3" width="13" height="15.5" fill={white} />
    <path d="m12 4-2 2 2 2 2-2Z" stroke={black} strokeWidth=".7" />
    <rect x="8" y="8" width="8" height="7" rx="1" fill={black} />
    <path d="M9 9h6v2H9Z" fill={white} />
    <circle cx="10" cy="13" r=".6" fill={white} /><circle cx="14" cy="13" r=".6" fill={white} />
    <path d="m10 15-2 2m6-2 2 2m-6-1h4" stroke={black} strokeWidth=".8" />
  </g>
);

export const RoadZone70UpIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="5" y="1.5" width="14" height="21" rx="1" fill={white} stroke={black} strokeWidth=".7" />
    <path d="M12 11V4m-2.5 2.5L12 4l2.5 2.5" stroke={black} strokeWidth="1.2" />
    <NumberMark value="70m" x={7.1} y={14} scale={.72} />
  </g>
);

function SupplementaryPlate({ children }: { children: ReactNode }) {
  return <>
    <rect x="1.5" y="7" width="21" height="10" rx=".8" fill={white} stroke={black} strokeWidth=".7" />
    {children}
  </>;
}

export const RoadActionDirectionsIcon = (props: ShKitIconProps) => (
  <g {...props}><SupplementaryPlate>
    <path d="M3 12 7 8.8v2.3h10V8.8l4 3.2-4 3.2v-2.3H7v2.3Z" fill={black} />
  </SupplementaryPlate></g>
);

export const RoadZone70Icon = (props: ShKitIconProps) => (
  <g {...props}><SupplementaryPlate>
    <NumberMark value="70m" x={6.3} y={9.4} scale={.8} />
  </SupplementaryPlate></g>
);

export const RoadZone100Icon = (props: ShKitIconProps) => (
  <g {...props}><SupplementaryPlate>
    <NumberMark value="100m" x={4.6} y={9.4} scale={.8} />
  </SupplementaryPlate></g>
);

export const RoadTimeOfOperationIcon = (props: ShKitIconProps) => (
  <g {...props}><SupplementaryPlate>
    <NumberMark value="8.00" x={2.7} y={10.5} scale={.45} />
    <path d="M10.6 12h1.2" stroke={black} strokeWidth=".5" />
    <NumberMark value="19.00" x={12.4} y={10.5} scale={.45} />
  </SupplementaryPlate></g>
);

export const RoadPaidServicesIcon = (props: ShKitIconProps) => (
  <g {...props}><SupplementaryPlate>
    {[6.5, 12, 17.5].map((x, index) => <g key={x}>
      <circle cx={x} cy="12" r="2.4" fill={white} stroke={black} strokeWidth=".6" />
      <NumberMark value={String(index + 1)} x={x - .8} y={10.6} scale={.4} />
    </g>)}
  </SupplementaryPlate></g>
);

export const RoadRoadNarrowsRightIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M10.2 17V10m3.6 7v-3l-1.2-2v-2" stroke={black} strokeWidth="1.6" strokeLinejoin="round" />
  </WarningSign></g>
);

export const RoadUTurnPlaceIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M17 19V9a5 5 0 0 0-10 0v5" stroke={white} strokeWidth="2" />
    <path d="m7 18-3.5-5h7Z" fill={white} />
  </InformationSign></g>
);
