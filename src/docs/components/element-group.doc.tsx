import { Button, ElementGroup, Icon } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getElementGroupDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "element-group",
    name: "ElementGroup",
    importCode: 'import { ElementGroup } from "@ShKit";',
    description:
      "Responsive-группа элементов. Показывает столько элементов, сколько помещается в контейнер, а остальные переносит в Dropdown с настраиваемой кнопкой.",    props: [
      { name: "items", type: "ElementGroupItem[]", description: "Элементы группы: id, element, overflowElement." },
      { name: "gap", type: "number", defaultValue: "8", description: "Расстояние между видимыми элементами." },
      { name: "overflowIcon", type: "ReactNode", defaultValue: '<Icon name="more" />', description: "Иконка стандартной overflow-кнопки." },
      { name: "overflowLabel", type: "ReactNode", defaultValue: '"Еще"', description: "aria-label стандартной overflow-кнопки." },
      { name: "renderOverflowTrigger", type: "(hiddenCount) => ReactNode", description: "Полностью кастомная кнопка раскрытия." }
    ],    usageCode: `<ElementGroup
  items={[
    { id: "draw", element: <Button icon={<Icon name="draw" />}>Рисунки</Button> },
    { id: "screen", element: <Button icon={<Icon name="screen" />}>Сохранить экран</Button> },
    { id: "measure", element: <Button icon={<Icon name="measure" />}>Измерения</Button> }
  ]}
  overflowIcon={<Icon name="more" />}
/>`,
    preview: (
      <div className={styles.previewNarrow}>
        <ElementGroup
          items={[
            { id: "draw", element: <Button icon={<Icon name="draw" />}>Рисунки</Button> },
            { id: "screen", element: <Button icon={<Icon name="screen" />}>Сохранить экран</Button> },
            { id: "measure", element: <Button icon={<Icon name="measure" />}>Измерения</Button> },
            { id: "dash", element: <Button icon={<Icon name="dashboard" />}>Дашборд</Button> }
          ]}
          overflowIcon={<Icon name="more" />}
        />
      </div>
    )
  };
}
