import { RadioGroup } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getRadioGroupDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "radio-group",
    name: "RadioGroup",
    importCode: 'import { RadioGroup } from "@ShKit";',
    description: "Выбор одного варианта для настроек, фильтров и modal forms.",    props: [
      { name: "options", type: "RadioOption[]", description: "Варианты: label, value, description, disabled." },
      { name: "value", type: "string | number", description: "Текущее значение." },
      { name: "direction", type: '"horizontal" | "vertical"', defaultValue: '"vertical"', description: "Раскладка вариантов." },
      { name: "onChange", type: "(value, option) => void", description: "Изменение значения." }
    ],    usageCode: `<RadioGroup
  value={mode}
  onChange={setMode}
  options={[
    { label: "Публичные", value: "public" },
    { label: "Мои", value: "private" }
  ]}
/>`,
    preview: (
      <div className={styles.previewNarrow}>
        <RadioGroup
          value="public"
          options={[
            { label: "Публичные", value: "public", description: "видно всем пользователям" },
            { label: "Мои", value: "private", description: "личная рабочая зона" }
          ]}
        />
      </div>
    )
  };
}
