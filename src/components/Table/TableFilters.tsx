import { FilterPanel } from "../Filters";
import type { FilterField, FilterRule } from "../Filters";
import type { TableFilterRule } from "./filterTypes";
import type { TableColumn, TableRowBase } from "./types";

export type TableFilterPanelProps<T extends TableRowBase> = {
  columns: Array<TableColumn<T>>;
  rules: TableFilterRule[];
  onAddRule: () => void;
  onChangeRules: (updater: (rules: TableFilterRule[]) => TableFilterRule[]) => void;
  onClear: () => void;
};

export const TableFilterPanel = <T extends TableRowBase,>({
  columns,
  rules,
  onAddRule,
  onChangeRules,
  onClear
}: TableFilterPanelProps<T>) => {
  const fields = columns.map(tableColumnToFilterField);
  const filterRules = rules.map(tableRuleToFilterRule);

  return (
    <FilterPanel
      fields={fields}
      rules={filterRules}
      onAddRule={onAddRule}
      onChangeRules={updater => {
        onChangeRules(previous => updater(previous.map(tableRuleToFilterRule)).map(filterRuleToTableRule));
      }}
      onClear={onClear}
    />
  );
};

const tableColumnToFilterField = <T extends TableRowBase>(column: TableColumn<T>): FilterField => ({
  key: column.key,
  label: column.name,
  type: column.fieldType,
  options: column.selectOptions
});

const tableRuleToFilterRule = (rule: TableFilterRule): FilterRule => ({
  id: rule.id,
  fieldKey: rule.columnKey,
  condition: rule.condition,
  operator: rule.operator,
  value: rule.value
});

const filterRuleToTableRule = (rule: FilterRule): TableFilterRule => ({
  id: rule.id,
  columnKey: rule.fieldKey,
  condition: rule.condition,
  operator: rule.operator,
  value: rule.value
});
