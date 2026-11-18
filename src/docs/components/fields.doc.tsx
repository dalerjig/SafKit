import { useMemo, useState, type ReactNode } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flow,
  Icon,
  Input,
  Mentions,
  NumberInput,
  Select,
  Textarea,
} from "../../components";
import type {
  ComponentDoc,
  ComponentDocPreviewContext,
} from "../../componentDocs";

export const getFieldsDoc = ({
  styles,
}: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "fields",
    name: "Fields",
    importCode:
      'import { Input, NumberInput, Select, Textarea, Mentions, Checkbox } from "@ShKit";',
    description:
      "Базовые form primitives для отказа от Ant Design в таблице, explorer и панелях. Они компактные, управляемые и подходят для editable cell.",
    props: [
      {
        name: "value",
        type: 'string | number | boolean | ""',
        description:
          'Controlled value. NumberInput: number ("" в store не обязателен).',
      },
      {
        name: "onChange (NumberInput)",
        type: '(value: number | "") => void',
        description:
          'Только валидное number (и повтор на blur, если введено число). Пока поле пустое или "-", ".", "0." — onChange не вызывается, store остаётся на последнем числе. На blur пустое/невалидное — сброс к value из props, в store не пишем. Буквы отбрасываются, запятая — как десятичный разделитель.',
      },
      {
        name: "size",
        type: '"xs" (Input/NumberInput) | "sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Плотность поля. Input/NumberInput также поддерживают xs (26px); sm используется в Table.",
      },
      {
        name: "height (Input/NumberInput)",
        type: 'CSSProperties["height"]',
        description: "Высота control: число в px или CSS-значение. Приоритет над size; подпись и hint в высоту не входят.",
      },
      {
        name: "weight",
        type: 'CSSProperties["fontWeight"]',
        defaultValue: "400",
        description:
          "Насыщенность текста в Input/NumberInput. 700 — прежний жирный вид.",
      },
      { name: "label", type: "ReactNode", description: "Подпись поля." },
      {
        name: "hint",
        type: "ReactNode",
        description: "Вспомогательный текст.",
      },
      {
        name: "error",
        type: "ReactNode",
        description: "Текст ошибки и error styling.",
      },
      {
        name: "prefix / suffix",
        type: "ReactNode",
        description:
          "Внутренние элементы слева/справа внутри Input; при переносе antd addonBefore/addonAfter используйте их.",
      },
      {
        name: "options",
        type: "SelectOption[]",
        description: "Список опций для Select.",
      },
      {
        name: "options[].group",
        type: "ReactNode",
        description: "Группировка опций внутри popup.",
      },
      {
        name: "renderOption",
        type: "(option, state) => ReactNode",
        description: "Кастомный вид опции в popup.",
      },
      {
        name: "renderValue",
        type: "(option | null) => ReactNode",
        description: "Кастомный вид выбранного значения.",
      },
      {
        name: "multiple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Выбор нескольких значений с отображением tags; popup остается открытым после выбора.",
      },
      {
        name: "tags",
        type: "boolean",
        defaultValue: "false",
        description:
          "Режим multiselect с добавлением пользовательских тегов; popup остается открытым после добавления.",
      },
      {
        name: "renderTag",
        type: "(option, onRemove) => ReactNode",
        description:
          "Кастомный вид выбранного tag; используйте onRemove для кнопки удаления. Аналог antd tagRender/renderTags.",
      },
      {
        name: "searchable",
        type: "boolean",
        description: "Включает поиск по label, value и description; поле поиска рендерится в control, а не в popup.",
      },
      {
        name: "matchTriggerWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Ширина popup-списка = ширина control (без min 160px).",
      },
      {
        name: "allowClear",
        type: "boolean",
        defaultValue: "false",
        description:
          "Показывает действие очистки выбранного значения, как в antd Select.",
      },
      {
        name: "onClear",
        type: "() => void",
        description: "Вызывается после очистки значения через allowClear.",
      },
      {
        name: "maxVisibleTags",
        type: "number",
        defaultValue: "3",
        description: "Сколько tags показывать в control до +N.",
      },
      {
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description: "Показывает значение без раскрытия и изменений.",
      },
      {
        name: "emptyText",
        type: "ReactNode",
        defaultValue: '"Ничего не найдено"',
        description: "Состояние пустой выдачи Select.",
      },
      {
        name: "Mentions",
        type: "value: string",
        description:
          "Textarea с popup-подсказками по trigger, например @ для ответственных.",
      },
      {
        name: "Mentions.options",
        type: "MentionOption[]",
        description:
          "Список вариантов: value, label, description, disabled, meta.",
      },
      {
        name: "Mentions.onSearch",
        type: "(query, trigger) => options | Promise<options>",
        description: "Async-поиск подсказок по текущему запросу.",
      },
    ],
    usageCode: `<Input label="Название" value={name} onChange={event => setName(event.currentTarget.value)} />
<Input label="Жирное значение" weight={700} value={name} onChange={event => setName(event.currentTarget.value)} />
<Input prefix="https://" value={host} onChange={event => setHost(event.currentTarget.value)} />
<Input label="Email" error="Введите корректный email" value={email} />
<NumberInput size="sm" value={area} onChange={setArea} />
<Select allowClear value={status} options={statusOptions} onChange={event => setStatus(event.currentTarget.value)} />
<Select
  value={assignee}
  options={users}
  renderOption={option => <UserOption user={option} />}
  renderValue={option => option ? <UserChip user={option} /> : "Выберите пользователя"}
/>
<Select
  multiple
  searchable
  values={assigneeIds}
  options={users}
  onValuesChange={setAssigneeIds}
/>
<Select
  searchable
  tags
  values={labels}
  options={labelOptions}
  onValuesChange={setLabels}
  renderTag={(option, onRemove) => <Tag closable onClose={onRemove}>{option.label}</Tag>}
/>
<Mentions value={comment} options={users} onChange={setComment} />
<Textarea label="Комментарий" />`,
    preview: (
      <div
        className={styles.previewNarrow}
        style={{ display: "grid", gap: 12 }}
      >
        <SelectDateSortStand />
        <Input
          label="Название (weight по умолчанию 400)"
          defaultValue="Котлован 01"
        />
        <Input size="xs" label="xs — 26px" defaultValue="Компактное поле" />
        <Input size="lg" height={30} type="number" label="height={30}, size=lg" defaultValue={42} />
        <Input label="weight={700}" weight={700} defaultValue="Котлован 01" />
        <Input
          label="Публичная ссылка"
          prefix="https://"
          defaultValue="demo.shtab.tech/layer/01"
        />
        <Input
          label="Email подрядчика"
          defaultValue="ivanivanov"
          error="Введите корректный email"
        />
        <NumberInput error="" label="Площадь, м" defaultValue={148.37} />
        <div style={{ width: 158 }}>
          <Select size="sm" allowClear defaultValue="2026-11-06" options={[{ value: "2026-11-06", label: "2026-11-06" }]} placeholder="Выберите дату YYYY-MM-DD" />
          <Select size="sm" allowClear options={[{ value: "2026-11-06", label: "2026-11-06" }]} placeholder="Выберите дату YYYY-MM-DD" />
        </div>
        <Select
          allowClear
          label="Статус"
          defaultValue="work"
          options={[
            {
              label: "В работе",
              value: "work",
              description: "бригада сейчас на объекте",
              tone: "success",
            },
            {
              label: "Проверка",
              value: "review",
              description: "нужна приемка",
              tone: "warning",
            },
            {
              label: "Готово",
              value: "done",
              description: "можно закрывать",
              tone: "default",
            },
          ]}
        />
        <Select
          matchTriggerWidth
          label="matchTriggerWidth — popup не шире control"
          defaultValue="work"
          options={[
            { label: "В работе с очень длинным текстом опции", value: "work" },
            { label: "Проверка", value: "review" },
          ]}
        />
        <Select
          label="Ответственный"
          defaultValue="coordinator"
          options={[
            {
              label: "Координатор проекта",
              value: "coordinator",
              group: "Команда",
              description: "геодезия и проверки",
              icon: "KP",
            },
            {
              label: "Инженер контроля",
              value: "inspector",
              group: "Команда",
              description: "стройконтроль",
              icon: "IK",
            },
            {
              label: "Демо-заказчик / Участок 1",
              value: "demo-customer",
              group: "Заказчики",
              description: "заказчик",
              icon: "DZ",
            },
          ]}
          renderOption={(option) => (
            <span
              style={{
                alignItems: "center",
                display: "grid",
                gap: 8,
                gridTemplateColumns: "28px minmax(0, 1fr)",
              }}
            >
              <strong
                style={{
                  alignItems: "center",
                  background: "#103E36",
                  borderRadius: 6,
                  color: "#fff",
                  display: "inline-flex",
                  fontSize: 10,
                  height: 28,
                  justifyContent: "center",
                  width: 28,
                }}
              >
                {option.icon}
              </strong>
              <span style={{ display: "grid", minWidth: 0 }}>
                <span>{option.label}</span>
                <small style={{ color: "#7C7C82" }}>{option.description}</small>
              </span>
            </span>
          )}
        />
        <Select
          searchable
          allowClear
          label="Поиск в control (searchable)"
          defaultValue="coordinator"
          options={[
            { label: "Координатор проекта", value: "coordinator", description: "геодезия и проверки" },
            { label: "Инженер контроля", value: "inspector", description: "стройконтроль" },
            { label: "Демо-заказчик / Участок 1", value: "demo-customer", description: "заказчик" }
          ]}
        />
        <Select
          defaultValues={["coordinator", "inspector"]}
          options={[
            { label: "Координатор проекта", value: "coordinator" },
            { label: "Инженер контроля", value: "inspector" },
            { label: "Демо-заказчик / Участок 1", value: "demo-customer" },
          ]}
        />
        <Select
          allowClear
          tags
          label="Теги"
          defaultValues={["срочно", "геодезия"]}
          options={[
            { label: "срочно", value: "срочно" },
            { label: "геодезия", value: "геодезия" },
            { label: "выемка", value: "выемка" },
            { label: "насыпь", value: "насыпь" },
          ]}
        />
        <Checkbox label="Показывать на карте" defaultChecked />
        <Mentions
          label="Комментарий с упоминанием"
          defaultValue="Проверьте отметки после съемки @"
          options={[
            {
              label: "Координатор проекта",
              value: "coordinator",
              description: "геодезия и проверки",
            },
            {
              label: "Инженер контроля",
              value: "inspector",
              description: "стройконтроль",
            },
            {
              label: "Демо-заказчик",
              value: "customer",
              description: "команда заказчика",
            },
          ]}
        />
        <Textarea
          label="Комментарий"
          defaultValue="Нужно проверить отметки после следующей съемки."
        />
      </div>
    ),
  };
};

