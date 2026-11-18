import { Card, Flow, Tabs, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getTabsDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "tabs",
    name: "Tabs",
    importCode: 'import { Tabs } from "@ShKit";',
    description: "Вкладки контента для media, analytics и submenu без Ant Design Tabs. Для mode switches оставляем SegmentedControl.",    props: [
      { name: "items", type: "TabItem[]", description: "Список вкладок." },
      { name: "TabItem.id", type: "string", description: "Стабильный id вкладки для activeId/defaultActiveId." },
      { name: "TabItem.label", type: "ReactNode", description: "Подпись вкладки: текст, счетчик, Tag или другой ReactNode." },
      { name: "TabItem.content", type: "ReactNode", description: "Контент активной панели." },
      { name: "TabItem.disabled", type: "boolean", defaultValue: "false", description: "Отключает вкладку." },
      { name: "activeId", type: "string", description: "Controlled активная вкладка." },
      { name: "defaultActiveId", type: "string", description: "Uncontrolled начальная вкладка." },
      { name: "onChange", type: "(id, item) => void", description: "Событие переключения." }
    ],    usageCode: `<Tabs
  defaultActiveId="summary"
  items={[
    { id: "summary", label: "Сводка", content: <Summary /> },
    { id: "history", label: "История", content: <History /> },
    { id: "disabled", label: "Недоступно", disabled: true, content: null }
  ]}
/>`,
    preview: (
      <Flow className={styles.previewNarrow}>
        <Tabs
          defaultActiveId="summary"
          items={[
            {
              id: "summary",
              label: "Сводка",
              content: (
                <Card padding="sm" title="Сводка">
                  128 объектов, 3 требуют проверки.
                </Card>
              )
            },
            {
              id: "history",
              label: "История",
              content: (
                <Card padding="sm" title="История">
                  Последнее обновление: 18.05.2026.
                </Card>
              )
            },
            {
              id: "labels",
              label: <span>Метки <Tag size="sm" tone="warning">2</Tag></span>,
              content: (
                <Flow mode="horizontal" wrap>
                  <Tag tone="success">геодезия</Tag>
                  <Tag tone="warning">проверка</Tag>
                </Flow>
              )
            },
            { id: "disabled", label: "Недоступно", disabled: true, content: "disabled" }
          ]}
        />
      </Flow>
    )
  };
}
