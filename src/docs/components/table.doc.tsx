import { useMemo, useState } from "react";
import {
  Button,
  FilterOperator,
  SegmentedControl,
  Table,
  createLocalTableStateStorage,
  createMemoryTableStateStorage
} from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import type { HighlightedCell, NestTree, TableColumn, TableFilterRule, TableRowBase } from "../../components/Table";

type DemoRow = TableRowBase & {
  name: string;
  perimeter: number;
  area: number;
  status: string;
  active: boolean;
  dueDate: string;
};

type TableDemoMode = "compact" | "many" | "external" | "tree" | "editable" | "state" | "callbacks";

const names = ["Асфальт", "Песок", "Зона склада", "Котлован", "Дорога", "Насыпь", "Плита", "Выемка"];
const statuses = ["Готово", "В работе", "Проверка", "Ожидает"];

const demoRows: DemoRow[] = Array.from({ length: 128 }, (_, index) => {
  const number = index + 1;

  return {
    id: String(number),
    name: `${names[index % names.length]} ${String(number).padStart(3, "0")}`,
    perimeter: Number((180 + ((index * 37) % 420) + index / 100).toFixed(4)),
    area: Number((900 + ((index * 113) % 5200) + index / 10).toFixed(4)),
    status: statuses[index % statuses.length],
    active: index % 3 !== 0,
    dueDate: `2026-05-${String((index % 20) + 1).padStart(2, "0")}`
  };
});

const compactRows = demoRows.slice(0, 8);

const treeRows: DemoRow[] = [
  { id: "root-1", name: "Корпус 1", perimeter: 1200, area: 8420, status: "В работе", active: true, dueDate: "2026-05-14" },
  { id: "root-1-1", parentId: "root-1", name: "Секция 1.1", perimeter: 420, area: 2100, status: "Готово", active: true, dueDate: "2026-05-16" },
  { id: "root-1-2", parentId: "root-1", name: "Секция 1.2", perimeter: 380, area: 1980, status: "Проверка", active: false, dueDate: "2026-05-18" },
  { id: "root-1-2-1", parentId: "root-1-2", name: "Помещение 1.2.A", perimeter: 110, area: 430, status: "В работе", active: true, dueDate: "2026-05-19" },
  { id: "root-2", name: "Корпус 2", perimeter: 980, area: 6900, status: "Ожидает", active: false, dueDate: "2026-05-21" },
  { id: "root-2-1", parentId: "root-2", name: "Секция 2.1", perimeter: 330, area: 1710, status: "В работе", active: true, dueDate: "2026-05-22" },
  { id: "root-2-2", parentId: "root-2", name: "Секция 2.2", perimeter: 345, area: 1900, status: "Готово", active: true, dueDate: "2026-05-23" }
];

const demoColumns: Array<TableColumn<DemoRow>> = [
  {
    key: "name",
    name: "Название",
    initialWidth: 170,
    fieldType: "string",
    validate: value => (String(value ?? "").trim().length < 3 ? "Минимум 3 символа" : null)
  },
  { key: "perimeter", name: "Периметр, м", initialWidth: 130, fieldType: "number" },
  { key: "area", name: "Площадь, м", initialWidth: 130, fieldType: "number" },
  { key: "status", name: "Статус", initialWidth: 140, fieldType: "select", selectOptions: statuses.map(status => ({ label: status, value: status })) },
  { key: "active", name: "На карте", initialWidth: 100, fieldType: "boolean" },
  { key: "dueDate", name: "Срок", initialWidth: 130, fieldType: "date" }
];

const editableColumns: Array<TableColumn<DemoRow>> = demoColumns.map(column => ({ ...column, editable: true }));

const stateDemoFilters: TableFilterRule[] = [
  {
    id: 1,
    columnKey: "status",
    condition: "and",
    operator: FilterOperator.StringIsAnyOf,
    value: ["В работе", "Проверка"]
  }
];

