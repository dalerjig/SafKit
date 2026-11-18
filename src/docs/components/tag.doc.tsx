import { Flow, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getTagDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "tag",
    name: "Tag",
    importCode: 'import { Tag } from "@ShKit";',
    description: "Метка статуса, типа или выбранного значения для аналитики, задач, Select tags и UploadList без Ant Design Tag.",    props: [
      { name: "children", type: "ReactNode", description: "Текст или содержимое tag." },
      { name: "tone", type: '"default" | "success" | "warning" | "danger" | "info"', defaultValue: '"default"', description: "Семантический тон." },
      { name: "size", type: '"sm" | "md"', defaultValue: '"md"', description: "Плотность." },
      { name: "closable", type: "boolean", defaultValue: "false", description: "Показывает close action." },
      { name: "onClose", type: "() => void", description: "Событие удаления." }
    ],    usageCode: `<Tag tone="success">Готово</Tag>
<Tag closable onClose={remove}>геодезия</Tag>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Flow mode="horizontal" wrap gap={8}>
          <Tag tone="default">Default</Tag>
          <Tag tone="success">Готово</Tag>
          <Tag tone="warning">Проверка</Tag>
          <Tag tone="danger">Ошибка</Tag>
          <Tag tone="info">Инфо</Tag>
        </Flow>
        <Flow mode="horizontal" wrap gap={8}>
          <Tag size="sm" closable>срочно</Tag>
          <Tag size="sm" tone="success" closable>геодезия</Tag>
          <Tag size="sm" tone="warning" closable>на проверке</Tag>
        </Flow>
      </Flow>
    )
  };
}
