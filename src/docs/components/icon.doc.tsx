import { Icon, type IconName } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const iconNames: IconName[] = [
  "notes",
  "screen",
  "draw",
  "measure",
  "table",
  "dashboard",
  "folder",
  "file",
  "menu",
  "more",
  "pin",
  "close"
];

export const getIconDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "icon",
    name: "Icon",
    importCode: 'import { Icon } from "@ShKit";',
    description:
      "Wrapper для выбора иконки по name. Полный searchable каталог доступен на отдельной странице Icons.",    props: [
      { name: "name", type: "IconName", description: "Имя иконки из встроенного набора." },
      { name: "size", type: "number", defaultValue: "20", description: "Ширина и высота SVG." },
      { name: "title", type: "string", description: "Accessible title, если иконка сама несет смысл." },
      { name: "strokeWidth", type: "number", defaultValue: "2.6", description: "Толщина stroke, можно тонко подстроить под плотный UI." }
    ],    usageCode: `<Button square icon={<Icon name="menu" />} aria-label="Меню" />
<Sidebar items={[{ id: "notes", label: "Заметки", icon: <Icon name="notes" /> }]} />`,
    preview: (
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))", width: "100%" }}>
        {iconNames.map(name => (
          <div
            key={name}
            style={{
              alignItems: "center",
              background: "#fff",
              border: "1px solid #d9d8da",
              borderRadius: 8,
              color: "#103e36",
              display: "grid",
              fontSize: 12,
              fontWeight: 800,
              gap: 8,
              justifyItems: "center",
              minHeight: 76,
              padding: 10
            }}
          >
            <Icon name={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    )
  };
}
