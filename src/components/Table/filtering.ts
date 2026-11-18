import {
  applyFilters,
  createDefaultFilterRule as createDefaultRule,
  getDefaultFilterOperator as getDefaultOperator,
  getDefaultFilterValue as getDefaultValue,
  getFilterOperatorOptions as getOperatorOptions,
  isDateRangeValue,
  isEmptyFilterValue,
  isUnaryFilterOperator,
  type FilterField,
  type FilterOperatorLabels,
  type FilterRule
} from "../Filters";
import type { ExternalFilterState, TableColumn, TableRowBase } from "./types";
import type { TableFilterRule, TableFilterValue } from "./filterTypes";

export type { FilterOperatorLabels };
export { isDateRangeValue, isEmptyFilterValue, isUnaryFilterOperator };

export const applyTableFilters = <T extends TableRowBase>(
  rows: T[],
  columns: Array<TableColumn<T>>,
  rules: TableFilterRule[]
) => {
  return applyFilters(rows, columns.map(tableColumnToFilterField), rules.map(tableRuleToFilterRule));
};

export const serializeFilterRules = (rules: TableFilterRule[]): ExternalFilterState[]  => {
  return rules
    .filter(rule => !isEmptyFilterValue(rule.value) || isUnaryFilterOperator(rule.operator))
    .map(rule => ({
      id: rule.id,
      key: rule.columnKey,
      value: rule.value,
      operator: rule.operator,
      conditionalWithPrevious: rule.condition,
      filterFn: () => true
    }));
};

export const deserializeFilterRules = (filters: ExternalFilterState[]): TableFilterRule[]  => {
  return filters.map((filter, index) => ({
    id: filter.id ?? Date.now() + index,
    columnKey: filter.key,
    condition: filter.conditionalWithPrevious,
    operator: filter.operator,
    value: filter.value as TableFilterValue
  }));
};

export const createDefaultFilterRule = <T extends TableRowBase>(
  columns: Array<TableColumn<T>>,
  index: number
): TableFilterRule  => {
  const rule = createDefaultRule(columns.map(tableColumnToFilterField), index);
  return filterRuleToTableRule(rule);
};

export const getDefaultFilterOperator = <T extends TableRowBase>(column: TableColumn<T>) => {
  return getDefaultOperator(tableColumnToFilterField(column));
};

export const getDefaultFilterValue = <T extends TableRowBase>(column: TableColumn<T>): TableFilterValue  => {
  return getDefaultValue(tableColumnToFilterField(column));
};

export const getFilterOperatorOptions = <T extends TableRowBase>(
  column: TableColumn<T>,
  labels?: FilterOperatorLabels
) => {
  return getOperatorOptions(tableColumnToFilterField(column), labels);
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
