import { useMemo, useState } from "react";
import { style } from "typestyle";
import { Badge, Button, Filters, Flow, Tag, applyFilters } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import type { FilterField, FilterRule } from "../../components";
import { FilterOperator } from "../../components";
import { color, radius, space } from "../../tokens";

type WorkItem = {
  id: string;
  title: string;
  status: "Новая" | "В работе" | "Проверка" | "Готово";
  owner: "Анна" | "Илья" | "Мария";
  area: number;
  dueDate: string;
  archived: boolean;
};

const fields: FilterField[] = [
  { key: "title", label: "Название", type: "string" },
  {
    key: "status",
    label: "Статус",
    type: "select",
    options: ["Новая", "В работе", "Проверка", "Готово"].map(value => ({ label: value, value }))
  },
  {
    key: "owner",
    label: "Ответственный",
    type: "select",
    options: ["Анна", "Илья", "Мария"].map(value => ({ label: value, value }))
  },
  { key: "area", label: "Площадь", type: "number" },
  { key: "dueDate", label: "Срок", type: "date" },
  { key: "archived", label: "Архив", type: "boolean" }
];

const items: WorkItem[] = [
  { id: "survey", title: "Обмер помещения", status: "В работе", owner: "Анна", area: 128, dueDate: "2026-06-03", archived: false },
  { id: "facade", title: "Фасадные панели", status: "Проверка", owner: "Илья", area: 340, dueDate: "2026-06-12", archived: false },
  { id: "archive", title: "Архив БТИ", status: "Готово", owner: "Мария", area: 64, dueDate: "2026-05-20", archived: true },
  { id: "roof", title: "Кровля секции B", status: "Новая", owner: "Анна", area: 220, dueDate: "2026-06-18", archived: false },
  { id: "parking", title: "Паркинг P2", status: "В работе", owner: "Мария", area: 510, dueDate: "2026-07-01", archived: false }
];

const initialRules: FilterRule[] = [
  {
    id: 1,
    fieldKey: "status",
    condition: "and",
    operator: FilterOperator.StringIsAnyOf,
    value: ["В работе", "Проверка"]
  },
  {
    id: 2,
    fieldKey: "archived",
    condition: "and",
    operator: FilterOperator.Eq,
    value: false
  }
];

export const getFiltersDoc = (_context: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "filters",
    name: "Filters",
    importCode: 'import { Filters, applyFilters } from "@ShKit";',
    description: "Публичный filter builder для списков, каталогов и таблиц. Table использует его через адаптер, но компонент можно применять отдельно.",    props: [
      { name: "fields", type: "FilterField[]", description: "Список доступных полей: key, label, type и options для select." },
      { name: "rules", type: "FilterRule[]", description: "Controlled список правил фильтрации." },
      { name: "onRulesChange", type: "(rules) => void", description: "Событие изменения правил." },
      { name: "compact", type: "boolean", defaultValue: "false", description: "true — значение на отдельной строке под колонкой и оператором. По умолчанию все поля в одной строке." },
      {
        name: "variant",
        type: '"dropdown" | "inline"',
        defaultValue: '"dropdown"',
        description: "dropdown — тень и ширина popover (таблица). inline — без тени и рамки, width 100% для форм и модалок."
      },
      { name: "className", type: "string", description: "Дополнительный className для панели." }
    ],    usageCode: `const [rules, setRules] = useState<FilterRule[]>([]);
const visibleItems = applyFilters(items, fields, rules);

<Filters fields={fields} rules={rules} onRulesChange={setRules} />

<Filters variant="inline" fields={fields} rules={rules} onRulesChange={setRules} />

<Filters fields={fields} rules={rules} onRulesChange={setRules} compact />`,
    preview: <FiltersPreview />
  };
};

const FiltersPreview = () => {
  const [rules, setRules] = useState<FilterRule[]>(initialRules);
  const [inlineRules, setInlineRules] = useState<FilterRule[]>(initialRules.slice(0, 1));
  const [compactRules, setCompactRules] = useState<FilterRule[]>(initialRules.slice(0, 1));
  const visibleItems = useMemo(() => applyFilters(items, fields, rules), [rules]);

  return (
    <Flow gap={12} style={{ width: "100%" }}>
      <div className={filtersDocStyles.layoutLabel}>variant=&quot;dropdown&quot; (по умолчанию)</div>
      <Filters fields={fields} rules={rules} onRulesChange={setRules} className={filtersDocStyles.dropdownDemo} />
      <div className={filtersDocStyles.layoutLabel}>variant=&quot;inline&quot; — в теле формы / модалки</div>
      <div className={filtersDocStyles.inlineSurface}>
        <Filters variant="inline" fields={fields} rules={inlineRules} onRulesChange={setInlineRules} />
      </div>
      <div className={filtersDocStyles.layoutLabel}>compact — значение на отдельной строке</div>
      <Filters compact fields={fields} rules={compactRules} onRulesChange={setCompactRules} variant="inline" />
      <div className={filtersDocStyles.listHeader}>
        <Badge tone="info" count={visibleItems.length} text={`${visibleItems.length} / ${items.length}`} />
        <Button size="sm" variant="ghost" onClick={() => setRules(initialRules)}>Reset</Button>
      </div>
      <div className={filtersDocStyles.list}>
        {visibleItems.map(item => (
          <article key={item.id} className={filtersDocStyles.item}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.owner} · {item.area} м2 · {item.dueDate}</span>
            </div>
            <Tag tone={item.status === "Готово" ? "success" : item.status === "Проверка" ? "warning" : "info"} size="sm">
              {item.status}
            </Tag>
          </article>
        ))}
      </div>
    </Flow>
  );
};

const filtersDocStyles = {
  dropdownDemo: style({
    maxWidth: "100%"
  }),
  inlineSurface: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxSizing: "border-box",
    padding: space[12],
    width: "100%"
  }),
  layoutLabel: style({
    color: color.textSubtle,
    fontSize: 12,
    fontWeight: 800
  }),
  listHeader: style({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
  }),
  list: style({
    display: "grid",
    gap: space[8]
  }),
  item: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    display: "flex",
    gap: space[10],
    justifyContent: "space-between",
    minWidth: 0,
    padding: space[10],
    $nest: {
      "& strong": {
        color: color.primary,
        display: "block",
        fontSize: 14
      },
      "& span": {
        color: color.textSubtle,
        display: "block",
        fontSize: 12,
        fontWeight: 800,
        marginTop: 3
      }
    }
  })
};
