import { Flow, Skeleton } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getSkeletonDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "skeleton",
    name: "Skeleton",
    importCode: 'import { Skeleton } from "@ShKit";',
    description: "Плейсхолдеры загрузки для текста, строк, карточек и таблиц без Ant Design Skeleton.",    props: [
      { name: "variant", type: '"text" | "row" | "card" | "table"', defaultValue: '"text"', description: "Тип плейсхолдера." },
      { name: "rows", type: "number", defaultValue: "3", description: "Количество строк/рядов." },
      { name: "width/height", type: "CSS width / height", description: "Размер root skeleton." }
    ],    usageCode: `<Skeleton variant="text" rows={3} />
<Skeleton variant="table" rows={4} />`,
    preview: (
      <Flow className={styles.previewNarrow} gap={14}>
        <Skeleton variant="text" rows={3} />
        <Skeleton variant="row" rows={2} />
        <Skeleton variant="card" />
        <Skeleton variant="table" rows={4} />
      </Flow>
    )
  };
}
