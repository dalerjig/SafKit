import { SegmentedControl } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getSegmentedControlDoc = ({
  docSegment,
  setDocSegment,
  styles
}: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "segmented-control",
    name: "SegmentedControl",
    importCode: 'import { SegmentedControl } from "@ShKit";',
    description:
      "Переключатель режимов и вкладок. Заменяет ShRadioGroup и используется в панелях, модалках и toolbar-настройках.",    props: [
      { name: "options", type: "Array<{ label: string; value: T; disabled?: boolean }>", description: "Список сегментов." },
      { name: "value", type: "T", description: "Текущее выбранное значение." },
      { name: "onChange", type: "(value: T) => void", description: "Вызывается при выборе сегмента." },
      { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Растягивает контрол на всю ширину контейнера." },
      { name: "scrollable", type: "boolean", defaultValue: "true", description: "Разрешает горизонтальный scroll, когда сегменты не помещаются." },
          { name: "equalItemWidth", type: "boolean", defaultValue: "false", description: "Отображает сегменты с одинаковой шириной." }
    ],    usageCode: `<SegmentedControl
  fullWidth
  scrollable
  value={visibility}
  onChange={setVisibility}
  options={[
    { label: "Публичные", value: "public" },
    { label: "Мои заметки", value: "private" }
  ]}
/>`,
    preview: (
      <div className={styles.previewStack}>
        <SegmentedControl
          fullWidth
          value={docSegment}
          onChange={setDocSegment}
          options={[
            { label: "Публичные", value: "public" },
            { label: "Мои заметки", value: "private" }
          ]}
        />
        <div className={styles.previewNarrow}>
          <SegmentedControl
            fullWidth
            scrollable
            value="terrain"
            onChange={() => undefined}
            options={[
              { label: "Ортофотоплан", value: "ortho" },
              { label: "Цифровая модель рельефа", value: "terrain" },
              { label: "План-факт аналитика", value: "analytics" },
              { label: "Исполнительная схема", value: "scheme" }
            ]}
          />
        </div>
      </div>
    )
  };
}