const views = [
  { id: "pit-01", name: "Котлован 01", createdAt: "2026-03-12" },
  { id: "road-02", name: "Ось дороги", createdAt: "2026-05-04" },
  { id: "scan-03", name: "Скан откоса", createdAt: "2026-01-18" }
];

const formatViewDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year.slice(2)}`;
};

const viewOptionLabel = (name: string, createdAt: string): ReactNode => (
  <span style={{ alignItems: "center", display: "flex", flex: 1, gap: 8, justifyContent: "space-between", minWidth: 0, width: "100%" }}>
    <span style={{ flex: "1 1 0", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
    <Badge size="sm" text={formatViewDate(createdAt)} tone="beige" />
  </span>
);

const SelectDateSortStand = () => {
  const [viewId, setViewId] = useState(views[0].id);
  const [sortDesc, setSortDesc] = useState(true);
  const options = useMemo(
    () =>
      [...views]
        .sort((a, b) => (Date.parse(a.createdAt) - Date.parse(b.createdAt)) * (sortDesc ? -1 : 1))
        .map(view => ({ value: view.id, label: viewOptionLabel(view.name, view.createdAt) })),
    [sortDesc]
  );

  return (
    <Flow mode="vertical" gap={4}>
      <span style={{ fontSize: 12, fontWeight: 700 }}>Select + сорт по дате</span>
      <Flow mode="horizontal" gap={4} align="center">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Select
            value={viewId}
            options={options}
            placeholder="Таблица"
            onValueChange={setViewId}
            renderValue={option => (option ? option.label : null)}
            renderOption={option => option.label}
          />
        </div>
        <Button
          size="sm"
          square
          variant="secondary"
          icon={<Icon name="md-calendar-today" size={20} />}
          tooltip="Сортировка по дате"
          aria-label="Сортировка по дате"
          onClick={() => setSortDesc(desc => !desc)}
          onPointerDownCapture={event => event.stopPropagation()}
          onMouseDown={event => event.preventDefault()}
        />
      </Flow>
    </Flow>
  );
};
