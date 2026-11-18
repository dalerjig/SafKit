import type { ShKitIconProps } from "../Icon/icons/types";
import { RoadPriorityRoadIcon } from "./icons";
import {
  BicycleSymbol, CancellationStripes, CarSymbol, InformationSign, MandatorySign,
  NumberMark, PedestrianSymbol, ProhibitionSign, StraightArrow, TruckSymbol,
  TurnArrow, WarningSign, signColors,
} from "./shapes";

const { red, blue, white, black, grey, green } = signColors;

export const RoadPriorityRoadEndIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <RoadPriorityRoadIcon />
    <path d="m5.7 14.7 9-9m-7.3 10.7 9-9m-7.3 10.7 9-9" stroke={black} strokeWidth=".7" />
  </g>
);

export const RoadOncomingPriorityIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="M7 6h2v8h2l-3 4-3-4h2Z" fill={black} />
    <path d="M15 18h2v-8h2l-3-4-3 4h2Z" fill={red} />
  </ProhibitionSign></g>
);

export const RoadPriorityOverOncomingIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M7 5h2v8h2l-3 4-3-4h2Z" fill={red} />
    <path d="M14 19h3V9h3l-4.5-5L11 9h3Z" fill={white} />
  </InformationSign></g>
);

export const RoadIntersectionSecondaryIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M10.5 8h3v10h-3Z" fill={black} />
    <path d="M7 13h10v1.5H7Z" fill={black} />
  </WarningSign></g>
);

export const RoadNoVehiclesIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign /></g>
);

export const RoadNoMotorVehiclesIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign><CarSymbol /></ProhibitionSign></g>
);

export const RoadNoTrucksIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign><TruckSymbol /></ProhibitionSign></g>
);

export const RoadNoBicyclesIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g transform="translate(1.2 1.2) scale(.9)"><BicycleSymbol /></g>
  </ProhibitionSign></g>
);

export const RoadNoPedestriansIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g transform="translate(2.4 2.4) scale(.8)"><PedestrianSymbol /></g>
    <path d="m6.2 6.2 11.6 11.6" stroke={red} strokeWidth="1.8" />
  </ProhibitionSign></g>
);

export const RoadWeightLimitIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign><NumberMark value="8t" x={7.7} y={8.6} /></ProhibitionSign></g>
);

export const RoadHeightLimitIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="m12 4.7-2 2.6h4Zm0 14.6-2-2.6h4Z" fill={black} />
    <NumberMark value="4m" x={8} y={9.1} scale={.9} />
  </ProhibitionSign></g>
);

export const RoadWidthLimitIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="m4.8 12 2.7-1.8v3.6Zm14.4 0-2.7-1.8v3.6Z" fill={black} />
    <NumberMark value="2.5m" x={7.3} y={10} scale={.6} />
  </ProhibitionSign></g>
);

export const RoadNoRightTurnIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g transform="translate(2.4 2.4) scale(.8)"><TurnArrow color={black} /></g>
    <path d="m6.2 6.2 11.6 11.6" stroke={red} strokeWidth="1.8" />
  </ProhibitionSign></g>
);

export const RoadNoLeftTurnIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g transform="translate(21.6 2.4) scale(-.8 .8)"><TurnArrow color={black} /></g>
    <path d="m6.2 6.2 11.6 11.6" stroke={red} strokeWidth="1.8" />
  </ProhibitionSign></g>
);

export const RoadNoUTurnIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="M15 18v-8a3 3 0 0 0-6 0v2m-2.5-2L9 13l2.5-3" fill="none" stroke={black} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="m6.2 6.2 11.6 11.6" stroke={red} strokeWidth="1.8" />
  </ProhibitionSign></g>
);

export const RoadNoOvertakingIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g transform="translate(3.5 5.5) scale(.42 .55)"><CarSymbol color={red} /></g>
    <g transform="translate(10.5 5.5) scale(.42 .55)"><CarSymbol /></g>
  </ProhibitionSign></g>
);

export const RoadSpeedLimitEndIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={white} stroke={grey} strokeWidth=".5" />
    <g opacity=".45"><NumberMark value="60" x={7.6} y={8.5} /></g>
    <CancellationStripes />
  </g>
);

export const RoadNoParkingIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={red} stroke={white} strokeWidth=".5" />
    <circle cx="12" cy="12" r="8" fill={blue} />
    <path d="m6.3 6.3 11.4 11.4" stroke={red} strokeWidth="2" />
  </g>
);

export const RoadRestrictionsEndIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="10.5" fill={white} stroke={grey} strokeWidth=".5" />
    <path d="m2.8 15.2 12.4-12.4M3.6 17.4 17.4 3.6M4.9 19.1 19.1 4.9M6.6 20.4 20.4 6.6M8.8 21.2 21.2 8.8"
      stroke={black} strokeWidth="1.25" />
  </g>
);

export const RoadStraightAheadIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><StraightArrow /></MandatorySign></g>
);

export const RoadTurnRightIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><TurnArrow /></MandatorySign></g>
);

export const RoadTurnLeftIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><g transform="translate(24 0) scale(-1 1)"><TurnArrow /></g></MandatorySign></g>
);

export const RoadKeepRightIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><g transform="rotate(135 12 12)"><StraightArrow /></g></MandatorySign></g>
);

export const RoadKeepLeftIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><g transform="rotate(-135 12 12)"><StraightArrow /></g></MandatorySign></g>
);

