import { Card, Flow, Spinner } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getSpinnerDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "spinner",
    name: "Spinner",
    importCode: 'import { Spinner } from "@ShKit";',
    description: "Loading indicator для inline, centered и overlay-сценариев без Ant Design Spin.",    props: [
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Размер индикатора." },
      { name: "label", type: "ReactNode", description: "Текст рядом со spinner." },
      { name: "centered", type: "boolean", description: "Центрирует indicator по ширине контейнера." },
      { name: "overlay", type: "boolean", description: "Абсолютный overlay поверх relative-контейнера." }
    ],    usageCode: `<Spinner size="sm" label="Загрузка" />
<Spinner centered label="Загружаем данные" />`,
    preview: (
      <Flow className={styles.previewNarrow} gap={14}>
        <Flow mode="horizontal" wrap gap={14}>
          <Spinner size="sm" label="sm" />
          <Spinner size="md" label="md" />
          <Spinner size="lg" label="lg" />
        </Flow>
        <Card title="Overlay" style={{ minHeight: 120, position: "relative" }}>
          <span>Контент под loading overlay</span>
          <Spinner overlay label="Загружаем" />
        </Card>
      </Flow>
    )
  };
}
