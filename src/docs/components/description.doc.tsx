import { Alert, Badge, Card, Description, Flow, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const objectItems = [
  { key: "status", label: "Статус", value: <Tag tone="success">Готово</Tag> },
  { key: "type", label: "Тип", value: "Котлован" },
  { key: "area", label: "Площадь", value: "1 420 м2" },
  { key: "source", label: "Источник", value: "Ортофото 18.05" },
  { key: "quality", label: "Проверка", value: <Badge tone="warning" text="2 замечания" /> },
  { key: "owner", label: "Ответственный", value: "Геодезия" },
  { key: "comment", label: "Комментарий", value: "Требуется повторная проверка южной границы перед публикацией.", span: 2 },
  { key: "contractor", label: "Подрядчик" }
];

export const getDescriptionDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "description",
    name: "Description",
    importCode: 'import { Description } from "@ShKit";',
    description: "Описание текста и label/value свойств без локального ShDescription и antd Descriptions.",    props: [
      { name: "title", type: "ReactNode", description: "Опциональный заголовок блока." },
      { name: "text/children", type: "ReactNode", description: "Свободный многострочный текст описания." },
      { name: "items", type: "DescriptionItem[]", description: "Список свойств для label/value grid." },
      { name: "DescriptionItem.key", type: "string", description: "Стабильный id строки свойства." },
      { name: "DescriptionItem.label", type: "ReactNode", description: "Подпись свойства: текст, счетчик, icon+text или другой ReactNode." },
      { name: "DescriptionItem.value", type: "ReactNode", description: "Значение свойства: строка, число, Badge, Tag, ссылка, кнопка или любой ReactNode. Пустое значение заменяется на emptyText." },
      { name: "DescriptionItem.span", type: "number", description: "Сколько колонок занимает item внутри grid." },
      { name: "columns", type: "number | CSS grid-template-columns", defaultValue: "2", description: "Количество колонок или кастомный grid template." },
      { name: "minColumnWidth", type: "number", description: "Включает responsive auto-fit сетку." },
      { name: "bordered", type: "boolean", defaultValue: "false", description: "Оформляет блок как bordered properties surface." },
      { name: "density", type: '"regular" | "compact"', defaultValue: '"regular"', description: "Плотность текста и отступов." },
      { name: "emptyText", type: "ReactNode", defaultValue: '"Нет описания"', description: "Fallback для пустого блока или пустых значений." },
      { name: "maxLines", type: "number", description: "Ограничивает свободный текст по числу строк." }
    ],    usageCode: `const objectItems = [
  { key: "status", label: "Статус", value: <Tag tone="success">Готово</Tag> },
  { key: "type", label: "Тип", value: "Котлован" },
  { key: "area", label: "Площадь", value: "1 420 м2" },
  { key: "source", label: "Источник", value: "Ортофото 18.05" },
  { key: "quality", label: "Проверка", value: <Badge tone="warning" text="2 замечания" /> },
  { key: "owner", label: "Ответственный", value: "Геодезия" },
  { key: "comment", label: "Комментарий", value: "Требуется повторная проверка южной границы перед публикацией.", span: 2 },
  { key: "contractor", label: "Подрядчик" }
];

<Card title="Карточка объекта" subtitle="Description хорошо живет внутри Card как блок свойств">
  <Description
    title="Описание задачи"
    text="Проверить контуры после последней съемки и отметить расхождения перед публикацией слоя."
    maxLines={2}
  />
</Card>

<Card padding="sm">
  <Description
    title="Параметры объекта"
    bordered
    minColumnWidth={160}
    items={objectItems}
    emptyText="Не назначен"
  />
</Card>

<Description
  title="Compact"
  bordered
  density="compact"
  columns={3}
  items={objectItems.slice(0, 3)}
/>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Alert compact variant="info" title="ReactNode значения">
          В label и value можно передавать строки, счетчики, Tag, Badge, ссылки, кнопки и другие компоненты.
        </Alert>
        <Card title="Карточка объекта" subtitle="Description хорошо живет внутри Card как блок свойств">
          <Description
            title="Описание задачи"
            text="Проверить контуры после последней съемки и отметить расхождения перед публикацией слоя."
            maxLines={2}
          />
        </Card>
        <Card padding="sm">
          <Description title="Параметры объекта" bordered minColumnWidth={160} items={objectItems} emptyText="Не назначен" />
        </Card>
        <Description title="Compact" bordered density="compact" columns={3} items={objectItems.slice(0, 3)} />
      </Flow>
    )
  };
}
