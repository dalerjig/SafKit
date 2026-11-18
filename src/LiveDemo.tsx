import { type ReactNode, useEffect, useRef, useState } from "react";
import { classes, style } from "typestyle";
import { media } from "typestyle";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import {
  Button,
  Alert,
  Badge,
  Breadcrumbs,
  Card,
  Checkbox,
  Collapse,
  ColorPicker,
  Carousel,
  DateInput,
  Description,
  Dropdown,
  ElementGroup,
  Empty,
  FileItem,
  Field,
  FilterOperator,
  FolderItem,
  Form,
  Header,
  HeaderDate,
  Icon,
  Input,
  Layout,
  LayoutContent,
  LayoutFitContent,
  LayoutHeader,
  LayoutSidebar,
  MOBILE_COLLAPSED_WIDTH,
  MOBILE_HEADER_HEIGHT,
  Modal,
  NumberInput,
  Popconfirm,
  Popover,
  RESPONSIVE_BREAKPOINTS,
  Result,
  RightPanel,
  SegmentedControl,
  Select,
  Slider,
  Sidebar,
  Skeleton,
  Spinner,
  Splitter,
  SubmitButton,
  Switch,
  Tabs,
  Tag,
  Table,
  Textarea,
  Tooltip,
  ToastProvider,
  Upload,
  UploadList,
  color,
  createLocalTableStateStorage,
  palette,
  radius,
  shadow,
  space,
  useResponsive,
  useToast,
  type ShKitLocale,
  type CarouselRef,
  type TableColumn,
  type TableFilterRule,
  type TableRowBase,
  type UploadListItem,
} from ".";

type LiveDemoProps = {
  fullscreen?: boolean;
  locale: ShKitLocale;
  mapTheme?: "light" | "dark";
  onLocaleChange: (locale: ShKitLocale) => void;
};

type LiveDemoRow = TableRowBase & {
  name: string;
  area: number;
  status: string;
  dueDate: string;
};

const mapStyleUrls = {
  light: "/styles/osm-style.json",
  dark: "/styles/osm-style-dark.json",
} as const;
let pmtilesProtocolRegistered = false;

const ensurePmtilesProtocol = () => {
  if (pmtilesProtocolRegistered) return;
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  pmtilesProtocolRegistered = true;
};

const rows: LiveDemoRow[] = [
  {
    id: "1",
    name: "Котлован 01",
    area: 1840,
    status: "В работе",
    dueDate: "2026-05-14",
  },
  {
    id: "2",
    name: "Насыпь запад",
    area: 920,
    status: "Проверка",
    dueDate: "2026-05-17",
  },
  {
    id: "3",
    name: "Плита секция A",
    area: 2400,
    status: "Готово",
    dueDate: "2026-05-18",
  },
  {
    id: "4",
    name: "Дорога временная",
    area: 1320,
    status: "В работе",
    dueDate: "2026-05-20",
  },
  {
    id: "5",
    name: "Склад материалов",
    area: 760,
    status: "Ожидает",
    dueDate: "2026-05-22",
  },
  {
    id: "6",
    name: "Выемка юг",
    area: 1180,
    status: "Проверка",
    dueDate: "2026-05-24",
  },
];

const columns: Array<TableColumn<LiveDemoRow>> = [
  {
    key: "name",
    name: "Объект",
    initialWidth: 180,
    fieldType: "string",
    editable: true,
  },
  {
    key: "area",
    name: "Площадь, м",
    initialWidth: 128,
    fieldType: "number",
    editable: true,
  },
  {
    key: "status",
    name: "Статус",
    initialWidth: 140,
    fieldType: "select",
    editable: true,
    selectOptions: ["В работе", "Проверка", "Готово", "Ожидает"].map(
      (status) => ({ label: status, value: status }),
    ),
  },
  {
    key: "dueDate",
    name: "Срок",
    initialWidth: 130,
    fieldType: "date",
    editable: true,
  },
];

const storage = createLocalTableStateStorage("shkit:live-demo-table", {
  liveDemoTable: {
    name: { order: 0, width: 180, hidden: false },
    area: { order: 1, width: 128, hidden: false },
    status: { order: 2, width: 140, hidden: false },
    dueDate: { order: 3, width: 130, hidden: false },
    _filters: [
      {
        id: 1,
        key: "status",
        value: ["В работе", "Проверка"],
        operator: FilterOperator.StringIsAnyOf,
        conditionalWithPrevious: "and",
        filterFn: () => true,
      },
    ],
    pinnedColumnId: "name",
  },
});

const defaultFilters: TableFilterRule[] = [
  {
    id: 1,
    columnKey: "status",
    condition: "and",
    operator: FilterOperator.StringIsAnyOf,
    value: ["В работе", "Проверка"],
  },
];

const liveUploadItems: UploadListItem[] = [
  {
    id: "ortho",
    name: "orthophoto-18-05.tif",
    size: 24_200_000,
    status: "done",
  },
  {
    id: "markup",
    name: "markup.json",
    size: 18_400,
    status: "uploading",
    progress: 62,
  },
  {
    id: "broken",
    name: "broken-las.zip",
    size: 9_800_000,
    status: "error",
    error: "Структура архива не прошла проверку",
  },
];

const demoPreviewImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
  <rect width="320" height="240" fill="#EDECDA"/>
  <path d="M0 176 L86 118 L140 146 L214 94 L320 138 L320 240 L0 240 Z" fill="#8AAC80"/>
  <path d="M36 178 C88 144 138 190 192 156 S262 124 304 174" fill="none" stroke="#BDDC0F" stroke-width="18" stroke-linecap="round"/>
  <rect x="24" y="22" width="92" height="34" rx="6" fill="#103E36"/>
  <text x="36" y="44" font-family="Rubik, Arial" font-size="15" font-weight="700" fill="white">ShKit 0.3.2</text>
</svg>
`)}`;

const screenFolders = [
  { id: "root", title: "Все экраны", description: "3 папки" },
  { id: "public", title: "Публичные", description: "8 экранов" },
  {
    id: "my",
    title: "Мои экраны с очень длинным названием папки для проверки переноса",
    description: "4 экрана",
  },
];