const storage = createMemoryTableStateStorage({
  "demoTable-external": {
    pinnedColumnId: "name"
  },
  demoTable: {
    name: { order: 0, width: 170, hidden: false },
    perimeter: { order: 1, width: 130, hidden: false },
    area: { order: 2, width: 130, hidden: false },
    status: { order: 3, width: 120, hidden: false },
    _filters: [],
    pinnedColumnId: "name"
  },
  statefulDemoTable: {
    name: { order: 0, width: 190, hidden: false },
    perimeter: { order: 1, width: 130, hidden: false },
    area: { order: 2, width: 130, hidden: false },
    status: { order: 3, width: 150, hidden: false },
    active: { order: 4, width: 110, hidden: false },
    dueDate: { order: 5, width: 130, hidden: false },
    _filters: [
      {
        id: 1,
        key: "status",
        value: ["В работе", "Проверка"],
        operator: FilterOperator.StringIsAnyOf,
        conditionalWithPrevious: "and",
        filterFn: () => true
      }
    ],
    pinnedColumnId: "name"
  }
});

const localStorageDemo = createLocalTableStateStorage("shkit:table-doc-state", {
  statefulDemoTable: {
    name: { order: 0, width: 190, hidden: false },
    perimeter: { order: 1, width: 130, hidden: false },
    area: { order: 2, width: 130, hidden: false },
    status: { order: 3, width: 150, hidden: false },
    active: { order: 4, width: 110, hidden: false },
    dueDate: { order: 5, width: 130, hidden: false },
    _filters: [
      {
        id: 1,
        key: "status",
        value: ["В работе", "Проверка"],
        operator: FilterOperator.StringIsAnyOf,
        conditionalWithPrevious: "and",
        filterFn: () => true
      }
    ],
    pinnedColumnId: "name"
  }
});

