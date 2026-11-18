import { Button, CloseButton, Icon } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getButtonDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "button",
    name: "Button",
    importCode: 'import { Button } from "@ShKit";',
    description:
      "Основной командный компонент. Закрывает сценарии ShButton: текстовые кнопки, кнопки с иконками, loading, disabled и icon-only режим.",    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
        defaultValue: '"outline"',
        description: "Визуальная роль кнопки."
      },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Высота, отступы и размер текста." },
      { name: "icon", type: "ReactNode", description: "Иконка перед текстом." },
      { name: "trailingIcon", type: "ReactNode", description: "Иконка после текста." },
      { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Нативный тип кнопки; submit задавайте явно или используйте SubmitButton." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Показывает индикатор и блокирует кнопку." },
      { name: "square", type: "boolean", defaultValue: "false", description: "Icon-only режим со стабильной шириной." },
      { name: "tooltip", type: "ReactNode", description: "Встроенный Tooltip для кнопки." },
      { name: "tooltipPlacement", type: '"top" | "right" | "bottom" | "left"', defaultValue: '"top"', description: "Позиция встроенного Tooltip." },
      { name: "tooltipClassName", type: "string", description: "Класс всплывающей подсказки." },
      { name: "tooltipTriggerClassName", type: "string", description: "Класс обёртки триггера Tooltip." }
    ],    usageCode: `<Button variant="primary" icon={<Icon name="plus" />}>Создать</Button>
<Button square icon={<Icon name="measure" />} tooltip="Измерения" />
<Button variant="secondary">Сохранить</Button>
<CloseButton />`,
    preview: (
      <div className={styles.previewStack}>
        <Button variant="primary" icon={<Icon name="plus" />}>Создать</Button>
        <Button variant="secondary">Сохранить</Button>
        <Button variant="outline" icon={<Icon name="measure" />}>Измерения</Button>
        <Button square icon={<Icon name="measure" />} tooltip="Измерения" tooltipPlacement="bottom" />
        <CloseButton />
        <Button variant="danger">Удалить</Button>
        <Button loading>Сохранение</Button>
      </div>
    )
  };
}