const screenFiles = [
  {
    id: "screen-30",
    title: "30.09.24",
    description: "Ортофото, 12 файлов",
    badge: "Активный",
    preview: demoPreviewImage,
  },
  {
    id: "screen-23",
    title: "23.09.24 - длинное название съемки промышленной площадки",
    description: "Съемка дрона",
  },
  { id: "screen-19", title: "19.09.24", description: "Панорама" },
  { id: "screen-05", title: "05.09.24", description: "Тепловая карта" },
  {
    id: "bim-site",
    title: "IFC Site",
    description: "без иконки",
    hideIcon: true,
  },
];

const customers = [
  {
    id: "demo-customer",
    name: "Демо-заказчик",
    sites: [
      { id: "site-1", name: "Участок 1" },
      {
        id: "site-2",
        name: "Северная площадка - очень длинное название площадки",
      },
    ],
  },
  {
    id: "shtab",
    name: "Shtab",
    sites: [
      { id: "demo", name: "Demo site" },
      { id: "airport", name: "Аэропорт" },
    ],
  },
];

export const LiveDemo = ({
  fullscreen,
  locale,
  mapTheme = "light",
  onLocaleChange,
}: LiveDemoProps) => {
  const responsive = useResponsive();
  const { isMobile } = responsive;
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [liveRows, setLiveRows] = useState(rows);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [activeId, setActiveId] = useState("screens");
  const [leftMode, setLeftMode] = useState<"files" | "settings">("files");
  const [rightOpen, setRightOpen] = useState(true);
  const [rightActiveId, setRightActiveId] = useState("notes");
  const [folderId, setFolderId] = useState("public");
  const [screenId, setScreenId] = useState("screen-30");
  const [customerId, setCustomerId] = useState("demo-customer");
  const [siteId, setSiteId] = useState("site-1");
  const [tableStateVersion, setTableStateVersion] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const folder =
    screenFolders.find((item) => item.id === folderId) ?? screenFolders[0];
  const screen =
    screenFiles.find((item) => item.id === screenId) ?? screenFiles[0];
  const customer =
    customers.find((item) => item.id === customerId) ?? customers[0];
  const site =
    customer.sites.find((item) => item.id === siteId) ?? customer.sites[0];
  const resetLiveTable = () => {
    storage.reset?.("liveDemoTable");
    setLiveRows(rows);
    setTableStateVersion((version) => version + 1);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarHidden(true);
      setSidebarCollapsed(true);
      setSidebarPinned(false);
      setRightOpen(false);
    } else {
      setSidebarHidden(false);
    }
  }, [isMobile]);

  return (
    <ToastProvider placement="bottom-right">
      <Layout
        className={classes(styles.shell, fullscreen && styles.fullscreenShell)}
      >
        <LayoutSidebar>
          <Sidebar
            activeId={activeId}
            collapsed={sidebarCollapsed}
            collapsedWidth={isMobile ? MOBILE_COLLAPSED_WIDTH : undefined}
            expandedWidth={isMobile ? 180 : undefined}
            hidden={isMobile ? sidebarHidden : false}
            pinned={sidebarPinned}
            onSelect={(id) => {
              setActiveId(id);
            }}
            onCollapsedChange={setSidebarCollapsed}
            onHiddenChange={setSidebarHidden}
            onPinnedChange={setSidebarPinned}
            panelTitle={getPanelTitle(activeId)}
            logo={<div className={styles.logo} />}
            footer={({ collapsed }) => (
              <div className={styles.sidebarFooter}>
                <span>{collapsed ? "26" : "2026.05"}</span>
              </div>
            )}
            items={[
              { id: "notes", label: "Заметки", icon: <Icon name="notes" /> },
              { id: "screens", label: "Экраны", icon: <Icon name="screen" /> },
              {
                id: "measure",
                label: "Измерения",
                icon: <Icon name="measure" />,
              },
              { id: "table", label: "Таблица", icon: <Icon name="table" /> },
            ]}
            panel={
              <SidebarPanel
                folder={folder}
                folderId={folderId}
                leftMode={leftMode}
                rightOpen={rightOpen}
                screen={screen}
                screenId={screenId}
                setFolderId={setFolderId}
                setLeftMode={setLeftMode}
                setRightOpen={setRightOpen}
                setScreenId={setScreenId}
              />
            }
          />
        </LayoutSidebar>

        <LayoutHeader>
          <Header
            left={
              <div className={styles.headerLeft}>
                <HeaderDate day="01" caption="Май'26" />
              </div>
            }
            center={<Toolbar />}
            right={
              <HeaderContext
                customer={customer}
                customerId={customerId}
                locale={locale}
                onCustomerChange={(nextCustomerId) => {
                  const nextCustomer = customers.find(
                    (item) => item.id === nextCustomerId,
                  );
                  setCustomerId(nextCustomerId);
                  setSiteId(nextCustomer?.sites[0]?.id ?? "");
                }}
                onLocaleChange={onLocaleChange}
                onOpenHelp={() => setHelpOpen(true)}
                onSiteChange={setSiteId}
                site={site}
              />
            }
          />
        </LayoutHeader>

        <LayoutContent>
          <div className={styles.map}>
            <MapLibreSurface theme={mapTheme} />
            <ResponsiveBadge state={responsive} />
            <div className={styles.routeLine} />
            {activeId === "table" && (
              <LayoutFitContent>
                <div
                  className={styles.fitContentFrame}
                  data-shkit-layout-pass-through
                >
                  <div
                    className={styles.tablePanel}
                    data-shkit-layout-interactive
                  >
                    <div className={styles.tableHeader}>
                      <strong>Fit layout для таблицы</strong>
                      <span>самостоятельный overlay внутри LayoutContent</span>
                    </div>
                    <Table
                      key={tableStateVersion}
                      id="liveDemoTable"
                      data={liveRows}
                      columns={columns}
                      stateStorage={storage}
                      defaultFilters={defaultFilters}
                      maxHeight={isMobile ? 240 : 290}
                      rowHeight={38}
                      editableSaveMode="after-save"
                      onCellChange={(rowId, columnKey, value) =>
                        new Promise((resolve) => {
                          window.setTimeout(() => {
                            setLiveRows((currentRows) =>
                              currentRows.map((row) =>
                                row.id === rowId
                                  ? { ...row, [columnKey]: value }
                                  : row,
                              ),
                            );
                            resolve();
                          }, 420);
                        })
                      }
                    />
                  </div>
                </div>
              </LayoutFitContent>
            )}
            <RightPanel
              open={rightOpen}
              activeId={rightActiveId}
              onOpenChange={setRightOpen}
              onActiveChange={(id) => {
                if (id) setRightActiveId(id);
              }}
              onCloseAll={() => setRightActiveId("notes")}
              headerOffset={0}
              mobileHeaderOffset={isMobile ? 0 : MOBILE_HEADER_HEIGHT}
              tabs={[
                {
                  id: "notes",
                  title: "Заметки",
                  icon: IconNotesAdapter,
                  toolbar: (
                    <PanelToolRail>
                      <PanelToolButton label="Добавить маркер" name="plus" />
                      <PanelToolButton label="Рисовать область" name="draw" />
                      <PanelToolButton label="Сохранить экран" name="screen" />
                    </PanelToolRail>
                  ),
                  width: 370,
                  content: (
                    <NotesPanel
                      visibility={visibility}
                      onVisibilityChange={setVisibility}
                    />
                  ),
                },
                {
                  id: "table",
                  title: "Таблица",
                  icon: IconTableAdapter,
                  toolbar: (
                    <PanelToolRail>
                      <PanelToolButton label="Измерить" name="measure" />
                      <PanelToolButton label="Экспорт" name="export" />
                      <PanelToolButton label="Сбросить" name="reset" />
                    </PanelToolRail>
                  ),
                  width: 420,
                  maxWidth: 620,
                  content: (
                    <div className={styles.drawerStack}>
                      <strong>Данные таблицы</strong>
                      <p>
                        RightPanel можно ресайзить за левый край, переключать
                        вкладки и сворачивать кликом по активной вкладке.
                      </p>
                      <Switch label="Сохранять состояние" defaultChecked />
                      <Popconfirm
                        title="Сбросить состояние таблицы?"
                        description="Вернутся дефолтные ширины, порядок колонок, pin и фильтры LiveDemo."
                        confirmText="Сбросить"
                        cancelText="Оставить"
                        danger
                        onConfirm={resetLiveTable}
                        trigger={
                          <Button variant="secondary">
                            Сбросить состояние
                          </Button>
                        }
                      />
                    </div>
                  ),
                },
                {
                  id: "components",
                  title: "Компоненты",
                  icon: IconDashboardAdapter,
                  toolbar: (
                    <PanelToolRail>
                      <PanelToolButton label="Добавить" name="plus" />
                      <PanelToolButton label="Экспорт" name="export" />
                    </PanelToolRail>
                  ),
                  width: 450,
                  maxWidth: 660,
                  content: <ComponentsPanel />,
                },
              ]}
            />
            <Modal
              open={helpOpen}
              title="Рабочий контекст"
              onClose={() => setHelpOpen(false)}
              footer={
                <Button variant="primary" onClick={() => setHelpOpen(false)}>
                  Понятно
                </Button>
              }
            >
              <div className={styles.modalStack}>
                <p>
                  LiveDemo показывает ShKit-компоненты в одном рабочем layout:
                  Sidebar, Header, overlays, form fields, table and RightPanel.
                </p>
                <Switch label="Запомнить выбранный контекст" defaultChecked />
                <DateInput label="Дата демо" defaultValue="2026-05-18" />
              </div>
            </Modal>
          </div>
        </LayoutContent>
      </Layout>
    </ToastProvider>
  );
};

