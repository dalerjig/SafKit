import type { ShKitIconProps } from "../Icon/icons/types";
import { RoadBendRightIcon } from "./additionalIcons";
import {
  CarSymbol, MandatorySign, NumberMark, PedestrianSymbol, ProhibitionSign,
  ServiceSign, WarningSign, signColors,
} from "./shapes";

const { red, white, black } = signColors;

export const RoadBendLeftIcon = (props: ShKitIconProps) => (
  <g {...props} transform="translate(24 0) scale(-1 1)"><RoadBendRightIcon /></g>
);

export const RoadDoubleBendRightIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M10 18v-2.5c0-1.5 4-1.3 4-3s-4-1.5-4-3m-1.7 1.7L10 9l1.7 1.7"
      fill="none" stroke={black} strokeWidth="1.5" strokeLinejoin="round" />
  </WarningSign></g>
);

export const RoadSteepDescentIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="m6 14 12 4H6Z" fill={black} />
    <NumberMark value="10%" x={9} y={10.3} scale={.43} />
  </WarningSign></g>
);

export const RoadSteepAscentIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="m6 18 12-4v4Z" fill={black} />
    <NumberMark value="10%" x={9} y={10.3} scale={.43} />
  </WarningSign></g>
);

export const RoadSpeedBumpIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M5.8 18h2.4a3.8 3.8 0 0 1 7.6 0h2.4Z" fill={black} />
  </WarningSign></g>
);

export const RoadPedestrianWarningIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <g transform="translate(5.3 5.3) scale(.55)"><PedestrianSymbol /></g>
    <path d="m7 17.5-1 1m3.8-1-1 1m3.8-1-1 1m3.8-1-1 1m3.8-1-1 1" stroke={black} strokeWidth=".9" />
  </WarningSign></g>
);

export const RoadWildAnimalsIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="m7.3 13 2.3-.7 3.2.3 1-2.2 1.5-.6.9 1.4-1.5.6-.7 2.5-2.1 1.1H9l-1.7-.9Z" fill={black} />
    <path d="m8.5 14.5-1 2.8m2.5-2.8.2 2.8m2.9-2.8 1.8 1.8m-.8-3.1 2.7.7m-8-1.1-1.8-1m8-1.6-.4-2.7m.3 1.8 1.5-1m-1.7-.4-.7-.7"
      fill="none" stroke={black} strokeWidth=".85" strokeLinecap="round" strokeLinejoin="round" />
  </WarningSign></g>
);

export const RoadFallingRocksIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="m15 11-1 2.5 1 1-.7 2.1L12 18h6.2Z" fill={black} />
    <path d="m11.8 10 .9.5-.4 1-.9-.5Zm-2.1 3 1.2.4.2 1.1-1.2.3-.5-.9ZM7.5 16l1.3-.6 1 .8-.6 1.3H7.6Z" fill={black} />
  </WarningSign></g>
);

export const RoadTwoWayTrafficIcon = (props: ShKitIconProps) => (
  <g {...props}><WarningSign>
    <path d="M8.5 10h1.4v5.2h1.5l-2.2 2.5L7 15.2h1.5Zm5.6 7.7h1.4v-5.2H17L14.8 10l-2.2 2.5h1.5Z" fill={black} />
  </WarningSign></g>
);

export const RoadNoMotorcyclesIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <g fill="none" stroke={black} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.6" cy="15" r="2.5" /><circle cx="16.5" cy="15" r="2.5" />
      <path d="m7.6 15 3-3.5h3l2.9 3.5m-8.9 0H12l2-5.2h2m-6.5 1.7H7m6-1.5-.7-2.2" />
    </g>
    <circle cx="11.8" cy="7.3" r="1.1" fill={black} />
    <path d="m11.4 9.2-1.3 2.5 2.2 1.3.7 2m-1.6-5.8 2.5 1.3" stroke={black} strokeWidth="1.2" strokeLinecap="round" />
  </ProhibitionSign></g>
);

export const RoadNoTrailersIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="M5.5 9h6.2v5.8H5.5Zm7.5 1.2h2.6l2.3 2.5v2.1H13Zm1.2 1v1.8h2l-1.6-1.8Z" fill={black} fillRule="evenodd" />
    <path d="M11.7 14H13" stroke={black} strokeWidth="1" />
    <circle cx="8.5" cy="15.6" r="1.4" fill={black} stroke={white} strokeWidth=".4" />
    <circle cx="15.8" cy="15.6" r="1.4" fill={black} stroke={white} strokeWidth=".4" />
  </ProhibitionSign></g>
);

export const RoadLengthLimitIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <NumberMark value="10m" x={6.3} y={7.5} scale={.85} />
    <path d="M6 15h12m-9-1.8L6 15l3 1.8m6-3.6 3 1.8-3 1.8" fill="none" stroke={black} strokeWidth=".95" strokeLinejoin="round" />
  </ProhibitionSign></g>
);

