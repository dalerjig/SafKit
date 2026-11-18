import type { DateRangeValue } from "../DateInput";
import { FilterOperator, type FilterField, type FilterRule, type FilterValue } from "./types";

export type FilterOperatorLabels = {
  contains: string;
  dateAfter: string;
  dateBefore: string;
  dateBetween: string;
  dateEq: string;
  dateNotEq: string;
  dateNotEmpty: string;
  dateOnOrAfter: string;
  dateOnOrBefore: string;
  empty: string;
  eq: string;
  gt: string;
  gte: string;
  isAnyOf: string;
  isNoneOf: string;
  lt: string;
  lte: string;
  nEq: string;
  notContains: string;
  notEmpty: string;
};

const defaultOperatorLabels: FilterOperatorLabels = {
  contains: "contains",
  dateAfter: "after",
  dateBefore: "before",
  dateBetween: "between",
  dateEq: "=",
  dateNotEq: "!=",
  dateNotEmpty: "not empty",
  dateOnOrAfter: "on or after",
  dateOnOrBefore: "on or before",
  empty: "empty",
  eq: "=",
  gt: ">",
  gte: ">=",
  isAnyOf: "any of",
  isNoneOf: "none of",
  lt: "<",
  lte: "<=",
  nEq: "!=",
  notContains: "does not contain",
  notEmpty: "not empty"
};

export const applyFilters = <T extends Record<PropertyKey, unknown>>(
  rows: T[],
  fields: FilterField[],
  rules: FilterRule[]
) => {
  const activeRules = rules.filter(rule => !isEmptyFilterValue(rule.value) || isUnaryFilterOperator(rule.operator));
  if (activeRules.length === 0) return rows;

  const fieldsByKey = new Map(fields.map(field => [field.key, field]));

  return rows.filter(row => {
    return activeRules.reduce<boolean | null>((acc, rule, index) => {
      const field = fieldsByKey.get(rule.fieldKey);
      const result = field ? doesRowMatchFilter(row, field, rule) : true;

      if (index === 0 || acc === null) return result;
      return rule.condition === "or" ? acc || result : acc && result;
    }, null) ?? true;
  });
};

export const createDefaultFilterRule = (fields: FilterField[], index: number): FilterRule => {
  const field = fields[0];

  return {
    id: Date.now() + index,
    fieldKey: field?.key ?? "",
    condition: "and",
    operator: field ? getDefaultFilterOperator(field) : FilterOperator.StringIs,
    value: field ? getDefaultFilterValue(field) : ""
  };
};

export const getDefaultFilterOperator = (field: FilterField) => {
  if (field.type === "number") return FilterOperator.Eq;
  if (field.type === "select") return FilterOperator.StringIsAnyOf;
  if (field.type === "boolean") return FilterOperator.Eq;
  if (field.type === "date") return FilterOperator.DateBetween;
  return FilterOperator.StringIs;
};

export const getDefaultFilterValue = (field: FilterField): FilterValue => {
  if (field.type === "select") return [];
  if (field.type === "boolean") return "";
  if (field.type === "number") return "";
  if (field.type === "date") return { from: "", to: "" };
  return "";
};

export const getFilterOperatorOptions = (
  field: FilterField,
  labels: FilterOperatorLabels = defaultOperatorLabels
) => {
  if (field.type === "number") {
    return [
      { label: labels.eq, value: FilterOperator.Eq },
      { label: labels.nEq, value: FilterOperator.NEq },
      { label: labels.gt, value: FilterOperator.Gt },
      { label: labels.gte, value: FilterOperator.Gte },
      { label: labels.lt, value: FilterOperator.Lt },
      { label: labels.lte, value: FilterOperator.Lte }
    ];
  }

  if (field.type === "select") {
    return [
      { label: labels.eq, value: FilterOperator.StringIs },
      { label: labels.nEq, value: FilterOperator.StringNot },
      { label: labels.isAnyOf, value: FilterOperator.StringIsAnyOf },
      { label: labels.isNoneOf, value: FilterOperator.StringIsNoneOf },
      { label: labels.empty, value: FilterOperator.StringEmpty },
      { label: labels.notEmpty, value: FilterOperator.StringNotEmpty }
    ];
  }

  if (field.type === "boolean") {
    return [{ label: labels.eq, value: FilterOperator.Eq }];
  }

  if (field.type === "date") {
    return [
      { label: labels.dateEq, value: FilterOperator.DateEq },
      { label: labels.dateBetween, value: FilterOperator.DateBetween },
      { label: labels.dateBefore, value: FilterOperator.DateBefore },
      { label: labels.dateAfter, value: FilterOperator.DateAfter },
      { label: labels.dateOnOrBefore, value: FilterOperator.DateOnOrBefore },
      { label: labels.dateOnOrAfter, value: FilterOperator.DateOnOrAfter },
      { label: labels.dateNotEq, value: FilterOperator.DateNotEq },
      { label: labels.empty, value: FilterOperator.DateEmpty },
      { label: labels.dateNotEmpty, value: FilterOperator.DateNotEmpty }
    ];
  }

  return [
    { label: labels.contains, value: FilterOperator.StringIs },
    { label: labels.notContains, value: FilterOperator.StringNot },
    { label: labels.empty, value: FilterOperator.StringEmpty },
    { label: labels.notEmpty, value: FilterOperator.StringNotEmpty }
  ];
};

