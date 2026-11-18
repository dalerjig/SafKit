import { useState } from "react";
import { Button, Icon, Sidebar, Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getSidebarDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "sidebar",
    name: "Sidebar",
    importCode: 'import { Sidebar } from "@ShKit";',
    description:
      "Навигационная колонка по мотивам front sidebar: collapsible sider, expanded/collapsed logo, trigger снизу, optional mobile hide и submenu panel.",    props: [
      { name: "items", type: "SidebarItem[]", description: "Пункты меню: id, label, icon, disabled, hidden." },
      { name: "activeId", type: "string", description: "Текущий активный пункт." },
      { name: "collapsed/defaultCollapsed", type: "boolean", defaultValue: "true", description: "Controlled/uncontrolled collapsed state." },
      { name: "hidden/defaultHidden", type: "boolean", defaultValue: "false", description: "Скрытие sidebar на мобильных сценариях." },
      { name: "pinned/defaultPinned", type: "boolean", defaultValue: "true", description: "Закреплена ли panel-зона." },
      { name: "logo", type: "ReactNode", description: "Слот логотипа." },
      { name: "collapsedLogo", type: "ReactNode", description: "Отдельный логотип для collapsed-вида." },
      { name: "logoHeight", type: "number | string", defaultValue: "42", description: "Высота logo-панели без CSS override." },
      { name: "footer", type: "ReactNode | render fn", description: "Версия, feedback или нижние действия." },
      { name: "panel", type: "ReactNode", description: "Submenu/right content рядом с sider." },
      { name: "panelMobileHeight", type: "number | string", defaultValue: '"50dvh"', description: "Высота panel-зоны на mobile." },
      { name: "panelOpen/defaultPanelOpen", type: "boolean", defaultValue: "true", description: "Controlled/uncontrolled открытие submenu-панели." },
      { name: "panelTitle/panelActions", type: "ReactNode", description: "Шапка submenu-панели без привязки к конкретному модулю." },
      { name: "autoCollapseOnSelect", type: "boolean", defaultValue: "true", description: "Схлопывать sider после выбора пункта, как во front." },
      { name: "expandedWidth/collapsedWidth", type: "number", description: "Настройка ширин sider без CSS override." },
      { name: "onSelect", type: "(id, item) => void", description: "Выбор пункта навигации; после выбора sider схлопывается как во front." },
      { name: "onPanelOpenChange", type: "(open) => void", description: "Синхронизация controlled panelOpen." },
      { name: "onPanelClose", type: "() => void", description: "Optional close action для panel-зоны." }
    ],    usageCode: `<Sidebar
  activeId="notes"
  logo={<LogoFull />}
  collapsedLogo={<LogoMark />}
  logoHeight={56}
  items={[
    { id: "notes", label: "Заметки", icon: <Icon name="notes" /> },
    { id: "table", label: "Таблица", icon: <Icon name="table" /> }
  ]}
  panel={activeTabContent}
  panelTitle="Заметки"
  panelMobileHeight="50dvh"
  panelOpen={panelOpen}
  pinned={pinned}
  onPinnedChange={setPinned}
  onPanelOpenChange={setPanelOpen}
  onSelect={setActiveItem}
/>`,
    preview: <SidebarPreview />
  };
}

const SidebarPreview = () => {
  const [activeId, setActiveId] = useState("notes");
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div style={{ height: 380, width: "100%", display: "grid", overflow: "hidden", borderRadius: 8, position: "relative" }}>
      {!panelOpen && (
        <Button
          size="sm"
          variant="secondary"
          style={{ position: "absolute", right: 12, top: 12, zIndex: 3 }}
          onClick={() => setPanelOpen(true)}
        >
          Открыть панель
        </Button>
      )}
      <Sidebar
        activeId={activeId}
        collapsed={collapsed}
        pinned={pinned}
        panelOpen={panelOpen}
        onSelect={setActiveId}
        onCollapsedChange={setCollapsed}
        onPanelOpenChange={setPanelOpen}
        onPinnedChange={setPinned}
        onPanelClose={() => setPanelOpen(false)}
        logo={<strong>ShKit</strong>}
        collapsedLogo={<strong>Sh</strong>}
        logoHeight={56}
        items={[
          { id: "notes", label: "Заметки", icon: <Icon name="notes" /> },
          { id: "screens", label: "Экраны", icon: <Icon name="screen" /> },
          { id: "measure", label: "Измерения", icon: <Icon name="measure" /> },
          { id: "table", label: "Таблица", icon: <Icon name="table" /> }
        ]}
        panelTitle={activeId === "notes" ? "Заметки" : "Панель"}
        panel={
          <div style={{ display: "grid", gap: 12, padding: 16, width: 280 }}>
            <Switch label="Pinned panel" checked={pinned} onChange={event => setPinned(event.currentTarget.checked)} />
            <Switch label="Collapsed sider" checked={collapsed} onChange={event => setCollapsed(event.currentTarget.checked)} />
            <div style={{ border: "1px solid #d9d8da", borderRadius: 8, padding: 12 }}>
              <strong>{activeId}</strong>
              <p style={{ margin: "8px 0 0", color: "#777" }}>Любой контент модуля: дерево, фильтры, настройки файла или форма.</p>
            </div>
          </div>
        }
        footer={({ collapsed: isCollapsed }) => (
          <span style={{ color: "#a1a1a1", display: "block", fontSize: 11, padding: 12 }}>
            {isCollapsed ? "26" : "2026.05"}
          </span>
        )}
      />
    </div>
  );
}
