import { Button, Divider, Flow, Input, Switch, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getLayoutPrimitivesDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "layout-primitives",
    name: "Flow / Divider",
    importCode: 'import { Divider, Flow } from "@ShKit";',
    description:
      "Базовые composition primitives для форм, модалок, панелей, docs и compact tool surfaces. Это не Form layout и не application shell.",    props: [
      { name: "mode", type: '"vertical" | "horizontal" | "grid"', defaultValue: '"vertical"', description: "Режим раскладки." },
      { name: "gap", type: "space token | CSS gap", defaultValue: "8 | 12", description: "Отступ между дочерними элементами." },
      { name: "align", type: "CSS align-items", description: "Выравнивание по поперечной оси." },
      { name: "justify", type: "CSS justify-content", description: "Распределение элементов." },
      { name: "fullWidth", type: "boolean", description: "Растягивает primitive на 100% ширины." },
      { name: "wrap", type: "boolean", defaultValue: "false", description: "Разрешает перенос horizontal элементов." },
      { name: "columns", type: "number | CSS grid-template-columns", defaultValue: "2", description: "Сетка с фиксированным числом колонок или кастомным template." },
      { name: "minColumnWidth", type: "number", description: "Включает auto-fit responsive grid." },
      { name: "Divider.orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Ориентация разделителя." },
      { name: "Divider.textAlign", type: '"start" | "center" | "end"', defaultValue: '"center"', description: "Позиция текста внутри horizontal divider." },
      { name: "Divider.inset", type: "boolean", defaultValue: "false", description: "Добавляет внутренний отступ от краев контейнера." }
    ],    usageCode: `<Flow gap={16}>
  <Flow mode="grid" minColumnWidth={220}>
    <Input label="Название" />
    <Input label="Код" />
  </Flow>
  <Divider>Действия</Divider>
  <Flow mode="horizontal" wrap justify="space-between">
    <Switch label="Активно" />
    <Flow mode="horizontal" wrap gap={8} fullWidth={false}>
      <Button variant="secondary">Отмена</Button>
      <Button variant="primary">Сохранить</Button>
    </Flow>
  </Flow>
</Flow>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={16}>
        <Flow mode="grid" minColumnWidth={180} gap={12}>
          <Input label="Название" defaultValue="Котлован 01" />
          <Input label="Код" defaultValue="EX-01" />
        </Flow>
        <Divider textAlign="start">Действия</Divider>
        <Flow mode="horizontal" wrap justify="space-between">
          <Switch label="Активно" defaultChecked />
          <Flow mode="horizontal" wrap gap={8} fullWidth={false}>
            <Button size="sm" variant="secondary">Отмена</Button>
            <Button size="sm" variant="primary">Сохранить</Button>
          </Flow>
        </Flow>
        <Flow mode="horizontal" gap={12} fullWidth={false}>
          <Tag tone="info">Left</Tag>
          <Divider orientation="vertical" />
          <Tag tone="success">Right</Tag>
        </Flow>
      </Flow>
    )
  };
}
