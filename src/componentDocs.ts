import type { ReactNode } from "react";

export type PropDoc = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export type ComponentDoc = {
  id: string;
  name: string;
  importCode: string;
  description: string;
  props: PropDoc[];
  usageCode: string;
  preview: ReactNode;
};

export type ComponentDocPreviewContext = {
  docSegment: "public" | "private";
  setDocSegment: (value: "public" | "private") => void;
  styles: {
    previewStack: string;
    previewNarrow: string;
    docPanelPreview: string;
    scanPreviewItem: string;
    tableStatePreview: string;
    stateColumns: string;
  };
};
