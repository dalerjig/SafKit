import { Button, Popover, Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getPopoverDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "popover",
    name: "Popover",
    importCode: 'import { Popover } from "@ShKit";',
    description: "Anchored overlay для compact settings, фильтров и небольших рабочих меню без Ant Design.",    props: [
      { name: "trigger", type: "ReactNode", description: "Элемент открытия." },
      { name: "children", type: "ReactNode", description: "Содержимое floating panel." },
      { name: "open/onOpenChange", type: "boolean / callback", description: "Controlled режим." },
      { name: "className", type: "string", description: "Дополнительный класс для trigger wrapper." }
    ],    usageCode: `<Popover trigger={<Button>Фильтры</Button>}>
  <div>...</div>
</Popover>`,
    preview: (
      <div className={styles.previewStack}>
        <Popover trigger={<Button>Popover</Button>}>
          <div style={{ background: "#fff", border: "1px solid #D9D8DA", borderRadius: 8, display: "grid", gap: 10, padding: 12 }}>
            <Switch label="Показывать слой" defaultChecked />
            <Button size="sm" variant="primary">Применить</Button>
          </div>
        </Popover>
      </div>
    )
  };
}