export const getTableDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "table",
    name: "Table",
    importCode: 'import { Table } from "@ShKit";',
    description:
      "Базовый перенос продуктовой таблицы из front. Уже использует TableState, читает storage, управляет колонками, меняет порядок drag-and-drop, resize-ит ширины и фиксирует колонку слева.",    props: [
      { name: "id", type: "string", description: "Стабильный id таблицы для TableState и storage." },
      { name: "data", type: "T[]", description: "Строки таблицы. Каждая строка обязана иметь id." },
      { name: "columns", type: "TableColumn<T>[]", description: "Описание колонок, ширин, render, fieldType и minResizeWidth." },
      { name: "stateStorage", type: "TableStateStorage", description: "Адаптер загрузки/сохранения serialized state." },
      { name: "rowHeight", type: "number", defaultValue: "40", description: "Высота строк." },
      { name: "maxHeight", type: "number | string", description: "Ограничивает высоту таблицы и включает вертикальный скролл." },
      { name: "hideVerticalScroll", type: "boolean", defaultValue: "false", description: "Отключает внутреннюю вертикальную прокрутку Table. При stickyHeader скрывает вертикальную полосу внешнего scrollContainer, сохраняя его прокрутку. При отключении, смене контейнера и размонтировании восстанавливает оформление." },
      { name: "alwaysHorizontalScroll", type: "boolean", defaultValue: "false", description: "Показывает отдельную горизонтальную полосу внизу области таблицы при переполнении. При stickyHeader синхронизируется с внешним scrollContainer, иначе — с внутренним скроллом Table. Исходная горизонтальная полоса скрывается; ширина обновляется при ресайзе контейнера, изменении размеров, порядка и видимости колонок. scrollTop не меняется." },
      { name: "stickyHeader", type: "TableStickyHeader", description: "CSS sticky для верхней панели фильтров и заголовков: { scrollContainer: HTMLElement | null, offsetTop?: number }. Требует hideVerticalScroll=true, maxHeight=undefined, virtualized=false; несовместимые параметры вызывают ошибку. scrollContainer должен быть ближайшим предком со скроллом и владеть обеими осями; промежуточные overflow-контейнеры недопустимы. Передавайте элемент через callback ref + useState. offsetTop — отступ в px от внутреннего верхнего края контейнера, по умолчанию 0. Панель занимает ширину видимой области, остаётся слева при горизонтальной прокрутке. Заголовки используют ту же сетку, что и ячейки. ResizeObserver обновляет ширину панели и её высоту для отступа заголовков. Table не меняет scrollTop и не создаёт собственной полосы прокрутки в этом режиме." },
      { name: "virtualized", type: "boolean", defaultValue: "true", description: "Рендерит только строки viewport + overscan." },
      { name: "nesting", type: "boolean", defaultValue: "false", description: "Включает tree view по parentId." },
      { name: "nestingColumnKey", type: "string", description: "Ключ столбца для отступов вложенности и кнопок раскрытия дерева, независимо от порядка и закрепления столбцов. По умолчанию — первый отображаемый столбец. Для WBS можно указать \"N\"." },
      { name: "defaultTreeExpanded", type: "boolean", defaultValue: "true", description: "По умолчанию раскрывает tree view как старый ShTable без nestingCollapsed." },
      { name: "defaultExpandedIds", type: "string[]", description: "Начальные раскрытые узлы дерева." },
      { name: "filters", type: "TableFilterRule[]", description: "Controlled список составных фильтров." },
      { name: "defaultFilters", type: "TableFilterRule[]", description: "Начальные фильтры для uncontrolled режима." },
      { name: "filterEnabled", type: "boolean", defaultValue: "true", description: "Показывает filter builder и применяет правила фильтрации." },
      {
        name: "filtersOffsetX",
        type: "number",
        defaultValue: "0",
        description:
          "Сдвиг панели фильтров по горизонтали в px относительно кнопки фильтров. Положительное значение — вправо, отрицательное — влево, чтобы панель не перекрывала таблицу."
      },
      { name: "exportEnabled", type: "boolean", defaultValue: "true", description: "Показывает export меню." },
      { name: "exportFileName", type: "string", description: "Имя CSV/XLSX файла без расширения." },
      { name: "roundDigits", type: "number", description: "Округление чисел при отображении/export." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Показывает loading-состояние поверх body." },
      { name: "emptyText", type: "ReactNode", defaultValue: '"Нет данных"', description: "Текст пустой таблицы после фильтров или при отсутствии data." },
      { name: "toolbar", type: "boolean", defaultValue: "true", description: "Показывает toolbar управления колонками, pin, reset, filters и export." },
      { name: "onFiltersChange", type: "(filters) => void", description: "Событие изменения фильтров. Синхронизируется с TableState._filters." },
      { name: "onFilterUpdate", type: "({ visibleRows, filters }) => void", description: "Отдает отфильтрованные строки и serialized filters для внешней аналитики." },
      { name: "editableSaveMode", type: '"after-save" | "optimistic"', defaultValue: '"after-save"', description: "Когда закрывать редактор: после ответа callback или сразу оптимистично." },
      { name: "onCellChange", type: "(rowId, columnKey, value, row) => void | Promise<void>", description: "Событие сохранения editable cell. Promise включает loading до завершения." },
      { name: "highlightedCell", type: "HighlightedCell", description: "Подсвечивает конкретную ячейку по rowIndex + fieldId." },
      { name: "onCellClick", type: "(rowIndex, columnKey, row) => void", description: "Событие клика по ячейке для выбора источников/полей." },
      { name: "onCollapseTree", type: "(visibleIds) => void", description: "Отдает список видимых id после раскрытия/схлопывания дерева." },
      { name: "draggableRows", type: "boolean", defaultValue: "false", description: "Включает drag-to-nest строки в tree view." },
      { name: "onRowNestChange", type: "(targetRow, draggedRow, nestTree, placeAfter) => void", description: "Событие перестановки/вкладывания строки без встроенной мутации данных." },
      { name: "column.validate", type: "(value, row) => string | null", description: "Валидация editable cell до вызова onCellChange." },
      { name: "onTableStateChange", type: "(state: TableState<T>) => void", description: "Событие изменения TableState." }
    ],    usageCode: `<Table
  id="analytics"
  data={rows}
  columns={columns}
  stateStorage={storage}
  defaultFilters={[
    { id: 1, columnKey: "status", condition: "and", operator: "string_is_any_of", value: ["В работе"] }
  ]}
  editableSaveMode="after-save"
  onCellChange={async (rowId, columnKey, value) => {
    await api.saveCell(rowId, columnKey, value);
    setRows(rows => rows.map(row => row.id === rowId ? { ...row, [columnKey]: value } : row));
  }}
/>

// Внешний контейнер владеет обеими осями прокрутки.
function ExternalScrollTable({ rows, columns }) {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setScrollContainer}
      style={{ height: 420, overflow: "auto" }}

    >
      <Table
        id="external-scroll-table"
        data={rows}
        columns={columns}
        hideVerticalScroll
        virtualized={false}
        stickyHeader={{ scrollContainer }}
      alwaysHorizontalScroll
      />
    </div>
  );
}`,
    preview: <TablePreview />
  };
}

