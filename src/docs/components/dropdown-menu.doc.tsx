import { Button, Dropdown, Menu } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getDropdownMenuDoc = (_context: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "dropdown-menu",
    name: "Dropdown + Menu",
    importCode: 'import { Dropdown, Menu } from "@ShKit";',
    description:
      "Пара primitives для действий таблицы, explorer, toolbar и контекстных меню без Ant Design.",
    props: [
      { name: "trigger", type: "ReactNode", description: "Элемент, по которому открывается dropdown." },
      {
        name: "align",
        type: '"start" | "end"',
        defaultValue: "start",
        description:
          "Горизонтальная привязка панели к триггеру (fixed left/minWidth на portal). start — левый край панели = левый край триггера; end — правый = правый, с clamp к viewport."
      },
      { name: "offsetX", type: "number", defaultValue: "0", description: "Сдвиг панели по горизонтали в px после align (положительный — вправо), с clamp к viewport." },
      { name: "offsetY", type: "number", defaultValue: "0", description: "Сдвиг по вертикали в px (положительный — вниз), для панели над и под триггером." },
      {
        name: "matchTriggerWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Ширина панели совпадает с шириной триггера (без min 160px и расширения под контент)."
      },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Событие открытия/закрытия." },
      { name: "items", type: "MenuItem[]", description: "Пункты меню: key, label, icon, selected, disabled, danger." },
      { name: "onSelect", type: "(key, item) => void", description: "Выбор пункта меню." }
    ],
    usageCode: `<Dropdown trigger={<Button>Закрепить</Button>}>
  <Menu
    items={[{ key: "none", label: "Не задано", selected: true }]}
    onSelect={setPinnedColumn}
  />
</Dropdown>`,
    preview: (
      <Dropdown trigger={<Button variant="outline">Открыть меню</Button>}>
        <Menu
          items={[
            { key: "none", label: "Не задано", selected: true },
            { key: "name", label: "Название" },
            { key: "area", label: "Площадь" },
            { key: "remove", label: "Удалить", danger: true }
          ]}
        />
      </Dropdown>
    )
  };
};
