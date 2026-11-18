import type { ReactNode } from "react";
import type { DateRangeValue } from "../DateInput";
import type { SelectOption } from "../Select";

export type FilterFieldType = "string" | "number" | "boolean" | "select" | "date" | "formula";

export type FilterValue = string | number | boolean | string[] | DateRangeValue | "";

export type FilterCondition = "and" | "or";

export type FilterField = {
  key: string;
  label: ReactNode;
  type?: FilterFieldType;
  options?: SelectOption[];
};

export enum FilterOperator {
  Eq = "eq",
  NEq = "nEq",
  Gt = "gt",
  Lt = "lt",
  Gte = "gte",
  Lte = "lte",
  StringIs = "string_is",
  StringNot = "string_not",
  StringIsAnyOf = "string_is_any_of",
  StringIsNoneOf = "string_is_none_of",
  StringEmpty = "string_is_empty",
  StringNotEmpty = "string_is_not_empty",
  DateEq = "date_eq",
  DateBetween = "date_between",
  DateBefore = "date_before",
  DateAfter = "date_after",
  DateOnOrBefore = "date_on_or_before",
  DateOnOrAfter = "date_on_or_after",
  DateNotEq = "date_not",
  DateEmpty = "date_empty",
  DateNotEmpty = "date_not_empty",
  NoFilter = "no_filter"
}

export type FilterRule = {
  id: number;
  fieldKey: string;
  condition: FilterCondition;
  operator: FilterOperator;
  value: FilterValue;
};