export const isEmptyFilterValue = (value: FilterValue) => {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (isDateRangeValue(value)) return !value.from && !value.to;
  return false;
};

export const isDateRangeValue = (value: unknown): value is DateRangeValue => {
  return Boolean(value && typeof value === "object" && "from" in value && "to" in value);
};

export const isUnaryFilterOperator = (operator: FilterOperator) => {
  return [
    FilterOperator.StringEmpty,
    FilterOperator.StringNotEmpty,
    FilterOperator.DateEmpty,
    FilterOperator.DateNotEmpty
  ].includes(operator);
};

const doesRowMatchFilter = <T extends Record<PropertyKey, unknown>>(row: T, field: FilterField, rule: FilterRule) => {
  const rowValue = row[rule.fieldKey];
  const filterValue = rule.value;
  const stringValue = String(rowValue ?? "").toLocaleLowerCase();
  const filterString = String(filterValue ?? "").toLocaleLowerCase();

  switch (rule.operator) {
    case FilterOperator.StringIs:
      return stringValue.includes(filterString);
    case FilterOperator.StringNot:
      return !stringValue.includes(filterString);
    case FilterOperator.StringIsAnyOf:
      return Array.isArray(filterValue) && filterValue.includes(String(rowValue ?? ""));
    case FilterOperator.StringIsNoneOf:
      return Array.isArray(filterValue) && !filterValue.includes(String(rowValue ?? ""));
    case FilterOperator.StringEmpty:
      return rowValue === null || rowValue === undefined || rowValue === "";
    case FilterOperator.StringNotEmpty:
      return rowValue !== null && rowValue !== undefined && rowValue !== "";
    case FilterOperator.Eq:
    case FilterOperator.DateEq:
      return String(rowValue ?? "") === String(filterValue ?? "");
    case FilterOperator.NEq:
    case FilterOperator.DateNotEq:
      return String(rowValue ?? "") !== String(filterValue ?? "");
    case FilterOperator.Gt:
      return Number(rowValue) > Number(filterValue);
    case FilterOperator.Gte:
      return Number(rowValue) >= Number(filterValue);
    case FilterOperator.Lt:
      return Number(rowValue) < Number(filterValue);
    case FilterOperator.Lte:
      return Number(rowValue) <= Number(filterValue);
    case FilterOperator.DateBetween:
      return (
        isDateRangeValue(filterValue) &&
        (!filterValue.from || String(rowValue ?? "") >= filterValue.from) &&
        (!filterValue.to || String(rowValue ?? "") <= filterValue.to)
      );
    case FilterOperator.DateBefore:
      return String(rowValue ?? "") < String(filterValue ?? "");
    case FilterOperator.DateAfter:
      return String(rowValue ?? "") > String(filterValue ?? "");
    case FilterOperator.DateOnOrBefore:
      return String(rowValue ?? "") <= String(filterValue ?? "");
    case FilterOperator.DateOnOrAfter:
      return String(rowValue ?? "") >= String(filterValue ?? "");
    case FilterOperator.DateEmpty:
      return rowValue === null || rowValue === undefined || rowValue === "";
    case FilterOperator.DateNotEmpty:
      return rowValue !== null && rowValue !== undefined && rowValue !== "";
    default:
      if (field.type === "boolean" && typeof filterValue === "boolean") {
        return Boolean(rowValue) === filterValue;
      }
      return true;
  }
};
