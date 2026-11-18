import { useState } from "react";
import { TimePicker } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getTimePickerDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "time-picker",
    name: "TimePicker",
    importCode: 'import { TimePicker } from "@ShKit";',
    description:
      "Кастомный controlled time picker с отдельными select для часов и минут. Подходит как самостоятельный контрол и как встроенный выбор времени внутри DateInput.",
    props: [
      { name: "value", type: "string", description: "Текущее время в формате HH:mm." },
      { name: "onChange", type: "(value: string) => void", description: "Возвращает новое время в формате HH:mm." },
      { name: "minuteStep", type: "number", defaultValue: "1", description: "Шаг минут. Например 15 даст 00/15/30/45." },
      { name: "label", type: "ReactNode", defaultValue: "локализованная подпись", description: "Подпись слева от селектов. По умолчанию берется из ShKitProvider messages.timePicker.label; можно убрать через null." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Отключает оба select." },
      { name: "withDivider", type: "boolean", defaultValue: "false", description: "Добавляет верхний divider для встраивания в popup DateInput." },
      { name: "className", type: "string", description: "Класс для внешнего контейнера." }
    ],
    usageCode: `const [time, setTime] = useState("09:30");

<TimePicker
  value={time}
  minuteStep={15}
  onChange={setTime}
/>`,
    preview: (
      <div className={styles.previewNarrow} style={{ display: "grid", gap: 12 }}>
        <TimePickerPreview />
        <TimePicker value="18:45" minuteStep={15} onChange={() => undefined} disabled />
      </div>
    )
  };
};

const TimePickerPreview = () => {
  const [time, setTime] = useState("09:30");

  return <TimePicker value={time} minuteStep={15} onChange={setTime} />;
};
