import { Card, Description, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import { RESPONSIVE_BREAKPOINTS } from "../../tokens";

export const getResponsiveDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  const breakpointItems = Object.entries(RESPONSIVE_BREAKPOINTS).map(([name, value]) => ({
    key: name,
    label: name,
    value: `${value}px`
  }));

  return {
    id: "responsive",
    name: "Responsive",
    importCode: 'import { useResponsive, RESPONSIVE_BREAKPOINTS } from "@ShKit";',
    description:
      "Responsive API для runtime-проверок ширины viewport и единых breakpoint constants. Используется для shell-сценариев, compact views и mobile overlay behavior.",    props: [
      { name: "RESPONSIVE_BREAKPOINTS.XS", type: "360", description: "Самые узкие экраны." },
      { name: "RESPONSIVE_BREAKPOINTS.S", type: "576", description: "Mobile threshold; используется для isMobile." },
      { name: "RESPONSIVE_BREAKPOINTS.M", type: "768", description: "Tablet threshold; используется для isTab." },
      { name: "RESPONSIVE_BREAKPOINTS.L", type: "1024", description: "Horizontal tablet threshold; используется для isHorizontalTab." },
      { name: "RESPONSIVE_BREAKPOINTS.XL", type: "1600", description: "Wide desktop threshold; используется для isWide." },
      { name: "useResponsive()", type: "{ isXs, isMobile, isTab, isHorizontalTab, isWide }", description: "React hook поверх matchMedia с SSR-safe fallback." }
    ],    usageCode: `const { isMobile, isTab } = useResponsive();

<Button size={isMobile ? "sm" : "md"}>
  {isTab ? "Save" : "Save changes"}
</Button>`,
    preview: (
      <Card className={styles.previewNarrow} padding="sm" title="Breakpoints" subtitle="Runtime hook + shared constants">
        <Description columns={2} minColumnWidth={92} items={breakpointItems} />
        <div className={styles.previewStack}>
          <Tag tone="info">isMobile: max-width S</Tag>
          <Tag tone="default">isWide: min-width XL</Tag>
        </div>
      </Card>
    )
  };
}
