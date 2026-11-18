import { tableConfig } from "./constants";
import type {
  ExternalFilterState,
  TableColumn,
  TableColumnState,
  TableRowBase,
  TableRuntimeState,
  TableSerializedColumnState,
  TableSerializedState
} from "./types";

export class TableState<T extends TableRowBase = TableRowBase> {
  private id: string;
  private state: TableRuntimeState<T>;
  private filters: ExternalFilterState[] = [];
  private pinnedColumnId: string | null = null;

  constructor(tableId: string, columns: Array<TableColumn<T>>) {
    this.id = tableId;
    this.state = this.createInitialState(columns);
  }

  public getState() {
    return this.state;
  }

  public getColumns() {
    return this.state.columns;
  }

  public getOrderedColumns() {
    return Object.values(this.state.columns).sort((a, b) => a.order - b.order);
  }

  public getVisibleColumns() {
    return this.getOrderedColumns().filter(column => !column.hidden);
  }

  public getColumn(columnId: string): TableColumnState<T> {
    const column = this.state.columns[columnId];
    if (!column) {
      throw new Error(`Column "${columnId}" not found`);
    }

    return column;
  }

  public getColumnState(columnId: string) {
    return this.getColumn(columnId);
  }

  public setColumnRef(columnId: string, element: HTMLDivElement | null) {
    this.getColumn(columnId).element = element;
  }

  public setColumnWidth(columnId: string, width: number) {
    this.getColumn(columnId).width = width;
  }

  public getColumnWidth(columnId: string) {
    return this.getColumn(columnId).width || 0;
  }

  public setColumnOrder(columnId: string, order: number) {
    this.getColumn(columnId).order = order;
    this.state.orders[columnId] = order;
  }

  public getColumnOrder(columnId: string) {
    return this.getColumn(columnId).order;
  }

  public setColumnHidden(columnId: string, hidden: boolean) {
    this.getColumn(columnId).hidden = hidden;
  }

  public getColumnHidden(columnId: string) {
    return this.getColumn(columnId).hidden ?? false;
  }

  public serializeTableState(): TableSerializedState {
    const columnsData = Object.entries(this.state.columns).reduce(
      (acc, [columnId, columnMeta]) => {
        acc[columnId] = {
          order: columnMeta.order,
          width: columnMeta.width,
          hidden: columnMeta.hidden
        };
        return acc;
      },
      {} as Record<string, TableSerializedColumnState>
    );

    return {
      [this.id]: {
        ...columnsData,
        _filters: this.serializeFilters(),
        pinnedColumnId: this.pinnedColumnId
      }
    };
  }

  public deserializeTableState(data: TableSerializedState) {
    const tableData = data[this.id];
    if (!tableData) {
      console.warn(`No data found for key "${this.id}"`);
      return;
    }

    if (Array.isArray(tableData._filters)) {
      this.deserializeFilters(tableData._filters);
    }

    for (const [columnId, columnData] of Object.entries(tableData)) {
      if (columnId === "_filters" || columnId === "pinnedColumnId") continue;

      const column = columnData as TableSerializedColumnState;
      try {
        const columnMeta = this.getColumn(columnId);
        columnMeta.order = column.order;
        columnMeta.width = column.width;
        columnMeta.hidden = column.hidden ?? false;
        this.state.orders[columnId] = column.order;
      } catch {
        console.warn(`Column "${columnId}" not found in current table, skipping deserialization`);
      }
    }

    this.pinnedColumnId = tableData.pinnedColumnId ?? null;
  }

  public setFilters(filters: ExternalFilterState[]) {
    this.filters = filters;
  }

  public getFilters() {
    return [...this.filters];
  }

  public serializeFilters() {
    return [...this.filters];
  }

  public deserializeFilters(filters: ExternalFilterState[]) {
    if (Array.isArray(filters)) {
      this.filters = filters;
    }
  }

  public getId() {
    return this.id;
  }

  public getPinnedColumnId() {
    return this.pinnedColumnId;
  }

  public setPinnedColumnId(pinnedColumnId: string | null) {
    this.pinnedColumnId = pinnedColumnId;
  }

  public reset(columns: Array<TableColumn<T>>) {
    this.state = this.createInitialState(columns);
    this.filters = [];
    this.pinnedColumnId = null;
  }

  private createInitialState(columns: Array<TableColumn<T>>): TableRuntimeState<T> {
    const state: TableRuntimeState<T> = {
      columns: {},
      orders: {}
    };

    columns.forEach((column, index) => {
      state.columns[column.key] = {
        width: column.initialWidth || tableConfig.minWidth,
        order: index,
        column,
        element: null,
        hidden: column.hidden || false
      };
      state.orders[column.key] = index;
    });

    return state;
  }
}
