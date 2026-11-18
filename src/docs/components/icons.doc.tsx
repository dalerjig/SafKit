import { useMemo, useState } from "react";
import { Card, Flow, Icon, Input, Tag, type IconName } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const iconNames: IconName[] = [
  "align-center",
  "align-left",
  "align-right",
  "appstore",
  "border",
  "border-bottom",
  "border-top",
  "business",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "clear",
  "clear-all",
  "close",
  "copy",
  "dashboard",
  "delete",
  "draw",
  "download",
  "edit",
  "environment",
  "expand",
  "eye-closed",
  "eye-open",
  "export",
  "field-time",
  "file",
  "file-done",
  "filter",
  "fullscreen",
  "fullscreen-exit",
  "folder",
  "folder-active",
  "folder-empty",
  "highlight",
  "home",
  "import",
  "line",
  "link",
  "lock",
  "measure",
  "measurement-area",
  "measurement-counter",
  "measurement-cross-section",
  "measurement-cut-fill",
  "measurement-cut-fill-to-design",
  "measurement-distance-slope",
  "measurement-elevation",
  "measurement-pin-coordinates",
  "measurement-removals",
  "measurement-stockpiles",
  "media",
  "menu",
  "minus",
  "menu-analytics",
  "menu-bim",
  "menu-compare-surfaces",
  "menu-exhibits",
  "menu-files",
  "menu-markups",
  "menu-overlays",
  "menu-panorama",
  "menu-planning",
  "menu-print",
  "menu-road-axis",
  "menu-scans",
  "menu-views",
  "menu-wires",
  "more",
  "notes",
  "pin",
  "point",
  "plus",
  "reset",
  "rotate-left",
  "rotate-right",
  "zoom-in",
  "zoom-out",
  "zoom-reset",
  "screen",
  "scanner",
  "search",
  "settings",
  "slice-view-bottom",
  "slice-view-top",
  "stop",
  "table",
  "tag",
  "tool-capture",
  "tool-dashboard",
  "tool-draw",
  "tool-snip",
  "tool-tasks",
  "unpin",
  "upload",
  "user",
  "ai-outline-arrow-up",
  "ai-outline-block",
  "ai-outline-border",
  "ai-outline-font-size",
  "ai-outline-insert-row-below",
  "ai-outline-monitor",
  "ai-outline-rollback",
  "bi-collapse-vertical",
  "bi-expand-vertical",
  "bi-intersect",
  "bi-network-chart",
  "bi-objects-horizontal-left",
  "bi-objects-vertical-bottom",
  "bi-rename",
  "bi-solid-color",
  "bs-border-outer",
  "bs-fill-folder-symlink-fill",
  "bs-reverse-list-columns-reverse",
  "bs-sign-intersection-t",
  "ci-box-list",
  "fa-chart-gantt",
  "fa-cubes",
  "fa-road",
  "go-blocked",
  "go-sidebar-expand",
  "gr-table-add",
  "im-cross",
  "io-bar-chart-outline",
  "io-ios-arrow-up",
  "io-layers-outline",
  "io-timer",
  "lu-circle-dashed",
  "lu-table-properties",
  "md-calendar-today",
  "md-compress",
  "md-edit-note",
  "md-move-to-inbox",
  "md-outline-drag-indicator",
  "md-outline-edit-road",
  "md-outline-sort-by-alpha",
  "md-playlist-remove",
  "pi-cube-focus-fill",
  "pi-projector-screen",
  "pi-projector-screen-chart",
  "pi-rectangle-dashed",
  "pi-selection-bold",
  "pi-selection-foreground-duotone",
  "pi-selection-foreground-light",
  "ri-checkbox-blank-fill",
  "rx-transparency-grid",
  "tb-badge3-d",
  "tb-bell",
  "tb-box-align-bottom-right-filled",
  "tb-chart-scatter3-d",
  "tb-hexagon3-d",
  "tb-layers-linked",
  "tb-layers-off",
  "tb-layers-selected",
  "tb-layers-selected-bottom",
  "tb-math-xy",
  "tb-refresh-dot",
  "tb-scan-eye",
  "tb-sort-ascending-shapes",
  "tb-vector-bezier",
  "tfi-save",
  "vsc-feedback",
  "vsc-graph-line",
  "chevron-up",
  "draw-rectangle",
  "folder-plus",
  "image",
  "line-segment",
  "tune"
];

const IconsCatalog = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const [query, setQuery] = useState("");
  const filteredIcons = useMemo(
    () => iconNames.filter(name => name.includes(query.trim().toLowerCase())),
    [query]
  );

  return (
    <Flow className={styles.previewNarrow} gap={12}>
      <Input
        label="Поиск"
        placeholder="folder, chevron, table..."
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <Flow mode="grid" minColumnWidth={118} gap={10}>
        {filteredIcons.map(name => (
          <Card key={name} padding="sm">
            <Flow align="center" gap={8}>
              <Icon name={name} />
              <Tag size="sm" tone="info">{name}</Tag>
            </Flow>
          </Card>
        ))}
      </Flow>
    </Flow>
  );
};

export const getIconsDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "icons",
    name: "Icons",
    importCode: 'import { Icon } from "@ShKit";',
    description: "Каталог встроенных иконок ShKit с поиском по IconName. Отдельные icon components наружу не экспортируем.",    props: [
      { name: "IconName", type: iconNames.map(name => `"${name}"`).join(" | "), description: "Доступные значения для <Icon name />." }
    ],    usageCode: `<Button square icon={<Icon name="menu" />} aria-label="Меню" />
<Sidebar items={[{ id: "notes", label: "Заметки", icon: <Icon name="notes" /> }]} />`,
    preview: <IconsCatalog styles={styles} />
  };
};
