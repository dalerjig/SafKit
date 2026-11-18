export type ComponentStatus = "foundation" | "ready-to-port" | "planned" | "research";

export type ComponentCard = {
  name: string;
  futureImport: string;
  source: string;
  status: ComponentStatus;
  summary: string;
  responsibilities: string[];
  apiNotes: string[];
};

export const statusLabels: Record<ComponentStatus, string> = {
  foundation: "Основа системы",
  "ready-to-port": "Готов к переносу",
  planned: "Запланирован",
  research: "Нужно разложить"
};

export const componentCards: ComponentCard[] = [
  {
    name: "Nested Menu",
    futureImport: "{ Menu } from \"@ShKit\" с submenu support",
    source: "Dropdown + Menu roadmap",
    status: "planned",
    summary: "Расширение Menu для вложенных действий, если во front останутся реальные nested menu сценарии.",
    responsibilities: [
      "submenu trigger rows",
      "keyboard navigation между уровнями",
      "portal positioning for nested panels",
      "selected/disabled/danger states на всех уровнях"
    ],
    apiNotes: [
      "children?: MenuItem[]",
      "open delay и hover intent проверить отдельно",
      "не ломать простой Menu API"
    ]
  },
  {
    name: "Upload Transport Adapter",
    futureImport: "Upload transport contract",
    source: "Upload/Dragger integration notes",
    status: "planned",
    summary: "Контракт интеграции Upload UI с сетевой загрузкой: ShKit уже рисует picker/list, но transport должен остаться внешним или адаптерным.",
    responsibilities: [
      "native File lifecycle",
      "progress/error mapping",
      "retry/cancel hooks",
      "compat layer для старых RcFile-like сценариев"
    ],
    apiNotes: [
      "Upload UI не должен владеть сетью по умолчанию",
      "описать UploadListItem status/progress contract",
      "adapter может жить во front, если сценарии доменные"
    ]
  },
  {
    name: "Gantt",
    futureImport: "{ Gantt } from \"@ShKit\" или отдельный пакет",
    source: "front/src/components/sh-gantt",
    status: "research",
    summary: "Доменный компонент планирования; нужно решить, принадлежит ли он базовому ShKit.",
    responsibilities: [
      "timeline rows",
      "task bars",
      "connections",
      "drag/resize interactions"
    ],
    apiNotes: [
      "не смешивать с базовыми primitives",
      "если переносим, нужен отдельный parity spec",
      "возможно лучше вынести в domain package"
    ]
  }
];

export const tableStateContract = [
  "TableState.serializeTableState() должен возвращать тот же объект по table id.",
  "columns сохраняют order, width, hidden.",
  "_filters сохраняются в том же массиве фильтров.",
  "pinnedColumnId остается на верхнем уровне serialized table state.",
  "новый storage не зависит от zustand: load/save передаются через интерфейс."
];
