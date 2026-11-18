import { useState } from "react";
import { Button, Icon, RightPanel, Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getRightPanelDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "right-panel",
    name: "RightPanel",
    importCode: 'import { RightPanel } from "@ShKit";',
    description:
      "Правый drawer по мотивам front right-panel: вкладки-ручки слева, resize за левый край, fixed header offset, мобильная ширина от collapsed sidebar и личный toolbar у каждой вкладки.",    props: [
      { name: "tabs", type: "RightPanelTab[]", description: "Список вкладок drawer." },
      { name: "RightPanelTab.id", type: "string", description: "Стабильный id вкладки для activeId." },
      { name: "RightPanelTab.title", type: "ReactNode", description: "Заголовок вкладки в drawer и tab handle." },
      { name: "RightPanelTab.icon", type: "ComponentType<{ className?: string; size?: number }>", description: "Иконка вкладки. Можно обернуть ShKit Icon в локальный component wrapper." },
      { name: "RightPanelTab.content", type: "ReactNode", description: "Основной контент активной вкладки." },
      { name: "RightPanelTab.toolbar", type: "ReactNode", description: "Личная панель инструментов вкладки. Двигается и схлопывается вместе с RightPanel." },
      { name: "RightPanelTab.width", type: "number", description: "Предпочтительная ширина drawer для вкладки." },
      { name: "RightPanelTab.maxWidth", type: "number", description: "Максимальная ширина drawer для вкладки." },
      { name: "activeId", type: "string | null", description: "Активная вкладка." },
      { name: "open", type: "boolean", description: "Открыта ли панель. Клик по активной вкладке может сворачивать drawer." },
      { name: "headerOffset/mobileHeaderOffset", type: "number", description: "Отступ сверху под desktop/mobile header." },
      { name: "minWidth/maxWidth", type: "number", description: "Границы resize на desktop." },
      { name: "onActiveChange/onOpenChange/onCloseAll", type: "callbacks", description: "Контроль состояния снаружи." }
    ],    usageCode: `const NotesTabIcon = ({ className, size }) => <Icon name="notes" className={className} size={size} />;
const TableTabIcon = ({ className, size }) => <Icon name="table" className={className} size={size} />;

<RightPanel
  open={rightOpen}
  activeId={rightActiveId}
  headerOffset={HEADER_HEIGHT}
  mobileHeaderOffset={MOBILE_HEADER_HEIGHT}
  onOpenChange={setRightOpen}
  onActiveChange={setRightActiveId}
  tabs={[
    {
      id: "notes",
      title: "Заметки",
      icon: NotesTabIcon,
      toolbar: <MarkerTools />,
      content: <Notes />
    },
    {
      id: "table",
      title: "Таблица",
      icon: TableTabIcon,
      toolbar: <TableTools />,
      content: <Table />
    }
  ]}
/>`,
    preview: <RightPanelPreview />
  };
}

const RightPanelPreview = () => {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>("notes");

  return (
    <div style={{ height: 320, position: "relative", overflow: "hidden", border: "1px solid #d9d8da", borderRadius: 8 }}>
      <Button size="sm" variant="secondary" onClick={() => setOpen(value => !value)} style={{ margin: 12 }}>
        Toggle drawer
      </Button>
      <RightPanel
        open={open}
        activeId={activeId}
        headerOffset={0}
        mobileHeaderOffset={0}
        onOpenChange={setOpen}
        onActiveChange={id => setActiveId(id)}
        tabs={[
          {
            id: "notes",
            title: "Заметки",
            icon: ({ className, size }) => <Icon name="notes" className={className} size={size} />,
            toolbar: (
              <>
                <Button aria-label="Добавить" size="sm" square variant="ghost" icon={<Icon name="plus" />} />
                <Button aria-label="Рисовать" size="sm" square variant="ghost" icon={<Icon name="draw" />} />
              </>
            ),
            content: (
              <div style={{ display: "grid", gap: 12 }}>
                <strong>Заметки</strong>
                <Switch label="Публичные" defaultChecked />
              </div>
            )
          },
          {
            id: "table",
            title: "Таблица",
            icon: ({ className, size }) => <Icon name="table" className={className} size={size} />,
            toolbar: (
              <>
                <Button aria-label="Экспорт" size="sm" square variant="ghost" icon={<Icon name="export" />} />
                <Button aria-label="Сбросить" size="sm" square variant="ghost" icon={<Icon name="reset" />} />
              </>
            ),
            content: <strong>Настройки таблицы</strong>
          }
        ]}
      />
    </div>
  );
}
