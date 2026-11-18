import type { ReactNode } from "react";

export const signColors = {
  red: "#D8202F",
  blue: "#0756A5",
  white: "#FFFFFF",
  black: "#171717",
  green: "#087747",
  grey: "#777777",
} as const;

const { red, blue, white, black } = signColors;

export function ProhibitionSign({ children }: { children?: ReactNode }) {
  return <>
    <circle cx="12" cy="12" r="10.5" fill={red} stroke={white} strokeWidth=".5" />
    <circle cx="12" cy="12" r="7.9" fill={white} />
    {children}
  </>;
}

export function MandatorySign({ children }: { children: ReactNode }) {
  return <>
    <circle cx="12" cy="12" r="10.5" fill={blue} stroke={white} strokeWidth=".5" />
    {children}
  </>;
}

export function WarningSign({ children }: { children: ReactNode }) {
  return <>
    <path d="m12 1.8 10.5 19H1.5Z" fill={red} stroke={white} strokeWidth=".5" strokeLinejoin="round" />
    <path d="m12 6 6.7 12.2H5.3Z" fill={white} />
    {children}
  </>;
}

export function InformationSign({ children, background = blue }: { children: ReactNode; background?: string }) {
  return <>
    <rect x="1.5" y="1.5" width="21" height="21" rx=".7" fill={background} stroke={white} strokeWidth=".5" />
    {children}
  </>;
}

export function ServiceSign({ children }: { children: ReactNode }) {
  return <>
    <rect x="3.5" y="1.5" width="17" height="21" rx=".6" fill={blue} stroke={white} strokeWidth=".5" />
    <rect x="5" y="3" width="14" height="15" fill={white} />
    {children}
  </>;
}

export function CancellationStripes() {
  return <path d="m3.8 16.8 13-13m-11 15 13-13m-11 15 13-13" stroke={black} strokeWidth=".75" />;
}

export function CarSymbol({ color = black }: { color?: string }) {
  return <g fill={color}>
    <path d="M6.2 10.5 7.6 7h8.8l1.4 3.5.8.8V16H5.4v-4.7Zm2.4-2.2-.9 2.2h8.6l-.9-2.2Z" fillRule="evenodd" />
    <rect x="6" y="15" width="2.3" height="2.5" rx=".5" />
    <rect x="15.7" y="15" width="2.3" height="2.5" rx=".5" />
    <path d="M7 12.2h2m6 0h2" stroke={color === white ? blue : white} strokeWidth="1" />
  </g>;
}

export function TruckSymbol() {
  return <g fill={black}>
    <path d="M5.3 8.2h8v6h-8Zm8.7 2h2.5l2.2 2.7v3H14Zm1.2 1.1v2.1h2.1l-1.7-2.1Z" fillRule="evenodd" />
    <path d="M5.3 14.9h13.4v1.4H5.3Z" />
    <circle cx="8" cy="16.3" r="1.6" stroke={white} strokeWidth=".4" />
    <circle cx="16.3" cy="16.3" r="1.6" stroke={white} strokeWidth=".4" />
  </g>;
}

export function BicycleSymbol({ color = black }: { color?: string }) {
  return <g fill="none" stroke={color} strokeWidth=".95" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15" r="3" />
    <circle cx="16.5" cy="15" r="3" />
    <path d="m7.5 15 3-5 3 5h-6m3-5h4.5m-1.5 5 1.5-7h2m-7 1h2m3 1 1.5 5" />
  </g>;
}

export function PedestrianSymbol({ color = black }: { color?: string }) {
  return <g>
    <circle cx="12.8" cy="6.7" r="1.4" fill={color} />
    <path d="m12.4 9.3-1.2 4.5m1.1-4.3-2.9 2.6H7.5m4.9-2.8 2.1 2.7h2m-5.3 1.8 2.5 1.7 1.8 3.3m-4.3-5-1.5 3.3-2.2 1.7"
      fill="none" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
  </g>;
}

export function StraightArrow({ color = white }: { color?: string }) {
  return <path d="M10.5 19V10H7l5-5 5 5h-3.5v9Z" fill={color} />;
}

export function TurnArrow({ color = white }: { color?: string }) {
  return <path d="M7 19v-6a5 5 0 0 1 5-5h2V5l5 4.5-5 4.5v-3h-2a2 2 0 0 0-2 2v6Z" fill={color} />;
}

const glyphs: Record<string, string> = {
  "1": "M.5 2 2 .5v6M.5 6.5h3",
  "0": "M2 .5C.9.5.5 1.3.5 2.5v2C.5 5.7.9 6.5 2 6.5s1.5-.8 1.5-2v-2C3.5 1.3 3.1.5 2 .5Z",
  "2": "M.5 1.8C.5 0 3.5 0 3.5 1.8c0 1-3 2.8-3 4.7h3",
  "3": "M.5.5h3L2 3.2c2.2 0 2.2 3.3 0 3.3H.5",
  "4": "M3 .5.5 4.5h3.3M3 .5v6",
  "5": "M3.5.5h-3v2.8h1.6c2.2 0 2.2 3.2 0 3.2H.5",
  "6": "M3.3.5H2C1 .5.5 1.4.5 2.5v2.4c0 2.2 3 2.2 3 0 0-1.2-.5-1.8-1.5-1.8H.5",
  "7": "M.5.5h3L1 6.5",
  "8": "M2 .5c-2 0-2 2.8 0 2.8s2-2.8 0-2.8Zm0 2.8c-2.1 0-2.1 3.2 0 3.2s2.1-3.2 0-3.2Z",
  "9": "M3.5 3.8H2C0 3.8 0 .5 2 .5c1 0 1.5.8 1.5 2v2C3.5 5.7 3 6.5 2 6.5H.7",
  t: "M.5 2h3M2 2v4.5",
  m: "M.5 6.5V2L2 4.5 3.5 2v4.5",
  "%": "M.5 6.5 3.5.5M1.3 1.3a.6.6 0 1 0-1.2 0 .6.6 0 1 0 1.2 0M3.9 5.7a.6.6 0 1 0-1.2 0 .6.6 0 1 0 1.2 0",
};

/** Compact vector numerals and units; never depend on the consumer's font. */
export function NumberMark({ value, x, y, scale = 1, color = black }: {
  value: string; x: number; y: number; scale?: number; color?: string;
}) {
  let cursor = 0;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {Array.from(value, (char, index) => {
      const position = cursor;
      cursor += char === "." ? 2 : 5;
      return char === "."
        ? <circle key={index} cx={position + .5} cy="6.2" r=".6" fill={color} />
        : <path key={index} d={glyphs[char]} transform={`translate(${position} 0)`} fill="none"
          stroke={color} strokeWidth=".95" strokeLinecap="square" strokeLinejoin="round" />;
    })}
  </g>;
}
