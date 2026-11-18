import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { classes, style } from "typestyle";
import {
  color,
  radius,
  scrollbar,
  shkitSpin,
  space,
  zIndex,
} from "../../tokens";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Dropdown } from "../Dropdown";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Tooltip } from "../Tooltip";
import { useShKitLocale } from "../../provider";
import { tableConfig } from "./constants";
import { EditableCell } from "./EditableCell";
import { useAlwaysHorizontalScroll } from "./useAlwaysHorizontalScroll";
import {
  applyTableFilters,
  createDefaultFilterRule,
  deserializeFilterRules,
  serializeFilterRules,
} from "./filtering";
import { TableFilterPanel } from "./TableFilters";
import { TableState } from "./TableState";
import type { TableStateStorage } from "./storage";
import type { TableFilterRule } from "./filterTypes";
import type {
  ExternalFilterState,
  HighlightedCell,
  NestInfo,
  NestTree,
  TableColumn,
  TableColumnState,
  TableRowBase,
  TableStickyHeader,
} from "./types";

const TABLE_HEADER_HEIGHT = 40;
const TREE_INDENT = 12;
const TREE_TOGGLE_WIDTH = 16;
const EMPTY_FILTER_RULES: TableFilterRule[] = [];
const hiddenVerticalScrollbarUsers = new WeakMap<HTMLElement, { count: number; alreadyHidden: boolean }>();

type TableExportScope = "all" | "filtered";

export type TableProps<T extends TableRowBase> = {
  id: string;
  data: T[];
  columns: Array<TableColumn<T>>;
  stateStorage?: TableStateStorage;
  rowHeight?: number;
  maxHeight?: number | string;
  hideVerticalScroll?: boolean;
  alwaysHorizontalScroll?: boolean;
  /** External sticky toolbar and headers: hideVerticalScroll=true, no maxHeight, virtualized=false. */
  stickyHeader?: TableStickyHeader;
  virtualized?: boolean;
  nesting?: boolean;
  /** Column key for tree indentation and expand buttons; defaults to the first displayed column. */
  nestingColumnKey?: string;
  defaultTreeExpanded?: boolean;
  defaultExpandedIds?: string[];
  filters?: TableFilterRule[];
  defaultFilters?: TableFilterRule[];
  filterEnabled?: boolean;
  filtersOffsetX?: number;
  loading?: boolean;
  emptyText?: React.ReactNode;
  className?: string;
  toolbar?: boolean;
  exportEnabled?: boolean;
  exportFileName?: string;
  roundDigits?: number;
  highlightedCell?: HighlightedCell;
  draggableRows?: boolean;
  editableSaveMode?: "after-save" | "optimistic";
  onCellChange?: (
    rowId: string,
    columnKey: string,
    value: unknown,
    row: T,
  ) => void | Promise<void>;
  onCellClick?: (rowIndex: number, columnKey: string, row: T) => void;
  onCollapseTree?: (visibleIds: string[]) => void;
  onFiltersChange?: (filters: TableFilterRule[]) => void;
  onFilterUpdate?: (info: {
    visibleRows: T[];
    filters: ExternalFilterState[];
  }) => void;
  onRowNestChange?: (
    targetRow: T,
    draggedRow: T,
    nestTree: NestTree,
    placeAfter: boolean,
  ) => void;
  onTableStateChange?: (state: TableState<T>) => void;
};

