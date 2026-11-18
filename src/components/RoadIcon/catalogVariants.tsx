import type { ShKitIconProps } from "../Icon/icons/types";
import { CarSymbol, InformationSign, MandatorySign, NumberMark, ProhibitionSign, signColors } from "./shapes";
const { white, black, blue } = signColors;

type LanePattern = "left" | "right" | "both" | "previous" | "straight";
function LaneDiagram({ pattern, light = false }: { pattern: LanePattern; light?: boolean }) {
  const ink = light ? black : white;
  const positions = pattern === "both" || pattern === "previous" ? [7, 17] : [5.5, 12, 18.5];
  return <>
    <rect x="1.5" y="3" width="21" height="18" rx=".7" fill={light ? white : blue} stroke={light ? black : white} strokeWidth=".5" />
    {positions.map((x, index) => {
      const left = index === 0 && pattern !== "right" && pattern !== "straight";
      const right = index === positions.length - 1 && (pattern === "right" || pattern === "both");
      return <g key={x}>
        <path d={`M${x} 18V7.5m-1.6 1.7 1.6-1.7 1.6 1.7`} stroke={ink} strokeWidth="1.15" strokeLinejoin="round" />
        {left && <>
          <path d={`M${x} 14v-1a1.5 1.5 0 0 0-1.5-1.5h-1`} stroke={ink} strokeWidth="1.15" />
          <path d={`m${x-3.2} 11.5 1.8-1.6v3.2Z`} fill={ink} />
        </>}
        {right && <>
          <path d={`M${x} 14v-1a1.5 1.5 0 0 1 1.5-1.5h1`} stroke={ink} strokeWidth="1.15" />
          <path d={`m${x+3.2} 11.5-1.8-1.6v3.2Z`} fill={ink} />
        </>}
      </g>;
    })}
    {positions.slice(1).map((x, index) => <path key={x} d={`M${(positions[index]+x)/2} 5v14`} stroke={ink} strokeWidth=".4" strokeDasharray="1.5 1.5" />)}
  </>;
}
export const RoadLanesThreeStraightIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="straight" /></g>;
export const RoadLanesThreeLeftIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="left" /></g>;
export const RoadLanesThreeRightIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="right" /></g>;
export const RoadLanesTwoTurnsIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="both" /></g>;
export const RoadLanesThreeLeftWhiteIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="left" light /></g>;
export const RoadLanesThreeRightWhiteIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="right" light /></g>;
export const RoadLanesTwoTurnsWhiteIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="both" light /></g>;
export const RoadLaneDirectionsWhiteIcon = (props: ShKitIconProps) => <g {...props}><LaneDiagram pattern="previous" light /></g>;

export const RoadHeightLimit5Icon = (props: ShKitIconProps) => <g {...props}><ProhibitionSign>
  <path d="m12 4.7-2 2.6h4Zm0 14.6-2-2.6h4Z" fill={black} />
  <NumberMark value="5m" x={8} y={9.1} scale={.9} />
</ProhibitionSign></g>;

function WashSymbol({ ink = black }: { ink?: string }) {
  return <>
    <path d="M5 11V5h14v6m-12-4 1 2m3-2 1 2m3-2 1 2" stroke={ink} strokeWidth="1" />
    <g transform="translate(3 6) scale(.75 .65)"><CarSymbol color={ink} /></g>
  </>;
}
export const RoadCarWashSquareIcon = (props: ShKitIconProps) => <g {...props}><InformationSign>
  <rect x="3.5" y="3.5" width="17" height="17" fill={white} /><WashSymbol />
</InformationSign></g>;
export const RoadCarWashRoundIcon = (props: ShKitIconProps) => <g {...props}><MandatorySign><WashSymbol ink={white} /></MandatorySign></g>;

export const RoadBusRoadIcon = (props: ShKitIconProps) => <g {...props}>
  <InformationSign>
    <path d="M21 4h-5.8a1.2 1.2 0 0 0-1.2 1.2V10h1.1a1.7 1.7 0 0 1 3.4 0H21Z" fill={white} />
    <path d="M15 5h2v2.5h-2Zm3 0h3v2.5h-3Z" fill={blue} />
    <circle cx="16.8" cy="10" r="1.1" fill={white} />
    <path d="M12 7H7V4.5L3.5 8 7 11.5V9h5Z" fill={white} />
    <path d="M3 12.5h18" stroke={white} strokeWidth=".6" strokeDasharray="2 2" />
    <path d="M4 16.5h12V14l4 3.5-4 3.5v-2.5H4Z" fill={white} />
  </InformationSign>
</g>;

export const RoadOneWayRightIcon = (props: ShKitIconProps) => <g {...props}>
  <rect x="1.5" y="7" width="21" height="10" rx=".5" fill={blue} stroke={white} strokeWidth=".5" />
  <path d="M4 10.8h12V8.5l4 3.5-4 3.5v-2.3H4Z" fill={white} />
</g>;
export const RoadOneWayLeftIcon = (props: ShKitIconProps) => <g {...props}><g transform="translate(24 0) scale(-1 1)"><RoadOneWayRightIcon /></g></g>;

export const RoadBlindPedestriansIcon = (props: ShKitIconProps) => <g {...props}>
  <rect x="1.5" y="5" width="21" height="14" rx=".8" fill={white} stroke={black} strokeWidth=".7" />
  <circle cx="7.5" cy="12" r="3" stroke={black} strokeWidth="1.1" /><circle cx="16.5" cy="12" r="3" stroke={black} strokeWidth="1.1" />
  <path d="M10.5 12h3M4.5 11 3 9m16.5 2L21 9" stroke={black} strokeWidth="1.1" />
</g>;

function Coins() {
  return <>
    {[7, 12, 17].map((x, i) => <g key={x}>
      <circle cx={x} cy="19" r="2.1" fill={white} stroke={black} strokeWidth=".5" />
      <NumberMark value={String(i+1)} x={x-.8} y={17.6} scale={.38} />
    </g>)}
  </>;
}
export const RoadPaidParkingIcon = (props: ShKitIconProps) => <g {...props}>
  <rect x="5" y="1" width="14" height="14" rx=".5" fill={blue} stroke={white} strokeWidth=".5" />
  <path d="M9 13V3h4a3 3 0 0 1 0 6h-2v4Zm2-8v2h2a1 1 0 0 0 0-2Z" fill={white} fillRule="evenodd" />
  <rect x="3" y="16" width="18" height="7" rx=".5" fill={white} stroke={black} strokeWidth=".5" />
  <Coins />
</g>;
