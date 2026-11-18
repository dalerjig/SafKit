import { Button, Collapse, Flow, Tag } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getCollapseDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "collapse",
    name: "Collapse",
    importCode: 'import { Collapse } from "@ShKit";',
    description: "Раскрываемые секции для details, фильтров и compact settings без Ant Design Collapse.",    props: [
      { name: "items", type: "CollapseItem[]", description: "Список раскрываемых секций." },
      { name: "CollapseItem.id", type: "string", description: "Стабильный id секции для activeIds/defaultActiveIds." },
      { name: "CollapseItem.title", type: "ReactNode", description: "Заголовок секции в header." },
      { name: "CollapseItem.content", type: "ReactNode", description: "Контент раскрытой панели." },
      { name: "CollapseItem.disabled", type: "boolean", defaultValue: "false", description: "Отключает раскрытие секции." },
      { name: "CollapseItem.actions", type: "ReactNode", description: "Дополнительные действия справа в header, например Tag или Button." },
      { name: "activeIds", type: "string[]", description: "Controlled открытые секции." },
      { name: "defaultActiveIds", type: "string[]", description: "Uncontrolled начальное состояние." },
      { name: "accordion", type: "boolean", defaultValue: "false", description: "Открыта только одна секция." },
      { name: "onChange", type: "(activeIds) => void", description: "Изменение открытых секций." }
    ],    usageCode: `<Collapse
  defaultActiveIds={["filters"]}
  items={[
    {
      id: "filters",
      title: "Фильтры",
      actions: <Tag size="sm" tone="info">3</Tag>,
      content: <Filters />
    },
    {
      id: "details",
      title: "Детали",
      content: <Details />
    }
  ]}
/>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Collapse
          defaultActiveIds={["filters"]}
          items={[
            {
              id: "filters",
              title: "Фильтры",
              actions: <Tag size="sm" tone="info">3</Tag>,
              content: "Статус, ответственный и период съемки применены к текущей выборке."
            },
            {
              id: "details",
              title: "Технические детали",
              content: "GET /api/objects?site=demo-site -> 200, cache hit, 128 rows"
            },
            {
              id: "disabled",
              title: "Недоступная секция",
              disabled: true,
              content: "Не показывается"
            }
          ]}
        />
        <Collapse
          accordion
          defaultActiveIds={["one"]}
          items={[
            { id: "one", title: "Accordion one", content: <Button size="sm">Action</Button> },
            { id: "two", title: "Accordion two", content: "Открытие этой секции закроет предыдущую." }
          ]}
        />
      </Flow>
    )
  };
}
