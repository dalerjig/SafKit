import { Button, Header, Icon, Layout, LayoutContent, LayoutFitContent, LayoutHeader, LayoutRightPanel, LayoutSidebar, Sidebar, Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getLayoutDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "layout",
    name: "Layout",
    importCode: 'import { Layout, LayoutHeader, LayoutSidebar, LayoutContent, LayoutFitContent, LayoutRightPanel } from "@ShKit";',
    description:
      "Application shell с именованными областями. Для карт Content остается canvas, а fit-окна можно класть поверх него как самостоятельный overlay.",    props: [
      { name: "Layout.children", type: "ReactNode", description: "Композиция layout-регионов." },
      { name: "LayoutContent", type: "region", description: "Чистая рабочая зона: карта, canvas или экран инструмента. Не резервирует место под панели сама." },
      { name: "LayoutFitContent.padding", type: "number", defaultValue: "50", description: "Воздух справа/снизу при расчете доступного размера." },
      { name: "LayoutRightPanel.open", type: "boolean", defaultValue: "true", description: "Показывает или схлопывает статичную правую область." },
      { name: "LayoutRightPanel.width", type: "number | string", defaultValue: "360", description: "Ширина области инструментов." }
    ],    usageCode: `<Layout>
  <LayoutSidebar>
    <Sidebar items={items} panel={leftMenu} />
  </LayoutSidebar>
  <LayoutHeader>
    <Header center={toolbar} right={profile} />
  </LayoutHeader>
  <LayoutContent>
    <Map />
    <LayoutFitContent>
      <Table />
    </LayoutFitContent>
  </LayoutContent>
  <LayoutRightPanel width={240}>
    <Tools />
  </LayoutRightPanel>
</Layout>`,
    preview: (
      <div style={{ height: 320, overflow: "hidden", borderRadius: 8 }}>
        <Layout>
          <LayoutSidebar>
            <Sidebar
              activeId="screen"
              collapsed
              showMobileToggle={false}
              logo={<Icon name="business" />}
              panel={<div style={{ padding: 12, width: 180 }}>Left menu</div>}
              panelTitle="Экраны"
              items={[
                { id: "screen", label: "Экраны", icon: <Icon name="screen" /> },
                { id: "table", label: "Таблица", icon: <Icon name="table" /> }
              ]}
            />
          </LayoutSidebar>
          <LayoutHeader>
            <Header center={<Button icon={<Icon name="draw" />}>Toolbar</Button>} right={<Button square icon={<Icon name="menu" />} />} />
          </LayoutHeader>
          <LayoutContent>
            <div style={{ height: "100%", background: "linear-gradient(135deg, #d4b89d, #8aac80)", position: "relative" }} />
            <LayoutFitContent padding={24}>
              <div style={{ background: "white", border: "1px solid #D9D8DA", borderRadius: 8, padding: 12, width: "100%" }}>
                Fit window
              </div>
            </LayoutFitContent>
          </LayoutContent>
          <LayoutRightPanel width={180}>
            <div style={{ display: "grid", gap: 10, padding: 12 }}>
              <strong>Tools</strong>
              <Button size="sm" variant="primary" icon={<Icon name="plus" />}>Add</Button>
              <Switch label="Overlay" defaultChecked />
            </div>
          </LayoutRightPanel>
        </Layout>
      </div>
    )
  };
}