export const RoadCyclePathIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><BicycleSymbol color={white} /></MandatorySign></g>
);

export const RoadPedestrianPathIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign><PedestrianSymbol color={white} /></MandatorySign></g>
);

export const RoadRailwayCrossingBarrierIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M6.8 13h10.4v1.3H6.8Zm.9-1.4H9v5.9H7.7Zm3.7 0h1.2v5.9h-1.2Zm3.6 0h1.3v5.9H15ZM6.8 16h10.4v1.2H6.8Z" fill={black} />
  </WarningSign></g>
);

export const RoadRailwayCrossingIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M8 12h5v4H8Zm4-3h3.8v7H12ZM7 16h10v1H7Z" fill={black} />
    <path d="M13 10h1.7v2H13Z" fill={white} />
    <circle cx="9.3" cy="17" r="1.1" fill={black} />
    <circle cx="14.5" cy="17" r="1.1" fill={black} />
    <path d="M9 11V9.5m0-1.2h1.5" stroke={black} strokeWidth="1" strokeLinecap="round" />
  </WarningSign></g>
);

export const RoadTrafficSignalsIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <rect x="10.3" y="8.1" width="3.4" height="9.3" rx=".7" fill={black} />
    <circle cx="12" cy="10" r="1" fill={red} />
    <circle cx="12" cy="12.8" r="1" fill="#FFCF26" />
    <circle cx="12" cy="15.6" r="1" fill="#16A34A" />
  </WarningSign></g>
);

export const RoadBendRightIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M9.5 18v-4a2.5 2.5 0 0 1 2.5-2.5h2" fill="none" stroke={black} strokeWidth="1.6" strokeLinecap="round" />
  </WarningSign></g>
);

export const RoadSlipperyRoadIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <g transform="translate(6.5 4.6) scale(.5 .55) rotate(-12 12 12)"><CarSymbol /></g>
    <path d="M9 14c-3 1 2 1.8-.5 2.8m5-2.5c-3 1 2 1.8-.5 2.8" fill="none" stroke={black} strokeWidth="1" strokeLinecap="round" />
  </WarningSign></g>
);

export const RoadUnevenRoadIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M5.8 18c1.4 0 1.5-3.2 3.2-3.2s1.7 3.2 3 3.2 1.5-3.2 3.2-3.2 1.8 3.2 3 3.2Z" fill={black} />
  </WarningSign></g>
);

export const RoadRoadNarrowsIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M8.5 18v-3.5l2-2.5V9m5 9v-3.5l-2-2.5V9" fill="none" stroke={black} strokeWidth="1.6" strokeLinejoin="round" />
  </WarningSign></g>
);

export const RoadChildrenIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <circle cx="12" cy="9.4" r=".9" fill={black} />
    <circle cx="8.8" cy="12" r=".75" fill={black} />
    <path d="m12.3 11.2-1.2 2.6m1-2.3-2.5 2m2.5-2 1.3 1.2 1.7-.6m-4 1.7 2.3 1.1 1.8 2.3m-4.1-3.4-.7 2.3-1.5 1.2m-.2-3.8-.8 1.6m.8-1.6 1.7-.2m-2.5 1.8 1.4 1.8m-1.4-1.8-1.7.9"
      fill="none" stroke={black} strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
  </WarningSign></g>
);

export const RoadOtherDangerIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M11 8.5h2l-.35 5.8h-1.3Z" fill={black} />
    <circle cx="12" cy="16.3" r="1" fill={black} />
  </WarningSign></g>
);

export const RoadMotorwayIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign background={green}>
    <path d="M7.2 19 9.6 5h1.6l-.7 14Zm9.6 0L14.4 5h-1.6l.7 14Z" fill={white} />
    <path d="M5 10h14v2H5Zm1 2h1.5v3H6Zm10.5 0H18v3h-1.5Z" fill={white} />
  </InformationSign></g>
);

export const RoadOneWayIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign><StraightArrow /></InformationSign></g>
);

export const RoadBusStopIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="4" y="1.5" width="16" height="21" rx=".6" fill={blue} stroke={white} strokeWidth=".5" />
    <rect x="5.5" y="3" width="13" height="15.5" fill={white} />
    <rect x="7.5" y="5" width="9" height="10.8" rx="1" fill={black} />
    <path d="M8.5 6h7v4h-7Z" fill={white} />
    <path d="M8.5 12.5h1.5m4 0h1.5" stroke={white} strokeWidth="1" />
    <path d="M8 15h1.5v1.8H8Zm6.5 0H16v1.8h-1.5Z" fill={black} />
  </g>
);

export const RoadResidentialZoneIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M3.5 12 8 8l4.5 4H11v6H5v-6Zm3 1v3H8v-3Z" fill={white} fillRule="evenodd" />
    <g transform="translate(12.6 3.5) scale(.36 .5)"><PedestrianSymbol color={white} /></g>
    <g transform="translate(10.8 12.5) scale(.42 .32)"><CarSymbol color={white} /></g>
  </InformationSign></g>
);

export const RoadDeadEndIcon = (props: ShKitIconProps) => (
  <g {...props}><InformationSign>
    <path d="M10 19V9h4v10Z" fill={white} />
    <path d="M5.5 5.5h13v5h-13Z" fill={white} />
    <path d="M6.2 6.2h11.6v3.6H6.2Z" fill={red} />
  </InformationSign></g>
);
