import { Card, Splitter } from "../../components";
import type {
  ComponentDoc,
  ComponentDocPreviewContext,
} from "../../componentDocs";

export const getSplitterDoc =
  ({}: ComponentDocPreviewContext): ComponentDoc => {
    return {
      id: "splitter",
      name: "Splitter",
      importCode: 'import { Splitter } from "@ShKit";',
      description:
        "Resizable split layout для table + gantt, sidebar + content и других dual-pane экранов без antd Splitter.",      props: [
        {
          name: "children",
          type: "ReactNode | Splitter.Panel[]",
          description:
            "Можно передавать обычные div/ReactNode или Splitter.Panel.",
        },
        {
          name: "layout",
          type: '"horizontal" | "vertical"',
          defaultValue: '"horizontal"',
          description:
            "Направление разделения. layout имеет приоритет над vertical.",
        },
        {
          name: "vertical",
          type: "boolean",
          defaultValue: "false",
          description: 'Shorthand для layout="vertical".',
        },
        {
          name: "onResize/onResizeEnd",
          type: "(sizes: number[]) => void",
          description: "Размеры панелей в px во время/после drag.",
        },
        {
          name: "Splitter.Panel.defaultSize",
          type: "number | string",
          description: 'Стартовый размер: 320 или "40%".',
        },
        {
          name: "Splitter.Panel.min/max",
          type: "number | string",
          description: "Ограничения resize для панели.",
        },
      ],      usageCode: `<Splitter className={styles.splitter}>
  <div>
    <ShTableShKit ... />
  </div>
  <div>
    <ShGantt ... />
  </div>
</Splitter>

<Splitter vertical style={{ height: 320 }}>
  <Splitter.Panel defaultSize="35%" min="20%">
    <Card padding="sm" title="Top">Table</Card>
  </Splitter.Panel>
  <Splitter.Panel min="30%">
    <Card padding="sm" title="Bottom">Gantt</Card>
  </Splitter.Panel>
</Splitter>`,
      preview: (
        <Splitter style={{ height: 280, width: "100%" }}>
          <Card padding="sm" title="Таблица">
            Левая панель для ShTable / nested rows.
          </Card>
          <Card padding="sm" title="Gantt">
            Правая панель для timeline. Потяни divider между панелями.
          </Card>
        </Splitter>
      ),
    };
  };
