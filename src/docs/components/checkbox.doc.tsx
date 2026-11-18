import { Checkbox } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getCheckboxDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "checkbox",
    name: "Checkbox",
    importCode: 'import { Checkbox } from "@ShKit";',
    description: "Базовый checkbox без Ant Design для таблиц, фильтров, explorer и boolean editable cells.",    props: [
      { name: "checked", type: "boolean", description: "Controlled checked state." },
      { name: "onChange", type: "ChangeEventHandler<HTMLInputElement>", description: "Событие изменения." },
      { name: "label", type: "ReactNode", description: "Текст или узел рядом с checkbox." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Отключенное состояние." }
    ],    usageCode: `<Checkbox checked={visible} onChange={toggle} label="Площадь" />`,
    preview: (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox defaultChecked label="Площадь" />
        <Checkbox label="Периметр" />
        <Checkbox disabled label="Скрытый столбец" />
      </div>
    )
  };
}