const SidebarPanel = ({
  folder,
  folderId,
  leftMode,
  rightOpen,
  screen,
  screenId,
  setFolderId,
  setLeftMode,
  setRightOpen,
  setScreenId,
}: {
  folder: { id: string; title: string; description: string };
  folderId: string;
  leftMode: "files" | "settings";
  rightOpen: boolean;
  screen: { id: string; title: string };
  screenId: string;
  setFolderId: (id: string) => void;
  setLeftMode: (mode: "files" | "settings") => void;
  setRightOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  setScreenId: (id: string) => void;
}) => {
  return (
    <div className={styles.sidebarPanel}>
      <SegmentedControl
        fullWidth
        value={leftMode}
        onChange={setLeftMode}
        options={[
          { label: "Файлы", value: "files" },
          { label: "Настройки", value: "settings" },
        ]}
      />
      <Button
        size="sm"
        variant={rightOpen ? "secondary" : "outline"}
        onClick={() => setRightOpen((open) => !open)}
      >
        {rightOpen ? "Скрыть right" : "Показать right"}
      </Button>
      {leftMode === "files" ? (
        <div className={styles.explorer}>
          <Breadcrumbs
            items={[
              { id: "root", label: "Экраны" },
              { id: folder.id, label: folder.title },
              { id: screen.id, label: screen.title },
            ]}
            onSelect={(id) => {
              if (id === "root") setFolderId("root");
              if (screenFolders.some((item) => item.id === id)) setFolderId(id);
            }}
          />
          <div className={styles.fileList}>
            {screenFolders.map((item) => (
              <FolderItem
                key={item.id}
                title={item.title}
                description={item.description}
                containsItems
                selected={item.id === folderId}
                onOpen={() => setFolderId(item.id)}
                actions={<IconButton name="more" label="Folder actions" />}
              />
            ))}
            {screenFiles.map((item) => (
              <FileItem
                key={item.id}
                title={item.title}
                description={item.description}
                selected={item.id === screenId}
                icon={
                  "hideIcon" in item && item.hideIcon ? null : (
                    <Icon name="screen" />
                  )
                }
                label={item.badge}
                labelTone="lime"
                preview={
                  item.preview
                    ? {
                        src: item.preview,
                        alt: item.title,
                        title: item.title,
                        caption: item.description,
                      }
                    : undefined
                }
                activeContent={
                  <span className={styles.fileInlineControl}>
                    <Slider defaultValue={72} showValue={false} />
                  </span>
                }
                onSelect={() => setScreenId(item.id)}
                actions={<IconButton name="more" label="File actions" />}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.controls}>
          <Switch label="Маркер на карте" defaultChecked />
          <Switch label="Заголовки на карте" />
          <Checkbox label="Показывать завершенные объекты" defaultChecked />
          <DateInput label="Дата слоя" defaultValue="2026-05-18" size="sm" />
          <NumberInput
            label="Мин. площадь"
            defaultValue={1200}
            suffix="м"
            size="sm"
          />
          <Slider label="Overlay opacity" defaultValue={68} />
          <Button variant="secondary" onClick={() => setRightOpen(true)}>
            Открыть RightPanel
          </Button>
        </div>
      )}
      <div className={styles.sidebarNote}>
        <strong>{screen.title}</strong>
        <span>
          Left menu показывает папки, файлы и breadcrumbs прямо внутри Sidebar.
        </span>
      </div>
    </div>
  );
};

const HeaderContext = ({
  customer,
  customerId,
  locale,
  onCustomerChange,
  onLocaleChange,
  onOpenHelp,
  onSiteChange,
  site,
}: {
  customer: (typeof customers)[number];
  customerId: string;
  locale: ShKitLocale;
  onCustomerChange: (id: string) => void;
  onLocaleChange: (locale: ShKitLocale) => void;
  onOpenHelp: () => void;
  onSiteChange: (id: string) => void;
  site: (typeof customers)[number]["sites"][number];
}) => {
  return (
    <div className={styles.headerRight}>
      <Dropdown
        className={styles.customerDropdownRoot}
        trigger={
          <Tooltip
            placement="bottom"
            delay={120}
            content={
              <span className={styles.siteTooltip}>
                <strong>{customer.name}</strong>
                <span>{site.name}</span>
              </span>
            }
          >
            <button type="button" className={styles.customerTrigger}>
              <span className={styles.avatarIcon}>
                <Icon name="business" size={22} />
              </span>
              <span className={styles.customerText}>
                <strong>{customer.name}</strong>
                <small>{site.name}</small>
              </span>
            </button>
          </Tooltip>
        }
      >
        <div className={styles.customerDropdown}>
          <div className={styles.customerList}>
            <strong>Customer</strong>
            {customers.map((item) => (
              <button
                key={item.id}
                type="button"
                className={classes(
                  styles.customerOption,
                  item.id === customerId && styles.customerOptionActive,
                )}
                onClick={() => onCustomerChange(item.id)}
              >
                <span className={styles.customerOptionIcon}>
                  <Icon name="chevron-right" size={18} />
                </span>
                <span className={styles.customerOptionLabel}>{item.name}</span>
              </button>
            ))}
          </div>
          <div className={styles.customerList}>
            <strong>Site</strong>
            {customer.sites.map((item) => (
              <button
                key={item.id}
                type="button"
                className={classes(
                  styles.customerOption,
                  item.id === site.id && styles.customerOptionActive,
                )}
                onClick={() => onSiteChange(item.id)}
              >
                <span className={styles.customerOptionIcon}>
                  <Icon name="point" size={20} />
                </span>
                <span className={styles.customerOptionLabel}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Dropdown>
      <Dropdown trigger={<IconButton name="menu" label="Меню" />}>
        <div className={styles.profileDropdown}>
          <div className={styles.profileCard}>
            <span className={styles.avatarIcon}>
              <Icon name="user" size={18} />
            </span>
            <span title={`${customer.name}/${site.name}`}>
              <strong>Демо-пользователь</strong>
              <small>
                {customer.name}/{site.name}
              </small>
            </span>
          </div>
          <Select
            label="Language"
            size="sm"
            value={locale}
            onValueChange={(value) => onLocaleChange(value as ShKitLocale)}
            options={[
              { label: "Русский", value: "ru" },
              { label: "English", value: "en" },
              { label: "简体中文", value: "zh" },
            ]}
          />
          <Button size="sm" variant="secondary" onClick={onOpenHelp}>
            Руководство
          </Button>
          <Button size="sm" variant="outline">
            Выйти
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

const Toolbar = () => {
  const { isTab } = useResponsive();
  const buttonSize = isTab ? "sm" : "md";
  const toolbarItems = [
    { id: "draw", label: "Рисунки", icon: <Icon name="draw" /> },
    { id: "screen", label: "Сохранить экран", icon: <Icon name="screen" /> },
    { id: "measure", label: "Измерения", icon: <Icon name="measure" /> },
    {
      id: "create",
      label: "Создать",
      icon: <Icon name="plus" />,
      primary: true,
    },
  ];

  return (
    <ElementGroup
      items={toolbarItems.map((item) => ({
        id: item.id,
        element: isTab ? (
          <Tooltip content={item.label} placement="bottom">
            <Button
              aria-label={item.label}
              icon={item.icon}
              size={buttonSize}
              square
              variant={item.primary ? "primary" : "outline"}
            />
          </Tooltip>
        ) : (
          <Button
            icon={item.icon}
            size={buttonSize}
            variant={item.primary ? "primary" : "outline"}
          >
            {item.label}
          </Button>
        ),
      }))}
      overflowIcon={<Icon name="more" />}
      overflowLabel="Инструменты"
    />
  );
};

const ResponsiveBadge = ({
  state,
}: {
  state: ReturnType<typeof useResponsive>;
}) => {
  const label = state.isMobile
    ? "S / mobile"
    : state.isTab
      ? "M / tablet"
      : state.isHorizontalTab
        ? "L / horizontal tablet"
        : "XL / desktop";

  return (
    <Popover
      className={styles.responsiveBadgeRoot}
      trigger={
        <button type="button" className={styles.responsiveBadge}>
          <strong>{label}</strong>
          <span>
            mobile {String(state.isMobile)} · tab {String(state.isTab)}
          </span>
        </button>
      }
    >
      <div className={styles.responsivePopover}>
        <strong>Responsive state</strong>
        <span>mobile: {String(state.isMobile)}</span>
        <span>tablet: {String(state.isTab)}</span>
        <span>horizontal tablet: {String(state.isHorizontalTab)}</span>
      </div>
    </Popover>
  );
};

const MapLibreSurface = ({ theme }: { theme: "light" | "dark" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: MapLibreMap | null = null;
    const container = containerRef.current;

    if (!container) return undefined;

    ensurePmtilesProtocol();

    map = new maplibregl.Map({
      center: [37.6173, 55.7558],
      container,
      maxZoom: 19,
      minZoom: 2,
      pitch: 0,
      style: mapStyleUrls[theme],
      zoom: 12.4,
    });
    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-left",
    );

    return () => {
      map?.remove();
    };
  }, [theme]);

  return <div ref={containerRef} className={styles.mapLibre} aria-hidden />;
};

const NotesPanel = ({
  visibility,
  onVisibilityChange,
}: {
  visibility: "public" | "private";
  onVisibilityChange: (value: "public" | "private") => void;
}) => {
  return (
    <div className={styles.drawerStack}>
      <SegmentedControl
        fullWidth
        value={visibility}
        onChange={onVisibilityChange}
        options={[
          { label: "Публичные", value: "public" },
          { label: "Мои заметки", value: "private" },
        ]}
        equalItemWidth={true}
      />
      <Breadcrumbs
        items={[
          { id: "root", label: "/" },
          {
            id: "public",
            label: visibility === "public" ? "Публичные" : "Мои заметки",
          },
          { id: "folder", label: "пример" },
        ]}
      />
      <div className={styles.fileList}>
        <FolderItem
          title="техника строительная 2025"
          description="31.10.2025"
          containsItems
          actions={<IconButton name="more" label="Folder actions" />}
        />
        <FolderItem
          title="Панорамы"
          description="28.11.2025"
          actions={<IconButton name="more" label="Folder actions" />}
        />
        <FileItem
          title="пример"
          description="20.04.2026"
          selected
          label="Полигон"
          labelTone="lime"
          icon={<Icon name="file" />}
          activeContent={<Slider defaultValue={72} showValue={false} />}
          actions={<IconButton name="more" label="File actions" />}
        />
        <FileItem
          title="IFC Site"
          description="без иконки, название сразу"
          icon={null}
        />
      </div>
      <Button variant="primary">Сохранить публичную</Button>
    </div>
  );
};

const ComponentsPanel = () => {
  const toast = useToast();
  const [accentColor, setAccentColor] = useState("#BDDC0F");
  const [uploads, setUploads] = useState(liveUploadItems);
  const [formSaved, setFormSaved] = useState(false);

  return (
    <div className={styles.drawerStack}>
      <Alert compact variant="info" title="ShKit components">
        Эта вкладка собирает новые компоненты в одном рабочем сценарии LiveDemo.
      </Alert>
      <Tabs
        defaultActiveId="overview"
        items={[
          {
            id: "release-032",
            label: "0.3.2",
            content: <Release032Panel />,
          },
          {
            id: "overview",
            label: "Сводка",
            content: (
              <div className={styles.drawerStack}>
                <Card
                  title="Проверка слоя"
                  subtitle="Card + Description + Badge/Tag"
                  actions={<Badge tone="warning" text="2 замечания" />}
                >
                  <Description
                    bordered
                    density="compact"
                    minColumnWidth={130}
                    items={[
                      {
                        key: "status",
                        label: "Статус",
                        value: <Tag tone="warning">Проверка</Tag>,
                      },
                      { key: "objects", label: "Объекты", value: "128" },
                      {
                        key: "source",
                        label: "Источник",
                        value: "Ортофото 18.05",
                      },
                      {
                        key: "owner",
                        label: "Ответственный",
                        value: "Геодезия",
                      },
                    ]}
                  />
                </Card>
                <Collapse
                  defaultActiveIds={["details"]}
                  items={[
                    {
                      id: "details",
                      title: "Детали проверки",
                      actions: (
                        <Tag size="sm" tone="info">
                          active
                        </Tag>
                      ),
                      content:
                        "Контуры сверены с последней съемкой. Южная граница требует повторной проверки.",
                    },
                    {
                      id: "history",
                      title: "История",
                      content:
                        "18.05.2026 - импорт, фильтрация, ручная проверка.",
                    },
                  ]}
                />
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.success({
                      title: "Проверка запущена",
                      description:
                        "ToastProvider работает прямо внутри LiveDemo drawer.",
                    })
                  }
                >
                  Показать toast
                </Button>
              </div>
            ),
          },
          {
            id: "form",
            label: "Форма",
            content: (
              <Form
                className={styles.drawerStack}
                onSubmit={(event) => {
                  event.preventDefault();
                  setFormSaved(true);
                  toast.success({
                    title: "Форма сохранена",
                    description:
                      "Form, Field и SubmitButton работают в LiveDemo.",
                  });
                }}
                footer={
                  <>
                    <Tag tone={formSaved ? "success" : "default"}>
                      {formSaved ? "saved" : "draft"}
                    </Tag>
                    <SubmitButton
                      size="sm"
                      variant="primary"
                      pendingText="Сохраняем..."
                    >
                      Сохранить
                    </SubmitButton>
                  </>
                }
              >
                <Alert
                  compact
                  variant={formSaved ? "success" : "info"}
                  title="React 19 form layer"
                >
                  В продукте сюда можно подключить action/useFormAction, а
                  layout формы остается общим.
                </Alert>
                <Field
                  label="Название слоя"
                  required
                  hint="Field дает подпись, hint/error и единый rhythm."
                >
                  <Input
                    name="layerName"
                    defaultValue="Проверка контура"
                    size="sm"
                  />
                </Field>
                <Field label="Тип проверки">
                  <Select
                    size="sm"
                    defaultValue="geometry"
                    options={[
                      { label: "Геометрия", value: "geometry" },
                      { label: "Атрибуты", value: "attributes" },
                      { label: "Публикация", value: "publish" },
                    ]}
                  />
                </Field>
                <Field label="Комментарий">
                  <Textarea
                    name="comment"
                    defaultValue="Проверить южную границу перед публикацией."
                    rows={3}
                  />
                </Field>
                <Field label="Дата проверки">
                  <DateInput
                    name="dueDate"
                    defaultValue="2026-05-18"
                    size="sm"
                  />
                </Field>
              </Form>
            ),
          },
          {
            id: "style",
            label: "Стиль",
            content: (
              <div className={styles.drawerStack}>
                <ColorPicker
                  label="Цвет слоя"
                  value={accentColor}
                  palette={[
                    palette.darkGreen,
                    palette.babyGreen,
                    palette.orange,
                    palette.red,
                    palette.beige,
                    palette.white,
                  ]}
                  onChange={setAccentColor}
                  allowCustom
                />
                <Description
                  bordered
                  density="compact"
                  items={[
                    { key: "color", label: "HEX", value: accentColor },
                    {
                      key: "usage",
                      label: "Сценарий",
                      value: "markup / layer settings",
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            id: "states",
            label: "Состояния",
            content: (
              <div className={styles.drawerStack}>
                <Card title="Загрузка" subtitle="Skeleton + Spinner">
                  <div className={styles.drawerStack}>
                    <Skeleton variant="table" />
                    <Spinner label="Обновляем слой" />
                  </div>
                </Card>
                <Card title="Пустой результат">
                  <Empty
                    variant="compact"
                    title="Нет объектов"
                    description="Измените фильтр или создайте первый объект."
                    action={
                      <Button size="sm" variant="primary">
                        Создать
                      </Button>
                    }
                  />
                </Card>
                <Result
                  compact
                  status="success"
                  title="Импорт завершен"
                  subtitle="12 объектов готовы к проверке."
                  actions={
                    <Button size="sm" variant="secondary">
                      Открыть
                    </Button>
                  }
                />
              </div>
            ),
          },
          {
            id: "files",
            label: (
              <span className={styles.tabLabel}>
                Файлы{" "}
                <Tag size="sm" tone="warning">
                  {uploads.length}
                </Tag>
              </span>
            ),
            content: (
              <div className={styles.drawerStack}>
                <Upload
                  multiple
                  accept=".jpg,.png,.tif,.json"
                  description="Добавляет файлы в локальный список без transport."
                  onFilesChange={(files) =>
                    setUploads((current) => [
                      ...files.map((file) => ({
                        id: `${file.name}-${file.lastModified}`,
                        name: file.name,
                        size: file.size,
                        status: "idle" as const,
                      })),
                      ...current,
                    ])
                  }
                />
                <UploadList
                  items={uploads}
                  onPreview={(item) =>
                    toast.info({
                      title: item.name,
                      description: "Preview action из UploadList.",
                    })
                  }
                  onRetry={(item) =>
                    setUploads((current) =>
                      current.map((file) =>
                        file.id === item.id
                          ? { ...file, status: "uploading", progress: 24 }
                          : file,
                      ),
                    )
                  }
                  onRemove={(item) =>
                    setUploads((current) =>
                      current.filter((file) => file.id !== item.id),
                    )
                  }
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const releaseSliderMarks = {
  0: "0",
  50: {
    label: "50",
    style: { color: color.primary, fontWeight: 900 },
  },
  100: "100",
};

const Release032Panel = () => {
  const carouselRef = useRef<CarouselRef>(null);
  const [step, setStep] = useState(0);

  return (
    <div className={styles.drawerStack}>
      <Alert compact variant="success" title="ShKit 0.3.2">
        Carousel, Splitter, расширенные Card/Slider, новые иконки и FileItem
        preview.
      </Alert>

      <Card
        title="Wizard preview"
        subtitle="Carousel + imperative ref"
        titleIcon={<Icon name="appstore" />}
        titleSize="prominent"
        actions={<Badge tone="info" text={`${step + 1}/3`} />}
      >
        <div className={styles.releaseCardStack}>
          <Carousel ref={carouselRef} dots={false} onChange={setStep}>
            <div className={styles.releaseSlide}>
              <Icon name="upload" size={26} />
              <strong>Импорт</strong>
              <span>Загрузите ортофото или разметку.</span>
            </div>
            <div className={styles.releaseSlide}>
              <Icon name="align-center" size={26} />
              <strong>Сопоставление</strong>
              <span>Проверьте поля и порядок колонок.</span>
            </div>
            <div className={styles.releaseSlide}>
              <Icon name="check" size={26} />
              <strong>Публикация</strong>
              <span>Сохраните слой в рабочем контексте.</span>
            </div>
          </Carousel>
          <ElementGroup
            items={[
              {
                id: "prev",
                element: (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={step === 0}
                    onClick={() => carouselRef.current?.prev()}
                  >
                    Назад
                  </Button>
                ),
              },
              {
                id: "next",
                element: (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={step === 2}
                    onClick={() => carouselRef.current?.next()}
                  >
                    Далее
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>

      <Card
        title="Split layout"
        subtitle="Splitter.Panel + Slider marks"
        titleIcon={<Icon name="menu-compare-surfaces" />}
      >
        <Splitter style={{ height: 168 }}>
          <Splitter.Panel defaultSize="44%" min="34%">
            <div className={styles.splitterPane}>
              <strong>Параметры</strong>
              <Slider
                label="Opacity"
                defaultValue={50}
                marks={releaseSliderMarks}
                step={null}
                showValue={false}
              />
            </div>
          </Splitter.Panel>
          <Splitter.Panel min="36%">
            <div className={styles.splitterPane}>
              <strong>Инструменты</strong>
              <div className={styles.iconGrid}>
                {(
                  [
                    "measurement-area",
                    "measurement-distance-slope",
                    "tool-draw",
                    "fullscreen",
                  ] as const
                ).map((name) => (
                  <Button
                    key={name}
                    aria-label={name}
                    icon={<Icon name={name} />}
                    size="sm"
                    square
                    variant="outline"
                  />
                ))}
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </Card>

      <FileItem
        title="orthophoto_0.3.2.jpg"
        description="FileItem.preview открывает ImagePreview через Modal"
        preview={{
          src: demoPreviewImage,
          alt: "ShKit 0.3.2 preview",
          title: "orthophoto_0.3.2.jpg",
          caption: "LiveDemo preview",
        }}
        label="Preview"
        labelTone="lime"
        actions={<IconButton name="more" label="File actions" />}
      />
      <FileItem
        title="IFC Site"
        description="icon={null} — без слота иконки"
        icon={null}
      />
    </div>
  );
};

const IconButton = ({
  label,
  name,
}: {
  label: string;
  name: "menu" | "more";
}) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      square
      aria-label={label}
      icon={<Icon name={name} />}
    />
  );
};

const PanelToolRail = ({ children }: { children: ReactNode }) => {
  return <div className={styles.panelToolRail}>{children}</div>;
};

const PanelToolButton = ({
  label,
  name,
}: {
  label: string;
  name: "draw" | "export" | "measure" | "plus" | "reset" | "screen";
}) => {
  return (
    <Tooltip content={label} placement="left">
      <Button
        aria-label={label}
        icon={<Icon name={name} />}
        size="sm"
        square
        variant="ghost"
      />
    </Tooltip>
  );
};

const IconNotesAdapter = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => {
  return <Icon name="notes" className={className} size={size} />;
};

const IconTableAdapter = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => {
  return <Icon name="table" className={className} size={size} />;
};

const IconDashboardAdapter = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => {
  return <Icon name="dashboard" className={className} size={size} />;
};

const getPanelTitle = (id: string) => {
  if (id === "notes") return "Заметки";
  if (id === "screens") return "Экраны";
  if (id === "measure") return "Измерения";
  return "Таблица";
};

const styles = {
  shell: style(
    {
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      boxShadow: shadow.card,
      minHeight: 620,
      overflow: "hidden",
      position: "relative",
    },
    media(
      { maxWidth: 760 },
      {
        minHeight: 760,
      },
    ),
  ),
  fullscreenShell: style({
    border: 0,
    borderRadius: 0,
    boxShadow: "none",
    height: "100%",
    minHeight: 0,
    width: "100%",
  }),
  logo: style({
    background: `linear-gradient(90deg, ${color.sidebarLogo} 0 64%, ${color.sidebarLogoAccent} 64%)`,
    borderRadius: radius.xs,
    height: 30,
    width: 30,
  }),
  workspace: style({
    display: "grid",
    gridTemplateRows: "72px minmax(0, 1fr)",
    minWidth: 0,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        gridTemplateRows: `${MOBILE_HEADER_HEIGHT}px minmax(0, 1fr)`,
      },
    },
  }),
  headerLeft: style({
    alignItems: "center",
    display: "flex",
    gap: space[14],
    minWidth: 0,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        visibility: "hidden",
      },
    },
  }),
  headerRight: style({
    alignItems: "center",
    display: "flex",
    gap: space[8],
    minWidth: 0,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        gap: space[4],
      },
    },
  }),
  customerDropdownRoot: style({
    flexShrink: 0,
    minWidth: 52,
    $nest: {
      "& > div": {
        minWidth: 52,
      },
    },
  }),
  customerTrigger: style(
    {
      alignItems: "center",
      background: "transparent",
      border: 0,
      borderRadius: radius.sm,
      boxSizing: "border-box",
      color: color.text,
      cursor: "pointer",
      display: "grid",
      gap: space[8],
      gridTemplateColumns: "40px minmax(0, 1fr)",
      minHeight: 46,
      minWidth: 56,
      overflow: "hidden",
      padding: `0 ${space[8]}px`,
      textAlign: "left",
      width: 216,
      $nest: {
        "&:hover": {
          background: color.surfaceMuted,
        },
        "& strong, & small": {
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& strong": {
          fontSize: 14,
          fontWeight: 900,
        },
        "& small": {
          color: color.textSubtle,
          fontSize: 12,
          fontWeight: 800,
        },
      },
    },
    media(
      { maxWidth: 920 },
      {
        gridTemplateColumns: "40px",
        minWidth: 40,
        padding: 0,
        width: 40,
        $nest: {
          "& > span:last-child": {
            display: "none",
          },
        },
      },
    ),
  ),
  customerText: style({
    minWidth: 0,
    overflow: "hidden",
  }),
  avatarIcon: style({
    alignItems: "center",
    background: color.surfaceSecondary,
    borderRadius: radius.round,
    boxSizing: "border-box",
    color: color.primary,
    display: "inline-flex",
    flex: "0 0 40px",
    height: 40,
    justifyContent: "center",
    minWidth: 40,
    width: 40,
    $nest: {
      "& svg": {
        flex: "0 0 auto",
      },
    },
  }),
  siteTooltip: style({
    display: "grid",
    gap: 3,
    lineHeight: 1.25,
    maxWidth: 260,
    $nest: {
      "& strong": {
        color: color.surface,
        fontSize: 13,
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      "& span": {
        color: color.surface,
        fontSize: 12,
        fontWeight: 700,
        opacity: 0.86,
        overflowWrap: "anywhere",
      },
    },
  }),
  customerDropdown: style(
    {
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      boxShadow: shadow.panel,
      display: "grid",
      gap: space[8],
      gridTemplateColumns: "200px 220px",
      padding: space[8],
    },
    media(
      { maxWidth: RESPONSIVE_BREAKPOINTS.S },
      {
        gridTemplateColumns: "minmax(220px, 1fr)",
        maxWidth: "calc(100vw - 24px)",
      },
    ),
  ),
  customerList: style({
    display: "grid",
    gap: space[4],
    maxHeight: 360,
    overflow: "auto",
    $nest: {
      "& > strong": {
        color: color.textSubtle,
        fontSize: 12,
        padding: `${space[6]}px ${space[8]}px`,
        textTransform: "uppercase",
      },
    },
  }),
  customerOption: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    display: "grid",
    fontSize: 14,
    fontWeight: 800,
    gap: space[8],
    gridTemplateColumns: "24px minmax(0, 1fr)",
    minHeight: 38,
    padding: `0 ${space[8]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:hover": {
        background: color.surfaceMuted,
        color: color.primary,
      },
    },
  }),
  customerOptionIcon: style({
    alignItems: "center",
    alignSelf: "start",
    display: "inline-flex",
    flex: "0 0 24px",
    height: 24,
    justifyContent: "center",
    marginTop: 7,
    width: 24,
    $nest: {
      "& svg": {
        flex: "0 0 auto",
      },
    },
  }),
  customerOptionLabel: style({
    alignSelf: "center",
    lineHeight: 1.25,
    minWidth: 0,
    overflowWrap: "anywhere",
  }),
  customerOptionActive: style({
    background: color.surfaceSecondary,
    color: color.primary,
  }),
  profileDropdown: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    display: "grid",
    gap: space[10],
    minWidth: 260,
    padding: space[12],
  }),
  profileCard: style({
    alignItems: "center",
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "36px minmax(0, 1fr)",
    $nest: {
      "& strong, & small": {
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      "& strong": {
        fontSize: 15,
        fontWeight: 900,
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 800,
      },
    },
  }),
  map: style({
    background:
      "linear-gradient(135deg, rgba(189, 220, 15, 0.16), rgba(255,255,255,0.08)), linear-gradient(20deg, #b88b68 0 32%, #d4b89d 32% 48%, #8aac80 48% 100%)",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  }),
  mapLibre: style(
    {
      bottom: 0,
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      $nest: {
        "& .maplibregl-ctrl-top-left": {
          left: space[12],
          top: 58,
        },
      },
    },
    media(
      { maxWidth: RESPONSIVE_BREAKPOINTS.S },
      {
        $nest: {
          "& .maplibregl-ctrl-top-left": {
            left: `calc(${MOBILE_COLLAPSED_WIDTH}px + ${space[8]}px)`,
            top: 52,
          },
        },
      },
    ),
  ),
  routeLine: style({
    border: `10px solid ${palette.babyGreen}`,
    borderRadius: radius.round,
    height: 420,
    left: "16%",
    pointerEvents: "none",
    position: "absolute",
    top: "8%",
    transform: "rotate(12deg)",
    width: 120,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        opacity: 0.55,
        transform: "rotate(8deg) scale(0.75)",
        transformOrigin: "top left",
      },
    },
  }),
  responsiveBadgeRoot: style({
    left: space[12],
    position: "absolute",
    top: space[12],
    zIndex: 3,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        left: `calc(${MOBILE_COLLAPSED_WIDTH}px + ${space[8]}px)`,
        top: space[8],
      },
    },
  }),
  responsiveBadge: style({
    background: "rgba(255,255,255,0.88)",
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    boxShadow: shadow.card,
    color: color.text,
    cursor: "pointer",
    display: "grid",
    gap: 2,
    padding: `${space[6]}px ${space[8]}px`,
    textAlign: "left",
    $nest: {
      "&:hover": {
        background: color.surface,
      },
      "& strong": {
        color: color.primary,
        fontSize: 12,
        fontWeight: 900,
      },
      "& span": {
        color: color.textSubtle,
        fontSize: 11,
        fontWeight: 800,
      },
    },
  }),
  responsivePopover: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    display: "grid",
    gap: space[6],
    minWidth: 220,
    padding: space[12],
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 14,
        fontWeight: 900,
      },
      "& span": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 800,
      },
    },
  }),
  fitContentFrame: style({
    alignItems: "flex-start",
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    minHeight: 0,
    padding: `${space[8]}px ${space[24]}px ${space[24]}px`,
    width: "100%",
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        padding: `${space[8]}px`,
      },
    },
  }),
  tablePanel: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 18px 44px rgba(25, 25, 25, 0.2)",
    maxWidth: 860,
    overflow: "hidden",
    width: "100%",
  }),
  tableHeader: style({
    alignItems: "center",
    background: color.surfaceMuted,
    borderBottom: `1px solid ${color.border}`,
    display: "flex",
    justifyContent: "space-between",
    padding: `${space[10]}px ${space[12]}px`,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 16,
      },
      "& span": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 800,
        textTransform: "uppercase",
      },
    },
  }),
  fileList: style({
    background: color.surfaceMuted,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    overflow: "hidden",
    $nest: {
      "& [role='button']": {
        background: color.surfaceMuted,
      },
      "& [role='button']:hover:not([aria-disabled='true'])": {
        background: color.surfaceSecondary,
      },
    },
  }),
  sidebarFooter: style({
    color: color.textSubtle,
    fontSize: 11,
    fontWeight: 900,
    padding: space[10],
    textAlign: "center",
  }),
  sidebarPanel: style({
    display: "grid",
    gap: space[12],
    padding: space[14],
    width: 340,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        width: 320,
      },
    },
  }),
  sidebarNote: style({
    background: color.surfaceMuted,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    display: "grid",
    gap: space[4],
    padding: space[10],
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 16,
      },
      "& span": {
        color: color.textMuted,
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1.35,
      },
    },
  }),
  controls: style({
    display: "grid",
    gap: space[14],
    paddingTop: space[14],
  }),
  explorer: style({
    display: "grid",
    gap: space[10],
    minWidth: 0,
  }),
  drawerStack: style({
    display: "grid",
    gap: space[12],
    $nest: {
      "& p": {
        color: color.textMuted,
        fontSize: 14,
        lineHeight: 1.45,
        margin: 0,
      },
      "& strong": {
        color: color.primary,
        fontSize: 18,
      },
    },
  }),
  modalStack: style({
    display: "grid",
    gap: space[12],
    $nest: {
      "& p": {
        color: color.textMuted,
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.45,
        margin: 0,
      },
    },
  }),
  fileInlineControl: style({
    minWidth: 0,
    width: "100%",
  }),
  tabLabel: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6],
    minWidth: 0,
  }),
  releaseCardStack: style({
    display: "grid",
    gap: space[10],
    minWidth: 0,
  }),
  releaseSlide: style({
    alignItems: "center",
    background: color.surfaceMuted,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    display: "grid",
    gap: space[6],
    justifyItems: "center",
    minHeight: 104,
    padding: space[12],
    textAlign: "center",
    $nest: {
      "& svg": {
        color: color.primary,
      },
      "& strong": {
        color: color.primary,
        fontSize: 15,
        fontWeight: 900,
      },
      "& span": {
        color: color.textMuted,
        fontSize: 12,
        fontWeight: 800,
      },
    },
  }),
  splitterPane: style({
    background: color.surfaceMuted,
    display: "grid",
    gap: space[10],
    height: "100%",
    minWidth: 0,
    padding: space[10],
    $nest: {
      "& > strong": {
        color: color.primary,
        fontSize: 13,
        fontWeight: 900,
      },
    },
  }),
  iconGrid: style({
    alignContent: "start",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "repeat(4, 32px)",
  }),
  panelToolRail: style({
    display: "grid",
    gap: space[6],
  }),
};
