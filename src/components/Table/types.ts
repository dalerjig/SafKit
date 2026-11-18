import type { ReactNode } from "react";
import { FilterOperator } from "../Filters/types";

export type TableStickyHeader = {
  scrollContainer: HTMLElement | null;
  offsetTop?: number;
};

export type TableRowBase = Record<PropertyKey, unknown> & {
  id: string;
  parentId?: string | null;
};

export type TableColumnProps<T extends TableRowBase> = {
  value: unknown;
  data: T;
  rowIndex: number;
  nestInfo?: NestInfo;
};

export type TableFieldType = "string" | "number" | "boolean" | "select" | "date" | "formula";

export type TableSelectOption = {
  label: string;
  value: string;
};

export type TableExportFormat = "xlsx" | "csv";

export type ExportMetadata = {
  name: string;
  value: unknown;
};

export type TableColumn<T extends TableRowBase> = {
  key: string;
  name: ReactNode;
  fixed?: boolean;
  initialWidth?: number;
  minResizeWidth?: number;
  render?: (props: TableColumnProps<T>) => ReactNode;
  validate?: (value: unknown, row: T) => string | null | undefined;
  toExport?: (props: TableColumnProps<T>) => ExportMetadata | ExportMetadata[];
  hidden?: boolean;
  editable?: boolean;
  fieldType?: TableFieldType;
  selectOptions?: TableSelectOption[];
  fixedWidth?: boolean;
};

export type NestInfo = {
  level: number;
  wbs: string;
  children: string[];
  parent: string | null;
};

export type VisibleInfo = string[];

export type NestTree = Record<string, NestInfo>;

export type HighlightedCell = {
  rowIndex: number;
  fieldId: string;
};

export { FilterOperator };

export type ExternalFilterState = {
  id: number;
  key: string;
  isFilterOpen?: boolean;
  value: unknown;
  operator: FilterOperator;
  conditionalWithPrevious: "and" | "or";
  filterFn: (row: unknown) => boolean;
};

export type TableColumnState<T extends TableRowBase = TableRowBase> = {
  width: number;
  order: number;
  column: TableColumn<T>;
  element?: HTMLDivElement | null;
  hidden?: boolean;
};

export type TableRuntimeState<T extends TableRowBase = TableRowBase> = {
  columns: Record<string, TableColumnState<T>>;
  orders: Record<string, number>;
};

export type TableSerializedColumnState = {
  id?: string;
  width: number;
  order: number;
  hidden?: boolean;
};

export type TableSerializedEntry = {
  [columnId: string]: TableSerializedColumnState | ExternalFilterState[] | string | null | undefined;
  _filters?: ExternalFilterState[];
  pinnedColumnId?: string | null;
};

export type TableSerializedState = Record<string, TableSerializedEntry>;

export type IShTableDataBaseType = TableRowBase;
export type IShTableColumnProps<T extends TableRowBase> = TableColumnProps<T>;
export type ShTableFieldTypes = TableFieldType;
export type ShTableSelectOption = TableSelectOption;
export type ShTableExportFormat = TableExportFormat;
export type IShTableColumn<T extends TableRowBase> = TableColumn<T>;
export type ITableColumnState = TableColumnState;
export type ITableState = TableRuntimeState;
export type ITableSerializedColumnState = TableSerializedColumnState;
export type ITableSerializedState = TableSerializedState;