export const RoadMinimumDistanceIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <NumberMark value="50m" x={6.3} y={7.5} scale={.85} />
    <g transform="translate(4 11.8) scale(.3 .28)"><CarSymbol /></g>
    <g transform="translate(12.8 11.8) scale(.3 .28)"><CarSymbol /></g>
    <path d="M10 15h4m-3-1-1 1 1 1m2-2 1 1-1 1" fill="none" stroke={black} strokeWidth=".7" />
  </ProhibitionSign></g>
);

export const RoadNoHornIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="M6.5 10.5H10l5-3v9l-5-3H6.5Z" fill={black} />
    <path d="M17 9.5q2 2.5 0 5" fill="none" stroke={black} strokeWidth="1" />
    <path d="m6.2 6.2 11.6 11.6" stroke={red} strokeWidth="1.8" />
  </ProhibitionSign></g>
);

export const RoadNoDangerousGoodsIcon = (props: ShKitIconProps) => (
  <g {...props}><ProhibitionSign>
    <path d="M5.5 9h7.8v6H5.5Zm8.4 1.4h2.5l2 2.6v2h-4.5Z" fill={black} />
    <path d="M7 10h4.8v3.2H7Z" fill="#EF8B23" />
    <circle cx="8" cy="16" r="1.4" fill={black} stroke={white} strokeWidth=".4" />
    <circle cx="16" cy="16" r="1.4" fill={black} stroke={white} strokeWidth=".4" />
  </ProhibitionSign></g>
);

export const RoadStraightOrRightIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign>
    <path d="M10.7 19V9H7.5L12 4.5 16.5 9h-3.2v10Z" fill={white} />
    <path d="M12 11h4V8.5l4 3.8-4 3.7v-2.5h-4Z" fill={white} />
  </MandatorySign></g>
);

export const RoadStraightOrLeftIcon = (props: ShKitIconProps) => (
  <g {...props} transform="translate(24 0) scale(-1 1)"><RoadStraightOrRightIcon /></g>
);

export const RoadLeftOrRightIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign>
    <path d="M10.7 19v-7H8v3L3.5 10.8 8 6.5v3h8v-3l4.5 4.3-4.5 4.2v-3h-2.7v7Z" fill={white} />
  </MandatorySign></g>
);

export const RoadKeepEitherSideIcon = (props: ShKitIconProps) => (
  <g {...props}><MandatorySign>
    <path d="M12 12 7.5 16.5M12 12l4.5 4.5" stroke={white} strokeWidth="2" />
    <path d="M5.5 14.5v4h4ZM18.5 14.5v4h-4Z" fill={white} />
  </MandatorySign></g>
);

export const RoadFirstAidIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="M10.3 5h3.4v3.8h3.8v3.4h-3.8V16h-3.4v-3.8H6.5V8.8h3.8Z" fill={red} />
  </ServiceSign></g>
);

export const RoadHospitalIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="M7.5 5h2.7v4h3.6V5h2.7v11h-2.7v-4.4h-3.6V16H7.5Z" fill={black} />
  </ServiceSign></g>
);

export const RoadFuelStationIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="M7 5h7v10H7Zm1.2 1.2v3h4.6v-3Z" fill={black} fillRule="evenodd" />
    <path d="M6.2 15h8.6v1.3H6.2Z" fill={black} />
    <path d="M14 10h1.2v3.5a1 1 0 0 0 2 0V8l-2-2m.8.8V9h1.2" fill="none" stroke={black} strokeWidth="1" strokeLinejoin="round" />
  </ServiceSign></g>
);

export const RoadVehicleServiceIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="M15.4 4.8a3.5 3.5 0 0 0-4.2 4.3l-4.8 4.8a1.5 1.5 0 0 0 2.1 2.1l4.8-4.8a3.5 3.5 0 0 0 4.3-4.2l-2.3 2.2-1.8-1.8Z" fill={black} />
    <circle cx="7.7" cy="14.7" r=".55" fill={white} />
  </ServiceSign></g>
);

export const RoadCarWashIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="M6.5 9V5h11v4m-10-3 2 2m1.5-2 2 2m1.5-2 2 2" fill="none" stroke={black} strokeWidth="1" />
    <g transform="translate(3 6.3) scale(.75 .6)"><CarSymbol /></g>
  </ServiceSign></g>
);

export const RoadRestAreaIcon = (props: ShKitIconProps) => (
  <g {...props}><ServiceSign>
    <path d="m8.5 4.5 3 5.5H10l2 3.5H5l2-3.5H5.5Z" fill={black} />
    <path d="M8 12h1v4H8Zm3 0h7v1.3h-7Zm1 1h1v3h-1Zm4 0h1v3h-1Z" fill={black} />
    <path d="M11 15h7" stroke={black} strokeWidth="1" />
  </ServiceSign></g>
);
