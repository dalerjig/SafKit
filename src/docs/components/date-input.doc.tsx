import { DateInput, DateRangeInput } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getDateInputDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "date-input",
    name: "DateInput",
    importCode: 'import { DateInput, DateRangeInput } from "@ShKit";',
    description:
      "Calendar input без нативного browser picker. Поддерживает single date, range, disabledDate, presets, controlled popup и TimePicker для date-time сценариев.",    props: [
      { name: "DateInput.value/defaultValue", type: "string", description: "YYYY-MM-DD или YYYY-MM-DDTHH:mm при showTime." },
      { name: "DateInput.onChange", type: "(value: string) => void", description: "Возвращает выбранную дату или date-time строку." },
      { name: "DateInput.min/max", type: "YYYY-MM-DD", description: "Границы доступного диапазона." },
      { name: "DateInput.disabledDate", type: "(date: YYYY-MM-DD) => boolean", description: "Доменное отключение дат сверх min/max." },
      { name: "DateInput.presets", type: "{ label, value }[]", description: "Быстрый выбор даты без footer/actions." },
      { name: "DateInput.iconOnly", type: "boolean", defaultValue: "false", description: "Компактная иконка календаря без текстового поля. label задаёт доступное имя." },
      { name: "DateInput.showTime", type: "boolean", defaultValue: "false", description: "Рендерит TimePicker внутри календарного popup." },
      { name: "DateInput.minuteStep", type: "number", defaultValue: "1", description: "Шаг минут в time picker, например 15 даст 00/15/30/45." },
      { name: "DateInput.align", type: '"start" | "center" | "end"', defaultValue: '"start"', description: "Выравнивает календарный popup относительно поля." },
      { name: "DateInput.open/onOpenChange", type: "boolean / callback", description: "Controlled popup state." },
      { name: "DateRangeInput.value/defaultValue", type: "{ from: string; to: string }", description: "Диапазон дат." },
      { name: "DateRangeInput.presets", type: "{ label, value: { from, to } }[]", description: "Быстрый выбор диапазона." },
      { name: "DateRangeInput.align", type: '"start" | "center" | "end"', defaultValue: '"start"', description: "Выравнивает range popup относительно поля." },
      { name: "DateRangeInput.disabledDate", type: "(date: YYYY-MM-DD) => boolean", description: "Отключение дат внутри single-calendar range picker." }
    ],    usageCode: `<DateInput
  label="Недоступные даты — красные"
  hint="Доступны даты с 10 по 25 мая, кроме 16 и 17 мая."
  defaultValue="2026-05-18"
  min="2026-05-10"
  max="2026-05-25"
  disabledDate={date => date === "2026-05-16" || date === "2026-05-17"}
/>

<DateInput
  showTime
  minuteStep={15}
  align="end"
  value={inspectionDate}
  presets={[{ label: "Завтра", value: "2026-05-27" }]}
  disabledDate={date => date < "2026-05-01"}
  onChange={setInspectionDate}
/>

<DateRangeInput
  value={range}
  presets={[{ label: "Май", value: { from: "2026-05-01", to: "2026-05-31" } }]}
  disabledDate={date => date > "2026-05-31"}
  onChange={setRange}
/>`,
    preview: (
      <div className={styles.previewNarrow} style={{ display: "grid", gap: 12 }}>
        <DateInput
          label="Недоступные даты — красные"
          hint="Доступны даты с 10 по 25 мая, кроме 16 и 17 мая."
          defaultValue="2026-05-18"
          min="2026-05-10"
          max="2026-05-25"
          disabledDate={date => date === "2026-05-16" || date === "2026-05-17"}
        />
        <DateInput
          label="Дата и время проверки"
          defaultValue="2026-05-18T09:30"
          showTime
          minuteStep={15}
          align="end"
          presets={[
            { label: "Сегодня", value: "2026-05-26" },
            { label: "Завтра", value: "2026-05-27" }
          ]}
          disabledDate={date => date < "2026-05-01"}
        />
        <DateRangeInput
          label="Период съемки"
          defaultValue={{ from: "2026-05-01", to: "2026-05-12" }}
          presets={[
            { label: "Эта неделя", value: { from: "2026-05-25", to: "2026-05-31" } },
            { label: "Май", value: { from: "2026-05-01", to: "2026-05-31" } }
          ]}
          disabledDate={date => date > "2026-05-31"}
        />
      </div>
    )
  };
};
