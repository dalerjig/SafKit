import { Breadcrumbs } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getBreadcrumbsDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "breadcrumbs",
    name: "Breadcrumbs",
    importCode: 'import { Breadcrumbs } from "@ShKit";',
    description:
      "Навигационная цепочка для папок, файловых панелей и контекстов. Длинные пути схлопываются в середине.",    props: [
      { name: "items", type: "BreadcrumbItem[]", description: "Элементы пути: id, label, disabled." },
      { name: "maxItems", type: "number", defaultValue: "4", description: "Сколько элементов оставить до collapse." },
      { name: "separator", type: "ReactNode", defaultValue: '"/"', description: "Разделитель." },
      { name: "onSelect", type: "(id, item) => void", description: "Переход по элементу пути." }
    ],    usageCode: `<Breadcrumbs
  items={[
    { id: "root", label: "/" },
    { id: "public", label: "Публичные" },
    { id: "folder", label: "Панорамы" }
  ]}
  onSelect={openFolder}
/>`,
    preview: (
      <div className={styles.previewNarrow} style={{ display: "grid", gap: 14 }}>
        <Breadcrumbs
          items={[
            { id: "root", label: "/" },
            { id: "public", label: "Публичные" },
            { id: "year", label: "2026" },
            { id: "month", label: "Май" },
            { id: "folder", label: "Панорамы" }
          ]}
        />
        <Breadcrumbs
          maxItems={3}
          items={[
            { id: "root", label: "/" },
            { id: "customer", label: "Демо-заказчик / Участок 1" },
            { id: "public", label: "Публичные" },
            { id: "folder", label: "техника строительная 2025" }
          ]}
        />
      </div>
    )
  };
}
