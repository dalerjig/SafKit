import type { FilterCondition, FilterValue } from "../Filters";
import { FilterOperator } from "./types";

export type TableFilterValue = FilterValue;
export type { FilterCondition };

export type TableFilterRule = {
  id: number;
  columnKey: string;
  condition: FilterCondition;
  operator: FilterOperator;
  value: TableFilterValue;
};
