import { Button, Icon, Tooltip } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getTooltipDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "tooltip",
    name: "Tooltip",
    importCode: 'import { Tooltip } from "@ShKit";',
    description:
      "Легкая подсказка для icon-only кнопок, collapsed sidebar и overflow triggers. Popup рендерится в portal и не ломает layout.",    props: [
      { name: "content", type: "ReactNode", description: "Содержимое подсказки." },
      { name: "placement", type: '"top" | "right" | "bottom" | "left"', defaultValue: '"top"', description: "Позиция подсказки." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Отключить подсказку." },
      { name: "delay", type: "number", defaultValue: "250", description: "Задержка открытия в мс." },
      { name: "className", type: "string", description: "Класс обёртки триггера." },
      { name: "popupClassName", type: "string", description: "Класс всплывающей подсказки." }
    ],    usageCode: `<Tooltip content="Инструменты" placement="bottom" popupClassName={styles.tooltip}>
  <Button square icon={<Icon name="menu" />} aria-label="Инструменты" />
</Tooltip>`,
    preview: (
      <div className={styles.previewStack}>
        <Tooltip content="Сохранить экран" placement="right">
          <Button square icon={<Icon name="screen" />} aria-label="Сохранить экран" />
        </Tooltip>
      </div>
    )
  };
}
