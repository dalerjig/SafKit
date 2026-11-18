import { Badge, Flow } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const badgePaletteTones = ["neutral", "grey", "dark", "green", "lime", "orange", "red", "beige", "white", "black", "transparent"] as const;

export const getBadgeDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "badge",
    name: "Badge",
    importCode: 'import { Badge } from "@ShKit";',
    description: "Компактный счетчик или status dot для списков, вкладок, меню и counters без Ant Design Badge.",    props: [
      { name: "count", type: "number", description: "Числовой счетчик." },
      { name: "text", type: "ReactNode", description: "Текстовый badge." },
      { name: "dot", type: "boolean", defaultValue: "false", description: "Показывает status dot." },
      { name: "tone", type: badgePaletteTones.map(tone => `"${tone}"`).join(" | "), defaultValue: '"neutral"', description: "Палитровый тон badge. Старые default/success/warning/danger/info остаются алиасами для совместимости." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Размер текстового badge или status dot." },
      { name: "fontWeight", type: "number", defaultValue: "900", description: "Насыщенность шрифта. Например, 500 для менее жирного текста. Не влияет на status dot." },
      { name: "maxCount", type: "number", defaultValue: "99", description: "Переполнение счетчика." },
      { name: "showZero", type: "boolean", defaultValue: "false", description: "Показывать 0." }
    ],    usageCode: `<Badge count={128} maxCount={99} tone="dark" />
<Badge dot tone="lime" />
<Badge text="Полигон" tone="beige" />
<Badge text="Активно" tone="green" size="lg" />
<Badge text="Полигон" tone="beige" fontWeight={500} />`,
    preview: (
      <Flow className={styles.previewNarrow} gap={14}>
        <Flow mode="horizontal" wrap gap={8}>
          <Badge count={0} showZero />
          <Badge count={7} />
          <Badge count={128} maxCount={99} tone="dark" />
          <Badge text="Активно" tone="green" />
          <Badge text="Полигон" tone="beige" />
        </Flow>
        <Flow mode="horizontal" wrap gap={8}>
          <Badge text="sm" size="sm" tone="grey" />
          <Badge text="md" size="md" tone="grey" />
          <Badge text="lg" size="lg" tone="grey" />
        </Flow>
        <Flow mode="horizontal" wrap gap={8}>
          <Badge text="Шрифт 900" tone="beige" />
          <Badge text="Шрифт 500" tone="beige" fontWeight={500} />
        </Flow>
        <Flow mode="horizontal" wrap gap={8}>
          {badgePaletteTones.map(tone => (
            <Badge key={tone} tone={tone} text={tone} />
          ))}
        </Flow>
        <Flow mode="horizontal" wrap gap={10}>
          {badgePaletteTones.map(tone => (
            <Badge key={tone} dot tone={tone} text={tone} />
          ))}
        </Flow>
      </Flow>
    )
  };
}