const TablePreview = () => {
  const [showToolbar, setShowToolbar] = useState(true);
  const [containerWidth, setContainerWidth] = useState(640);
  const [stickyOffset, setStickyOffset] = useState(0);
  const [mode, setMode] = useState<TableDemoMode>("many");
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [editableRows, setEditableRows] = useState(() => compactRows.map(row => ({ ...row })));
  const [treeDemoRows, setTreeDemoRows] = useState(() => treeRows.map(row => ({ ...row })));
  const [callbackFilters, setCallbackFilters] = useState<TableFilterRule[]>([
    {
      id: 101,
      columnKey: "status",
      condition: "and",
      operator: FilterOperator.StringIsNoneOf,
      value: ["Ожидает"]
    },
    {
      id: 102,
      columnKey: "dueDate",
      condition: "and",
      operator: FilterOperator.DateNotEq,
      value: "2026-05-01"
    }
  ]);
  const [selectedCell, setSelectedCell] = useState<HighlightedCell>({ rowIndex: 2, fieldId: "area" });
  const [visibleInfo, setVisibleInfo] = useState({ rows: demoRows.length, filters: 0 });
  const [visibleTreeIds, setVisibleTreeIds] = useState<string[]>([]);
  const data =
    mode === "compact"
      ? compactRows
      : mode === "tree"
        ? treeDemoRows
        : mode === "editable"
          ? editableRows
          : demoRows;
  const columns = mode === "editable" ? editableColumns : demoColumns;
  const tableId = mode === "state" ? "statefulDemoTable" : `demoTable-${mode}`;
  const callbackSummary = useMemo(
    () => `visible rows: ${visibleInfo.rows}, serialized filters: ${visibleInfo.filters}`,
    [visibleInfo]
  );

  const handleRowNestChange = (targetRow: DemoRow, draggedRow: DemoRow, _nestTree: NestTree, placeAfter: boolean) => {
    setTreeDemoRows(rows => {
      const nextRows = rows.map(row => (row.id === draggedRow.id ? { ...row, parentId: placeAfter ? targetRow.parentId : targetRow.id } : row));
      const withoutDragged = nextRows.filter(row => row.id !== draggedRow.id);
      const targetIndex = withoutDragged.findIndex(row => row.id === targetRow.id);
      const insertIndex = placeAfter ? targetIndex + 1 : targetIndex + 1;
      withoutDragged.splice(Math.max(insertIndex, 0), 0, nextRows.find(row => row.id === draggedRow.id)!);
      return withoutDragged;
    });
  };

  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <div style={{ maxWidth: 420, minWidth: 0 }}>
        <SegmentedControl
          fullWidth
          scrollable
          value={mode}
          onChange={setMode}
          options={[
            { label: "Compact table", value: "compact" },
            { label: "128 virtualized rows", value: "many" },
            { label: "External scroll", value: "external" },
            { label: "Tree drag and drop", value: "tree" },
            { label: "Editable cells", value: "editable" },
            { label: "Saved table state", value: "state" },
            { label: "Callbacks and highlight", value: "callbacks" }
          ]}
        />
      </div>
      {mode === "external" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <label><input type="checkbox" checked={showToolbar} onChange={event => setShowToolbar(event.target.checked)} /> Toolbar</label>
          <label>Ширина <input type="range" min={280} max={900} value={containerWidth} onChange={event => setContainerWidth(Number(event.target.value))} /></label>
          <label>offsetTop <input type="number" min={0} max={80} value={stickyOffset} onChange={event => setStickyOffset(Number(event.target.value))} /></label>
        </div>
      )}
      <div ref={setScrollContainer} style={mode === "external" ? { height: 420, overflow: "auto", width: containerWidth, maxWidth: "100%" } : undefined}>
        <Table
          id={tableId}
          data={data}
          columns={columns}
          stateStorage={mode === "state" ? localStorageDemo : storage}
          filters={mode === "callbacks" ? callbackFilters : undefined}
          defaultFilters={mode === "state" ? stateDemoFilters : []}
          filterEnabled={mode !== "compact"}
          toolbar={mode === "external" ? showToolbar : true}
          maxHeight={mode === "external" ? undefined : mode === "compact" ? 360 : 420}
          hideVerticalScroll={mode === "external"}
          virtualized={mode !== "external"}
          stickyHeader={mode === "external" ? { scrollContainer, offsetTop: stickyOffset } : undefined}
          alwaysHorizontalScroll={mode === "external"}
          nesting={mode === "tree"}
          defaultTreeExpanded={mode !== "tree"}
          defaultExpandedIds={["root-1", "root-1-2", "root-2"]}
          draggableRows={mode === "tree"}
          exportFileName="measurements"
          exportEnabled={mode !== "compact"}
          highlightedCell={mode === "callbacks" ? selectedCell : undefined}
          roundDigits={2}
          editableSaveMode="after-save"
          onCellClick={(rowIndex, fieldId) => {
            if (mode === "callbacks") {
              setSelectedCell({ rowIndex, fieldId });
            }
          }}
          onCellChange={(rowId, columnKey, value) => {
            return new Promise(resolve => {
              window.setTimeout(() => {
                setEditableRows(rows => rows.map(row => (row.id === rowId ? { ...row, [columnKey]: value } : row)));
                resolve();
              }, 650);
            });
          }}
          onCollapseTree={ids => setVisibleTreeIds(ids)}
          onFiltersChange={mode === "callbacks" ? setCallbackFilters : undefined}
          onFilterUpdate={
            mode === "callbacks"
              ? ({ visibleRows, filters }) => setVisibleInfo({ rows: visibleRows.length, filters: filters.length })
              : undefined
          }
          onRowNestChange={handleRowNestChange}
        />
      </div>
      {mode === "many" && <Button size="sm" variant="secondary">Virtualized viewport: 128 rows</Button>}
      {mode === "tree" && (
        <Button size="sm" variant="secondary">
          Drag a row onto another row to call onRowNestChange. Visible ids: {visibleTreeIds.length || "not changed yet"}
        </Button>
      )}
      {mode === "state" && (
        <Button size="sm" variant="secondary">
          Resize/reorder/hide columns or change filters, switch tab, then return. Reset state is in the toolbar.
        </Button>
      )}
      {mode === "callbacks" && (
        <Button size="sm" variant="secondary">
          Click cells to move highlightedCell. {callbackSummary}
        </Button>
      )}
    </div>
  );
}