export const Table = <T extends TableRowBase>({
  id,
  data,
  columns,
  stateStorage,
  rowHeight = 40,
  maxHeight,
  hideVerticalScroll = false,
  alwaysHorizontalScroll = false,
  stickyHeader,
  virtualized = true,
  nesting = false,
  nestingColumnKey,
  defaultTreeExpanded = true,
  defaultExpandedIds,
  filters,
  defaultFilters = [],
  filterEnabled = true,
  filtersOffsetX = 0,
  loading = false,
  emptyText,
  className,
  toolbar = true,
  exportEnabled = true,
  exportFileName,
  roundDigits,
  highlightedCell,
  draggableRows = false,
  editableSaveMode = "after-save",
  onCellChange,
  onCellClick,
  onCollapseTree,
  onFiltersChange,
  onFilterUpdate,
  onRowNestChange,
  onTableStateChange,
}: TableProps<T>) => {
  const { messages } = useShKitLocale();
  const [revision, setRevision] = useState(0);
  const [draggingColumnKey, setDraggingColumnKey] = useState<string | null>(
    null,
  );
  const [dragGhost, setDragGhost] = useState<DragGhost | null>(null);
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);
  const [rowDropTarget, setRowDropTarget] = useState<RowDropTarget | null>(
    null,
  );
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const initialExpandedIds = () =>
    new Set(
      defaultExpandedIds ??
        (nesting && defaultTreeExpanded ? data.map((row) => row.id) : []),
    );
  const [expandedIds, setExpandedIds] = useState(initialExpandedIds);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [savingCells, setSavingCells] = useState<Record<string, boolean>>({});
  const [cellErrors, setCellErrors] = useState<Record<string, string>>({});
  const [internalFilterRules, setInternalFilterRules] =
    useState<TableFilterRule[]>(defaultFilters);
  const [exportOpen, setExportOpen] = useState(false);
  const filterRules = filters ?? internalFilterRules;
  const tableState = useMemo(() => new TableState(id, columns), [id, columns]);
  const defaultExpandedKey = defaultExpandedIds?.join("|") ?? "";
  const dataIdsKey = data.map((row) => row.id).join("|");
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const horizontalBarRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef(new Map<string, HTMLDivElement>());
  const dragRef = useRef<DragSession | null>(null);
  const rowDragRef = useRef<RowDragSession<T> | null>(null);
  const viewportFrameRef = useRef<number | null>(null);
  const externalStickyHeader = Boolean(stickyHeader);
  if (externalStickyHeader && (!hideVerticalScroll || maxHeight !== undefined || virtualized)) {
    throw new Error("Table stickyHeader requires hideVerticalScroll=true, no maxHeight and virtualized=false.");
  }

  useLayoutEffect(() => {
    const container = stickyHeader?.scrollContainer;
    if (!hideVerticalScroll || !container) return;
    const className = tableStyles.hiddenVerticalScrollbar;
    const users = hiddenVerticalScrollbarUsers.get(container) ?? {
      count: 0,
      alreadyHidden: container.classList.contains(className),
    };
    users.count += 1;
    hiddenVerticalScrollbarUsers.set(container, users);
    container.classList.add(className);
    return () => {
      users.count -= 1;
      if (users.count === 0) {
        if (!users.alreadyHidden) container.classList.remove(className);
        hiddenVerticalScrollbarUsers.delete(container);
      }
    };
  }, [hideVerticalScroll, stickyHeader?.scrollContainer]);

  useAlwaysHorizontalScroll(
    alwaysHorizontalScroll,
    externalStickyHeader,
    stickyHeader?.scrollContainer,
    rootRef,
    scrollRef,
    horizontalBarRef,
    horizontalTrackRef,
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    const container = stickyHeader?.scrollContainer;
    if (!externalStickyHeader || !root || !container) return;
    const panel = toolbarRef.current;
    const update = () => {
      // The root spans all columns. CSS percentages would size the toolbar to
      // that width, so use the external viewport width to keep its controls visible.
      root.style.setProperty("--shkit-table-viewport-width", `${container.clientWidth - root.clientLeft * 2}px`);
      root.style.setProperty("--shkit-table-toolbar-height", `${panel?.getBoundingClientRect().height ?? 0}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    if (panel) observer.observe(panel);
    update();
    return () => {
      observer.disconnect();
      root.style.removeProperty("--shkit-table-viewport-width");
      root.style.removeProperty("--shkit-table-toolbar-height");
    };
  }, [externalStickyHeader, stickyHeader?.scrollContainer, toolbar]);

  useEffect(() => {
    let cancelled = false;

    const loadState = async () => {
      const savedState = await stateStorage?.load(id);
      if (!cancelled && savedState) {
        tableState.deserializeTableState(savedState);
        if (!filters) {
          setInternalFilterRules(
            deserializeFilterRules(tableState.getFilters()),
          );
        }
        setRevision((value) => value + 1);
      }
    };

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [id, stateStorage, tableState]);

  const visibleColumns = tableState.getVisibleColumns();
  const pinnedColumnId = tableState.getPinnedColumnId();
  const pinnedColumn = visibleColumns.find(
    (column) => column.column.key === pinnedColumnId,
  );
  const scrollColumns = pinnedColumn
    ? visibleColumns.filter(
        (column) => column.column.key !== pinnedColumn.column.key,
      )
    : visibleColumns;
  const treeColumnKey =
    nestingColumnKey ?? pinnedColumn?.column.key ?? scrollColumns[0]?.column.key;
  const effectiveFilterRules = filterEnabled ? filterRules : EMPTY_FILTER_RULES;
  const serializedFilters = useMemo(
    () => serializeFilterRules(effectiveFilterRules),
    [effectiveFilterRules],
  );
  const filteredData = useMemo(
    () => applyTableFilters(data, columns, effectiveFilterRules),
    [columns, data, effectiveFilterRules],
  );
  const nestTree = useMemo(() => buildNestTree(filteredData), [filteredData]);
  const visibleRows = useMemo(
    () =>
      nesting
        ? getVisibleTreeRows(filteredData, expandedIds, nestTree)
        : filteredData.map((row) => ({
            row,
            level: 0,
            hasChildren: false,
            nestInfo: undefined,
          })),
    [expandedIds, filteredData, nestTree, nesting],
  );
  const overscan = 6;
  const bodyScrollTop = Math.max(scrollTop - TABLE_HEADER_HEIGHT, 0);
  const bodyViewportHeight = Math.max(
    viewportHeight - TABLE_HEADER_HEIGHT,
    rowHeight,
  );
  const startIndex = virtualized
    ? Math.max(Math.floor(bodyScrollTop / rowHeight) - overscan, 0)
    : 0;
  const visibleCount = virtualized
    ? Math.ceil(bodyViewportHeight / rowHeight) + overscan * 2
    : visibleRows.length;
  const endIndex = Math.min(startIndex + visibleCount, visibleRows.length);
  const renderedRows = visibleRows.slice(startIndex, endIndex);
  const rowsOffset = startIndex * rowHeight;
  const hasEmptyState = visibleRows.length === 0 || loading;
  const bodyHeight = Math.max(
    visibleRows.length * rowHeight,
    hasEmptyState ? rowHeight * 3 : 0,
  );
  const scrollColumnWidths = scrollColumns.map((column) => column.width);
  const scrollColumnsTemplate = scrollColumnWidths
    .map((width) => `${width}px`)
    .join(" ");
  const renderedRowsTemplate = `repeat(${renderedRows.length}, ${rowHeight}px)`;
  const activeFilterCount = serializedFilters.length;
  const getCellKey = (rowId: string, columnKey: string) =>
    `${rowId}::${columnKey}`;

  useEffect(() => {
    onFilterUpdate?.({
      visibleRows: visibleRows.map((item) => item.row),
      filters: serializedFilters,
    });
  }, [onFilterUpdate, serializedFilters, visibleRows]);

  const persistState = () => {
    setRevision((value) => value + 1);
    onTableStateChange?.(tableState);
    void stateStorage?.save(id, tableState.serializeTableState());
  };

  const setColumnRef = (columnKey: string, element: HTMLDivElement | null) => {
    tableState.setColumnRef(columnKey, element);
    if (element) {
      headerRefs.current.set(columnKey, element);
    } else {
      headerRefs.current.delete(columnKey);
    }
  };

  const toggleColumn = (columnKey: string) => {
    const column = tableState.getColumn(columnKey);
    const visibleCount = tableState.getVisibleColumns().length;
    if (!column.hidden && visibleCount <= 1) return;

    tableState.setColumnHidden(columnKey, !column.hidden);
    if (tableState.getPinnedColumnId() === columnKey && !column.hidden) {
      tableState.setPinnedColumnId(null);
    }
    persistState();
  };

  const setPinnedColumn = (columnKey: string | null) => {
    tableState.setPinnedColumnId(columnKey);
    persistState();
  };

  const persistFilters = (rules: TableFilterRule[]) => {
    tableState.setFilters(serializeFilterRules(rules));
    onFiltersChange?.(rules);
    void stateStorage?.save(id, tableState.serializeTableState());
  };

  const setFilterRulesAndPersist = (
    updater: (rules: TableFilterRule[]) => TableFilterRule[],
  ) => {
    const previous = filters ?? internalFilterRules;
    const next = updater(previous);
    if (!filters) {
      setInternalFilterRules(next);
    }
    persistFilters(next);
  };

  useEffect(() => {
    if (!filters) return;
    tableState.setFilters(serializeFilterRules(filters));
  }, [filters, tableState]);

  const addFilterRule = () => {
    setFilterRulesAndPersist((previous) => [
      ...previous,
      createDefaultFilterRule(columns, previous.length),
    ]);
  };

  const clearFilters = () => {
    if (!filters) {
      setInternalFilterRules([]);
    }
    onFiltersChange?.([]);
    tableState.setFilters([]);
    void stateStorage?.save(id, tableState.serializeTableState());
  };

  const resetTableState = () => {
    tableState.reset(columns);
    if (filters) {
      onFiltersChange?.(defaultFilters);
      tableState.setFilters(serializeFilterRules(defaultFilters));
    } else {
      setInternalFilterRules(defaultFilters);
      tableState.setFilters(serializeFilterRules(defaultFilters));
    }
    setRevision((value) => value + 1);
    onTableStateChange?.(tableState);
    void stateStorage?.save(id, tableState.serializeTableState());
  };

  const getExportRows = (scope: TableExportScope) =>
    scope === "filtered" ? filteredData : data;

  const getExportSheet = (scope: TableExportScope) => {
    const rows = getExportRows(scope);
    const exportColumns = visibleColumns
      .map((column) => column.column)
      .filter((column) => column.key !== "action");
    const headers: string[] = [];
    const body = rows.map((row, rowIndex) => {
      const exportRow: Record<string, unknown> = {};

      exportColumns.forEach((column) => {
        const value = row[column.key];
        if (column.toExport) {
          const metadata = column.toExport({
            value,
            data: row,
            rowIndex,
            nestInfo: nestTree[row.id],
          });
          const metadataItems = Array.isArray(metadata) ? metadata : [metadata];
          metadataItems.forEach((item) => {
            if (!headers.includes(item.name)) headers.push(item.name);
            exportRow[item.name] = normalizeExportValue(
              item.value,
              column,
              roundDigits,
            );
          });
          return;
        }

        const header = toPlainText(column.name) || column.key;
        if (!headers.includes(header)) headers.push(header);
        exportRow[header] = normalizeExportValue(value, column, roundDigits);
      });

      return exportRow;
    });

    if (rows.length === 0) {
      exportColumns.forEach((column) => {
        const header = toPlainText(column.name) || column.key;
        if (!headers.includes(header)) headers.push(header);
      });
    }

    return [
      headers,
      ...body.map((row) => headers.map((header) => row[header])),
    ];
  };

  const exportCsv = (scope: TableExportScope) => {
    if (typeof document === "undefined") return;

    const csv = getExportSheet(scope)
      .map((row) => row.map(toCsvValue).join(","))
      .join("\n");
    downloadBlob(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
      `${exportFileName ?? id}-${scope}.csv`,
    );
  };

  const exportXlsx = async (scope: TableExportScope) => {
    if (typeof document === "undefined") return;

    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(getExportSheet(scope));
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table");
    XLSX.writeFile(workbook, `${exportFileName ?? id}-${scope}.xlsx`);
  };

  const exportTable = (key: string) => {
    setExportOpen(false);
    if (key === "all-xlsx") void exportXlsx("all");
    if (key === "filtered-xlsx") void exportXlsx("filtered");
    if (key === "all-csv") exportCsv("all");
    if (key === "filtered-csv") exportCsv("filtered");
  };

  const reorderColumn = (draggedKey: string, targetKey: string) => {
    if (draggedKey === targetKey) return;

    const ordered = tableState.getOrderedColumns();
    const draggedIndex = ordered.findIndex(
      (column) => column.column.key === draggedKey,
    );
    const targetIndex = ordered.findIndex(
      (column) => column.column.key === targetKey,
    );

    if (draggedIndex < 0 || targetIndex < 0) return;

    const next = [...ordered];
    const [dragged] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, dragged);
    next.forEach((column, index) =>
      tableState.setColumnOrder(column.column.key, index),
    );
    setRevision((value) => value + 1);
  };

  const updateViewport = () => {
    const element = scrollRef.current;
    if (!element) return;

    setScrollTop(element.scrollTop);
    setViewportHeight(element.clientHeight);
  };

  const scheduleViewportUpdate = () => {
    if (viewportFrameRef.current !== null) return;

    viewportFrameRef.current = window.requestAnimationFrame(() => {
      viewportFrameRef.current = null;
      updateViewport();
    });
  };

  useEffect(() => {
    updateViewport();
  }, [visibleRows.length, maxHeight]);

  useEffect(
    () => () => {
      if (viewportFrameRef.current !== null) {
        window.cancelAnimationFrame(viewportFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setExpandedIds(initialExpandedIds());
    setScrollTop(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [id, defaultExpandedKey, dataIdsKey, defaultTreeExpanded, nesting]);

  const startColumnDrag = (event: React.MouseEvent, columnKey: string) => {
    if ((event.target as HTMLElement).closest("[data-table-action]")) return;

    const sourceElement = headerRefs.current.get(columnKey);
    const sourceRect = sourceElement?.getBoundingClientRect();
    const columnState = tableState.getColumn(columnKey);

    dragRef.current = {
      columnKey,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: sourceRect ? event.clientX - sourceRect.left : 0,
      offsetY: sourceRect ? event.clientY - sourceRect.top : 0,
    };
    setDraggingColumnKey(columnKey);
    setDragGhost(
      sourceRect
        ? {
            title: columnState.column.name,
            left: sourceRect.left,
            top: sourceRect.top,
            width: sourceRect.width,
            height: sourceRect.height,
          }
        : null,
    );
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag || Math.abs(moveEvent.clientX - drag.startX) < 8) return;
      setDragGhost((ghost) =>
        ghost
          ? {
              ...ghost,
              left: moveEvent.clientX - drag.offsetX,
              top: moveEvent.clientY - drag.offsetY,
            }
          : ghost,
      );

      for (const [targetKey, element] of headerRefs.current.entries()) {
        if (targetKey === drag.columnKey) continue;

        const rect = element.getBoundingClientRect();
        if (moveEvent.clientX >= rect.left && moveEvent.clientX <= rect.right) {
          reorderColumn(drag.columnKey, targetKey);
          break;
        }
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      setDraggingColumnKey(null);
      setDragGhost(null);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      persistState();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const toggleRow = (rowId: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      onCollapseTree?.(
        getVisibleTreeRows(filteredData, next, nestTree).map(
          (item) => item.row.id,
        ),
      );
      return next;
    });
  };

  const startRowDrag = (event: React.MouseEvent, row: T) => {
    if (
      !nesting ||
      !draggableRows ||
      !onRowNestChange ||
      (event.target as HTMLElement).closest(
        "button, input, select, textarea, [data-table-action]",
      )
    ) {
      return;
    }

    const sourceRect = event.currentTarget.getBoundingClientRect();
    rowDragRef.current = {
      row,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - sourceRect.left,
      offsetY: event.clientY - sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      moved: false,
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    let currentDropTarget: RowDropTarget | null = null;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const drag = rowDragRef.current;
      if (!drag) return;

      const moved =
        Math.abs(moveEvent.clientX - drag.startX) > 4 ||
        Math.abs(moveEvent.clientY - drag.startY) > 4;
      if (!moved && !drag.moved) return;

      drag.moved = true;
      setDraggingRowId(drag.row.id);
      setDragGhost({
        title:
          typeof drag.row.name === "string" && drag.row.name.trim().length > 0
            ? drag.row.name
            : drag.row.id,
        left: moveEvent.clientX - drag.offsetX,
        top: moveEvent.clientY - drag.offsetY,
        width: 100,
        height: drag.height,
      });

      const targetElement = document
        .elementFromPoint(moveEvent.clientX, moveEvent.clientY)
        ?.closest("[data-table-row-id]");
      const targetId = targetElement?.getAttribute("data-table-row-id");
      if (!targetElement || !targetId || targetId === drag.row.id) {
        currentDropTarget = null;
        setRowDropTarget(null);
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();
      currentDropTarget = {
        rowId: targetId,
        placeAfter: moveEvent.clientY > targetRect.top + targetRect.height / 2,
      };
      setRowDropTarget(currentDropTarget);
    };

    const handleMouseUp = () => {
      const drag = rowDragRef.current;
      const dropTarget = currentDropTarget;
      rowDragRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      setDraggingRowId(null);
      setDragGhost(null);
      setRowDropTarget(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (!drag?.moved) {
        return;
      }

      const targetRow = visibleRows.find(
        (item) => item.row.id === dropTarget?.rowId,
      )?.row;
      if (!dropTarget || !targetRow || targetRow.id === drag.row.id) return;

      onRowNestChange(targetRow, drag.row, nestTree, dropTarget.placeAfter);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const commitCellChange = (row: T, columnKey: string, value: unknown) => {
    const key = getCellKey(row.id, columnKey);
    const column = tableState.getColumn(columnKey).column;
    const validationError = column.validate?.(value, row);

    if (validationError) {
      setCellErrors((previous) => ({ ...previous, [key]: validationError }));
      return;
    }

    setCellErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });

    const result = onCellChange?.(row.id, columnKey, value, row);
    if (isPromiseLike(result)) {
      setSavingCells((previous) => ({ ...previous, [key]: true }));
      if (editableSaveMode === "optimistic") {
        setActiveCell((current) =>
          current?.rowId === row.id && current.columnKey === columnKey
            ? null
            : current,
        );
      }
      void result
        .then(() => {
          setSavingCells((previous) => {
            const next = { ...previous };
            delete next[key];
            return next;
          });
          setActiveCell((current) =>
            current?.rowId === row.id && current.columnKey === columnKey
              ? null
              : current,
          );
        })
        .catch((error) => {
          setSavingCells((previous) => {
            const next = { ...previous };
            delete next[key];
            return next;
          });
          setCellErrors((previous) => ({
            ...previous,
            [key]:
              error instanceof Error ? error.message : "Не удалось сохранить",
          }));
          setActiveCell({ rowId: row.id, columnKey });
        });
      return;
    }

    setActiveCell((current) =>
      current?.rowId === row.id && current.columnKey === columnKey
        ? null
        : current,
    );
  };

  const startColumnResize = (
    event: React.MouseEvent,
    columnState: TableColumnState<T>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (columnState.column.fixedWidth) return;

    const startX = event.clientX;
    const startWidth = columnState.width;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const minWidth =
        columnState.column.minResizeWidth ?? tableConfig.minColumnResizeWidth;
      const nextWidth = Math.max(
        minWidth,
        startWidth + moveEvent.clientX - startX,
      );
      tableState.setColumnWidth(columnState.column.key, nextWidth);
      setRevision((value) => value + 1);
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      persistState();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <section
      ref={rootRef}
      className={classes(tableStyles.root, externalStickyHeader && tableStyles.externalRoot, className)}
      style={externalStickyHeader ? { "--shkit-table-sticky-top": `${stickyHeader?.offsetTop ?? 0}px` } as React.CSSProperties : undefined}
      data-revision={revision}
    >
      {toolbar && (
        <div ref={toolbarRef} className={classes(tableStyles.toolbar, externalStickyHeader && tableStyles.stickyToolbar)}>
          <div className={tableStyles.toolbarGroup}>
            <Dropdown
              trigger={
                <Button type="button" size="sm" variant="outline">
                  {messages.table.columns}
                </Button>
              }
            >
              <div className={tableStyles.columnsDropdown}>
                {tableState.getOrderedColumns().map((column) => (
                  <Checkbox
                    key={column.column.key}
                    checked={!column.hidden}
                    onChange={() => toggleColumn(column.column.key)}
                    label={column.column.name}
                  />
                ))}
              </div>
            </Dropdown>

            <Dropdown
              trigger={
                <Button
                  type="button"
                  aria-label={messages.table.pinColumn}
                  icon={<Icon name="pin" size={18} />}
                  size="sm"
                  square
                  tooltip={messages.table.pinColumn}
                  tooltipPlacement="bottom"
                  variant={pinnedColumnId ? "secondary" : "outline"}
                />
              }
            >
              <Menu
                items={[
                  {
                    key: "none",
                    label: messages.table.notDefined,
                    selected: !pinnedColumnId,
                  },
                  ...visibleColumns.map((column) => ({
                    key: column.column.key,
                    label: column.column.name,
                    selected: pinnedColumnId === column.column.key,
                  })),
                ]}
                onSelect={(key) => setPinnedColumn(key === "none" ? null : key)}
              />
            </Dropdown>

            {filterEnabled && (
              <Dropdown
                offsetX={filtersOffsetX}
                trigger={
                  <span className={tableStyles.iconAction}>
                    <Button
                      type="button"
                      aria-label={messages.table.filters}
                      icon={<Icon name="filter" size={18} />}
                      size="sm"
                      square
                      tooltip={
                        activeFilterCount > 0
                          ? `${messages.table.filters}: ${activeFilterCount}`
                          : messages.table.filters
                      }
                      tooltipPlacement="bottom"
                      variant={activeFilterCount > 0 ? "secondary" : "outline"}
                    />
                    {activeFilterCount > 0 && (
                      <span className={tableStyles.iconBadge}>
                        {activeFilterCount}
                      </span>
                    )}
                  </span>
                }
              >
                <TableFilterPanel
                  columns={visibleColumns.map((column) => column.column)}
                  rules={filterRules}
                  onAddRule={addFilterRule}
                  onChangeRules={(updater) => setFilterRulesAndPersist(updater)}
                  onClear={clearFilters}
                />
              </Dropdown>
            )}

            <Button
              type="button"
              aria-label={messages.table.resetState}
              icon={<Icon name="reset" size={18} />}
              onClick={resetTableState}
              size="sm"
              square
              tooltip={messages.table.resetState}
              tooltipPlacement="bottom"
              variant="ghost"
            />
            {exportEnabled && (
              <Dropdown
                open={exportOpen}
                onOpenChange={setExportOpen}
                trigger={
                  <Button
                    type="button"
                    aria-label={messages.table.exportTable}
                    icon={<Icon name="export" size={18} />}
                    size="sm"
                    square
                    tooltip={messages.table.exportTable}
                    tooltipPlacement="bottom"
                    variant="ghost"
                  />
                }
              >
                <Menu
                  items={[
                    { key: "all-xlsx", label: messages.table.exportAllXlsx },
                    {
                      key: "filtered-xlsx",
                      label: messages.table.exportFilteredXlsx,
                    },
                    { key: "all-csv", label: messages.table.exportAllCsv },
                    {
                      key: "filtered-csv",
                      label: messages.table.exportFilteredCsv,
                    },
                  ]}
                  onSelect={exportTable}
                />
              </Dropdown>
            )}
          </div>

          <div className={tableStyles.meta}>
            {activeFilterCount > 0 && (
              <span className={tableStyles.filterBadge}>
                {messages.table.activeFilters(activeFilterCount)}
              </span>
            )}
            {visibleRows.length} {messages.table.visibleRows} / {data.length}{" "}
            {messages.table.rows}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className={classes(tableStyles.tableShell(hideVerticalScroll), externalStickyHeader && tableStyles.externalShell)}
        style={{ maxHeight }}
        onScroll={externalStickyHeader ? undefined : scheduleViewportUpdate}
      >
        {pinnedColumn && (
          <div
            className={tableStyles.pinnedColumn}
            style={{
              gridTemplateColumns: `${pinnedColumn.width}px`,
              gridTemplateRows: `${TABLE_HEADER_HEIGHT}px ${bodyHeight}px`,
            }}
          >
            <HeaderCell
              columnState={pinnedColumn}
              externalSticky={externalStickyHeader}
              pinned
              dragging={draggingColumnKey === pinnedColumn.column.key}
              onDragStart={startColumnDrag}
              onResizeStart={startColumnResize}
              refCallback={setColumnRef}
            />
            <div
              className={tableStyles.virtualBody}
              style={{ height: bodyHeight }}
            >
              <div
                className={tableStyles.virtualRows}
                style={{
                  gridTemplateColumns: `${pinnedColumn.width}px`,
                  gridTemplateRows: renderedRowsTemplate,
                  transform: `translateY(${rowsOffset}px)`,
                }}
              >
                {renderedRows.map(
                  ({ row, level, hasChildren, nestInfo }, visibleIndex) => (
                    <BodyCell
                      key={row.id}
                      row={row}
                      rowIndex={startIndex + visibleIndex}
                      column={pinnedColumn.column}
                      rowHeight={rowHeight}
                      roundDigits={roundDigits}
                      nesting={nesting && pinnedColumn.column.key === treeColumnKey}
                      level={level}
                      nestInfo={nestInfo}
                      hasChildren={hasChildren}
                      expanded={expandedIds.has(row.id)}
                      onToggle={() => toggleRow(row.id)}
                      active={
                        activeCell?.rowId === row.id &&
                        activeCell.columnKey === pinnedColumn.column.key
                      }
                      saving={Boolean(
                        savingCells[
                          getCellKey(row.id, pinnedColumn.column.key)
                        ],
                      )}
                      error={
                        cellErrors[getCellKey(row.id, pinnedColumn.column.key)]
                      }
                      onEditStart={() =>
                        setActiveCell({
                          rowId: row.id,
                          columnKey: pinnedColumn.column.key,
                        })
                      }
                      onEditCancel={() => setActiveCell(null)}
                      onCellChange={commitCellChange}
                      highlighted={
                        highlightedCell?.rowIndex ===
                          startIndex + visibleIndex &&
                        highlightedCell.fieldId === pinnedColumn.column.key
                      }
                      dragging={draggingRowId === row.id}
                      dropMode={
                        rowDropTarget?.rowId === row.id
                          ? rowDropTarget.placeAfter
                            ? "after"
                            : "inside"
                          : undefined
                      }
                      onClick={onCellClick}
                      onDragStart={startRowDrag}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        <div className={tableStyles.scrollArea}>
          <div
            className={tableStyles.scrollGrid}
            style={{
              gridTemplateColumns: scrollColumnsTemplate,
              gridTemplateRows: `${TABLE_HEADER_HEIGHT}px ${bodyHeight}px`,
              minWidth: scrollColumnWidths.reduce(
                (sum, width) => sum + width,
                0,
              ),
            }}
          >
            {scrollColumns.map((column) => (
              <HeaderCell
                key={column.column.key}
                columnState={column}
                externalSticky={externalStickyHeader}
                pinned={false}
                dragging={draggingColumnKey === column.column.key}
                onDragStart={startColumnDrag}
                onResizeStart={startColumnResize}
                refCallback={setColumnRef}
              />
            ))}
            {scrollColumns.length > 0 && (
              <div
                className={tableStyles.virtualBody}
                style={{
                  gridColumn: `1 / span ${scrollColumns.length}`,
                  height: bodyHeight,
                }}
              >
                {hasEmptyState && (
                  <div className={tableStyles.emptyState}>
                    {loading
                      ? messages.table.loading
                      : (emptyText ?? messages.table.emptyText)}
                  </div>
                )}
                <div
                  className={tableStyles.virtualRows}
                  style={{
                    gridTemplateColumns: scrollColumnsTemplate,
                    gridTemplateRows: renderedRowsTemplate,
                    transform: `translateY(${rowsOffset}px)`,
                  }}
                >
                  {renderedRows.map(({ row, nestInfo }, visibleIndex) =>
                    scrollColumns.map((column) => (
                      <BodyCell
                        key={`${row.id}-${column.column.key}`}
                        row={row}
                        rowIndex={startIndex + visibleIndex}
                        column={column.column}
                        rowHeight={rowHeight}
                        roundDigits={roundDigits}
                        nesting={nesting && column.column.key === treeColumnKey}
                        level={renderedRows[visibleIndex].level}
                        nestInfo={nestInfo}
                        hasChildren={renderedRows[visibleIndex].hasChildren}
                        expanded={expandedIds.has(row.id)}
                        onToggle={() => toggleRow(row.id)}
                        active={
                          activeCell?.rowId === row.id &&
                          activeCell.columnKey === column.column.key
                        }
                        saving={Boolean(
                          savingCells[getCellKey(row.id, column.column.key)],
                        )}
                        error={
                          cellErrors[getCellKey(row.id, column.column.key)]
                        }
                        onEditStart={() =>
                          setActiveCell({
                            rowId: row.id,
                            columnKey: column.column.key,
                          })
                        }
                        onEditCancel={() => setActiveCell(null)}
                        onCellChange={commitCellChange}
                        highlighted={
                          highlightedCell?.rowIndex ===
                            startIndex + visibleIndex &&
                          highlightedCell.fieldId === column.column.key
                        }
                        dragging={draggingRowId === row.id}
                        dropMode={
                          rowDropTarget?.rowId === row.id
                            ? rowDropTarget.placeAfter
                              ? "after"
                              : "inside"
                            : undefined
                        }
                        onClick={onCellClick}
                        onDragStart={startRowDrag}
                      />
                    )),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {alwaysHorizontalScroll && (
        <div
          ref={horizontalBarRef}
          className={tableStyles.horizontalScrollbar}
          role="region"
          aria-label="Horizontal table scroll"
          tabIndex={0}
          hidden
        >
          <div ref={horizontalTrackRef} className={tableStyles.horizontalScrollTrack} />
        </div>
      )}
      {dragGhost && <DragGhostView ghost={dragGhost} />}
    </section>
  );
};

const HeaderCell = <T extends TableRowBase>({
  columnState,
  externalSticky,
  pinned,
  dragging,
  onDragStart,
  onResizeStart,
  refCallback,
}: {
  columnState: TableColumnState<T>;
  externalSticky: boolean;
  pinned: boolean;
  dragging: boolean;
  onDragStart: (event: React.MouseEvent, columnKey: string) => void;
  onResizeStart: (
    event: React.MouseEvent,
    columnState: TableColumnState<T>,
  ) => void;
  refCallback: (columnKey: string, element: HTMLDivElement | null) => void;
}) => {
  const column = columnState.column;

  return (
    <div
      ref={(element) => refCallback(column.key, element)}
      className={classes(
        tableStyles.headerCell,
        externalSticky && tableStyles.stickyHeaderCell,
        dragging && tableStyles.headerDragging,
      )}
      onMouseDown={(event) => onDragStart(event, column.key)}
    >
      <span>{column.name}</span>
      {pinned && (
        <Tooltip content="Закреплено" placement="bottom">
          <span aria-label="Закреплено" className={tableStyles.pinnedMark}>
            <Icon name="pin" size={14} />
          </span>
        </Tooltip>
      )}
      <div
        data-table-action
        className={tableStyles.resizeHandle}
        onMouseDown={(event) => onResizeStart(event, columnState)}
      />
    </div>
  );
};

const BodyCell = <T extends TableRowBase>({
  row,
  rowIndex,
  column,
  rowHeight,
  roundDigits,
  nesting,
  level = 0,
  nestInfo,
  hasChildren,
  expanded,
  onToggle,
  active,
  saving,
  error,
  highlighted,
  dragging,
  dropMode,
  onEditStart,
  onEditCancel,
  onCellChange,
  onClick,
  onDragStart,
}: {
  row: T;
  rowIndex: number;
  column: TableColumn<T>;
  rowHeight: number;
  roundDigits?: number;
  nesting?: boolean;
  level?: number;
  nestInfo?: NestInfo;
  hasChildren?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  active?: boolean;
  saving?: boolean;
  error?: string;
  highlighted?: boolean;
  dragging?: boolean;
  dropMode?: "inside" | "after";
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onCellChange?: (row: T, columnKey: string, value: unknown) => void;
  onClick?: (rowIndex: number, columnKey: string, row: T) => void;
  onDragStart?: (event: React.MouseEvent, row: T) => void;
}) => {
  const rawValue = row[column.key];
  const displayContent = column.render
    ? column.render({ value: rawValue, data: row, rowIndex, nestInfo })
    : formatCellValue(rawValue, column, roundDigits);
  const content =
    column.editable && active ? (
      <EditableCell
        value={rawValue}
        column={column}
        saving={saving}
        error={error}
        classNames={{
          editingWrap: tableStyles.editingWrap,
          editCheckbox: tableStyles.editCheckbox,
          editControl: tableStyles.editControl(rowHeight),
          cellSpinner: tableStyles.cellSpinner,
        }}
        onCommit={(value) => onCellChange?.(row, column.key, value)}
        onCancel={onEditCancel}
      />
    ) : column.editable ? (
      <button
        type="button"
        className={classes(
          tableStyles.editableDisplay,
          error && tableStyles.editableDisplayError,
        )}
        disabled={saving}
        title={error}
        onClick={onEditStart}
      >
        <span>{displayContent}</span>
        {saving && <span className={tableStyles.cellSpinner} />}
      </button>
    ) : (
      displayContent
    );

  return (
    <div
      className={classes(
        tableStyles.bodyCell(rowHeight, nesting),
        highlighted && tableStyles.highlightedCell,
        dragging && tableStyles.draggingRowCell,
        dropMode === "inside" && tableStyles.dropInsideCell,
        dropMode === "after" && tableStyles.dropAfterCell,
      )}
      data-table-row-id={row.id}
      title={typeof content === "string" ? content : undefined}
      onClick={() => onClick?.(rowIndex, column.key, row)}
      onMouseDown={(event) => onDragStart?.(event, row)}
    >
      {nesting && (
        <>
          <span style={{ width: level * TREE_INDENT, flexShrink: 0 }} />
          {hasChildren ? (
            <button
              type="button"
              className={tableStyles.treeToggle}
              onClick={onToggle}
            >
              <Icon
                name={expanded ? "chevron-down" : "chevron-right"}
                size={16}
              />
            </button>
          ) : (
            <span className={tableStyles.treeTogglePlaceholder} />
          )}
        </>
      )}
      {content}
    </div>
  );
};

const DragGhostView = ({ ghost }: { ghost: DragGhost }) => {
  return (
    <div
      className={tableStyles.dragGhost}
      style={{
        left: ghost.left,
        top: ghost.top,
        width: ghost.width,
        height: ghost.height,
      }}
    >
      <span className={tableStyles.dragGhostTitle}>{ghost.title}</span>
    </div>
  );
};

const formatCellValue = <T extends TableRowBase>(
  value: unknown,
  column: TableColumn<T>,
  roundDigits?: number,
) => {
  if (column.fieldType === "boolean") return value ? "true" : "false";
  if (column.fieldType === "select")
    return (
      column.selectOptions?.find((option) => option.value === value)?.label ??
      ""
    );
  if (typeof value === "number") return String(roundNumber(value, roundDigits));
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const toPlainText = (value: React.ReactNode): string => {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  return "";
};

const toCsvValue = (value: unknown) => {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const isPromiseLike = (value: unknown): value is Promise<void> => {
  return Boolean(value && typeof (value as Promise<void>).then === "function");
};

type DragSession = {
  columnKey: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

type RowDragSession<T extends TableRowBase> = {
  row: T;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  moved: boolean;
};

type RowDropTarget = {
  rowId: string;
  placeAfter: boolean;
};

type DragGhost = {
  title: React.ReactNode;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ActiveCell = {
  rowId: string;
  columnKey: string;
};

type VisibleTreeRow<T extends TableRowBase> = {
  row: T;
  level: number;
  hasChildren: boolean;
  nestInfo?: NestInfo;
};

const getVisibleTreeRows = <T extends TableRowBase>(
  rows: T[],
  expandedIds: Set<string>,
  nestTree = buildNestTree(rows),
): Array<VisibleTreeRow<T>> => {
  const childrenByParent = getChildrenByParent(rows);
  const result: Array<VisibleTreeRow<T>> = [];
  const walk = (parentId: string | null, level: number) => {
    for (const row of childrenByParent.get(parentId) ?? []) {
      const children = childrenByParent.get(row.id) ?? [];
      result.push({
        row,
        level,
        hasChildren: children.length > 0,
        nestInfo: nestTree[row.id],
      });
      if (children.length > 0 && expandedIds.has(row.id)) {
        walk(row.id, level + 1);
      }
    }
  };

  walk(null, 0);
  return result;
};

const buildNestTree = <T extends TableRowBase>(rows: T[]): NestTree => {
  const childrenByParent = getChildrenByParent(rows);
  const tree: NestTree = {};

  rows.forEach((row) => {
    tree[row.id] = {
      level: 0,
      wbs: "1",
      children: childrenByParent.get(row.id)?.map((child) => child.id) ?? [],
      parent: row.parentId ?? null,
    };
  });

  let rootIndex = 1;
  const walk = (parentId: string | null, level: number, prefix?: string) => {
    const children = childrenByParent.get(parentId) ?? [];
    children.forEach((row, index) => {
      const wbs = prefix ? `${prefix}.${index + 1}` : `${rootIndex++}`;
      tree[row.id] = {
        ...tree[row.id],
        level,
        wbs,
        parent: parentId,
      };
      walk(row.id, level + 1, wbs);
    });
  };

  walk(null, 0);
  return tree;
};

const getChildrenByParent = <T extends TableRowBase>(rows: T[]) => {
  const rowIds = new Set(rows.map((row) => row.id));
  const childrenByParent = new Map<string | null, T[]>();
  rows.forEach((row) => {
    const parentId =
      row.parentId && rowIds.has(row.parentId) ? row.parentId : null;
    childrenByParent.set(parentId, [
      ...(childrenByParent.get(parentId) ?? []),
      row,
    ]);
  });
  return childrenByParent;
};

const normalizeExportValue = <T extends TableRowBase>(
  value: unknown,
  column: TableColumn<T>,
  roundDigits?: number,
) => {
  if (column.fieldType === "select") {
    return (
      column.selectOptions?.find((option) => option.value === value)?.label ??
      value
    );
  }

  if (typeof value === "number") {
    return roundNumber(value, roundDigits);
  }

  if (column.fieldType === "number" && typeof value === "string") {
    const normalized = value.trim().replace(/\s+/g, "");
    if (/^[+-]?\d+(\.\d+)?$/.test(normalized)) {
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? roundNumber(parsed, roundDigits) : value;
    }
  }

  return value;
};

const roundNumber = (value: number, roundDigits?: number) => {
  return roundDigits === undefined ? value : Number(value.toFixed(roundDigits));
};

const tableStyles = {
  root: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    display: "grid",
    overflow: "hidden",
  }),
  hiddenVerticalScrollbar: style({
    $nest: {
      "&&::-webkit-scrollbar": { width: 0 },
      "@supports not selector(::-webkit-scrollbar)": { scrollbarWidth: "none" },
    },
  }),
  horizontalScrollbar: style({
    background: color.surface,
    bottom: 0,
    boxSizing: "border-box",
    height: 16,
    left: 0,
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "scroll",
    overflowY: "hidden",
    position: "sticky",
    justifySelf: "start",
    zIndex: `calc(${zIndex.sticky} + 3)`,
    $nest: {
      ...scrollbar,
      "&[hidden]": { display: "none" },
    },
  }),
  horizontalScrollTrack: style({ height: 1 }),
  externalRoot: style({
    boxSizing: "border-box",
    overflow: "visible",
    minWidth: "max-content",
    width: "100%",
  }),
  externalShell: style({
    // Override both axes of the dynamically generated shell class.
    $nest: { "&&": { overflow: "visible" } },
  }),
  stickyToolbar: style({
    position: "sticky",
    top: "var(--shkit-table-sticky-top, 0px)",
    left: 0,
    width: "var(--shkit-table-viewport-width, 100%)",
    boxSizing: "border-box",
    justifySelf: "start",
    zIndex: `calc(${zIndex.sticky} + 2)`,
  }),
  stickyHeaderCell: style({
    $nest: {
      "&&": {
        top: "calc(var(--shkit-table-sticky-top, 0px) + var(--shkit-table-toolbar-height, 0px))",
      },
    },
  }),
  toolbar: style({
    alignItems: "center",
    background: color.surfaceMuted,
    borderBottom: `1px solid ${color.border}`,
    display: "flex",
    gap: space[10],
    justifyContent: "space-between",
    padding: space[10],
  }),
  toolbarGroup: style({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space[6],
    minWidth: 0,
  }),
  iconAction: style({
    display: "inline-flex",
    position: "relative",
  }),
  iconBadge: style({
    alignItems: "center",
    background: color.danger,
    border: `2px solid ${color.surfaceMuted}`,
    borderRadius: 999,
    color: color.surface,
    display: "inline-flex",
    fontSize: 10,
    fontWeight: 900,
    height: 18,
    justifyContent: "center",
    lineHeight: 1,
    minWidth: 18,
    padding: "0 4px",
    pointerEvents: "none",
    position: "absolute",
    right: -7,
    top: -7,
  }),
  columnsDropdown: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 14px 34px rgba(25, 25, 25, 0.16)",
    display: "inline-flex",
    flexDirection: "column",
    gap: space[6],
    minWidth: 220,
    padding: space[10],
  }),
  meta: style({
    alignItems: "center",
    color: color.textMuted,
    display: "inline-flex",
    flexShrink: 0,
    fontSize: 13,
    fontWeight: 700,
    gap: space[8],
    paddingTop: 8,
    textAlign: "right",
  }),
  filterBadge: style({
    background: color.surfaceSecondary,
    borderRadius: radius.xs,
    color: color.primary,
    fontSize: 12,
    fontWeight: 900,
    padding: "3px 7px",
  }),
  tableShell: (hideVerticalScroll: boolean) =>
    style({
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
      minHeight: 0,
      overflowX: "auto",
      overflowY: hideVerticalScroll ? "hidden" : "auto",
      $nest: scrollbar,
    }),
  pinnedColumn: style({
    boxShadow: "4px 0 16px rgba(25, 25, 25, 0.12)",
    display: "grid",
    position: "sticky",
    left: 0,
    zIndex: `calc(${zIndex.sticky} + 1)`,
  }),
  scrollArea: style({
    minWidth: 0,
    overflow: "visible",
  }),
  scrollGrid: style({
    display: "grid",
  }),
  virtualBody: style({
    minWidth: 0,
    overflow: "hidden",
    position: "relative",
  }),
  emptyState: style({
    alignItems: "center",
    color: color.textSubtle,
    display: "flex",
    fontSize: 14,
    fontWeight: 900,
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  }),
  virtualRows: style({
    display: "grid",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    willChange: "transform",
  }),
  headerCell: style({
    alignItems: "center",
    background: color.primary,
    borderBottom: `2px solid ${color.surface}`,
    borderRight: `2px solid ${color.surface}`,
    color: color.surface,
    cursor: "grab",
    display: "flex",
    fontSize: 14,
    fontWeight: 800,
    gap: space[8],
    justifyContent: "space-between",
    minHeight: 40,
    overflow: "hidden",
    padding: `0 ${space[10]}px`,
    position: "sticky",
    top: 0,
    userSelect: "none",
    zIndex: zIndex.sticky,
    $nest: {
      "& span": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      "&:hover": {
        background: color.primaryHover,
      },
    },
  }),
  headerDragging: style({
    opacity: 0.68,
  }),
  pinnedMark: style({
    alignItems: "center",
    background: "rgba(255,255,255,0.14)",
    borderRadius: radius.xs,
    color: color.surface,
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    padding: 3,
  }),
  resizeHandle: style({
    bottom: 0,
    cursor: "col-resize",
    position: "absolute",
    right: -2,
    top: 0,
    width: 8,
    $nest: {
      "&:hover": {
        background: "#d0d7de",
      },
    },
  }),
  bodyCell: (rowHeight: number, nesting = false) =>
    style({
      alignItems: "center",
      background: color.surface,
      borderBottom: `1px solid ${color.border}`,
      borderRight: `1px solid ${color.border}`,
      boxSizing: "border-box",
      color: color.text,
      display: "flex",
      fontSize: 13,
      height: rowHeight,
      overflow: "hidden",
      padding: `0 ${space[10]}px 0 ${nesting ? 4 : space[10]}px`,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
  highlightedCell: style({
    background: color.surfaceSecondary,
  }),
  draggingRowCell: style({
    opacity: 0.42,
  }),
  dropInsideCell: style({
    background: "#E8F7EA",
    boxShadow: `inset 0 0 0 2px ${color.primary}`,
  }),
  dropAfterCell: style({
    background: color.surface,
    boxShadow: `inset 0 -3px 0 ${color.primary}`,
  }),
  editControl: (rowHeight: number) => {
    const controlHeight = Math.min(32, Math.max(rowHeight - 12, 24));

    return style({
      alignItems: "center",
      alignSelf: "stretch",
      display: "flex",
      flex: 1,
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      width: "100%",
      $nest: {
        "& > span:first-of-type": {
          borderRadius: radius.xs,
          borderWidth: 1,
          boxSizing: "border-box",
          height: controlHeight,
          maxHeight: "100%",
          minHeight: 0,
          padding: `0 ${space[6]}px`,
          $nest: {
            "&:focus-within": {
              boxShadow: "none",
            },
          },
        },
        "& > span + span": {
          display: "none",
        },
        "& > button": {
          borderRadius: radius.xs,
          borderWidth: 1,
          boxSizing: "border-box",
          height: controlHeight,
          maxHeight: "100%",
          minHeight: controlHeight,
          padding: `0 ${space[6]}px`,
          $nest: {
            "&:focus-visible": {
              boxShadow: "none",
            },
          },
        },
      },
    });
  },
  editingWrap: style({
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
    flex: 1,
    gap: space[8],
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    width: "100%",
  }),
  editableDisplay: style({
    alignItems: "center",
    background: "transparent",
    border: `1px solid transparent`,
    borderRadius: radius.xs,
    color: "inherit",
    cursor: "text",
    display: "flex",
    fontSize: 13,
    fontWeight: 700,
    gap: space[8],
    height: "calc(100% - 8px)",
    justifyContent: "space-between",
    minWidth: 0,
    overflow: "hidden",
    padding: `0 ${space[6]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.surfaceMuted,
        borderColor: color.borderStrong,
      },
      "&:focus-visible": {
        borderColor: color.primary,
        outline: "none",
      },
      "&:disabled": {
        cursor: "wait",
      },
      "& span:first-child": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  }),
  editableDisplayError: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    color: color.danger,
  }),
  editCheckbox: style({
    marginLeft: 2,
  }),
  cellSpinner: style({
    animationDuration: "0.75s",
    animationIterationCount: "infinite",
    animationName: shkitSpin,
    animationTimingFunction: "linear",
    border: `2px solid ${color.primary}`,
    borderRadius: radius.round,
    borderRightColor: "transparent",
    flexShrink: 0,
    height: 14,
    width: 14,
  }),
  treeToggle: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    color: color.primary,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    fontSize: 18,
    fontWeight: 900,
    height: 22,
    justifyContent: "center",
    padding: 0,
    width: TREE_TOGGLE_WIDTH,
  }),
  treeTogglePlaceholder: style({
    flexShrink: 0,
    height: 22,
    width: TREE_TOGGLE_WIDTH,
  }),
  dragGhostTitle: style({
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "clip",
    whiteSpace: "nowrap",
  }),
  dragGhost: style({
    alignItems: "center",
    background: color.primary,
    border: `2px solid ${color.accent}`,
    borderRadius: radius.sm,
    boxSizing: "border-box",
    boxShadow: "0 18px 42px rgba(25, 25, 25, 0.22)",
    color: color.surface,
    display: "flex",
    fontSize: 14,
    fontWeight: 900,
    justifyContent: "space-between",
    opacity: 0.92,
    padding: `0 ${space[10]}px`,
    pointerEvents: "none",
    position: "fixed",
    zIndex: zIndex.dragOverlay,
  }),
};
