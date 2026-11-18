import { Button, ElementGroup, Header, HeaderDate, Icon } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getHeaderDoc = (_context: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "header",
    name: "Header",
    importCode: 'import { Header, HeaderDate } from "@ShKit";',
    description:
      "Верхняя панель приложения как layout primitive. Header не диктует toolbar-компонент: группы кнопок, профиль, customer selector и overflow собираются через слоты.",    props: [
      { name: "left", type: "ReactNode", description: "Левая область: дата, объект, логотип или контекст проекта." },
      { name: "center", type: "ReactNode", description: "Центральная область. Например ElementGroup, tabs или поиск." },
      { name: "right", type: "ReactNode", description: "Меню, профиль, customer switcher или дополнительные действия." },
      { name: "HeaderDate.day", type: "ReactNode", description: "Крупный номер даты/съемки." },
      { name: "HeaderDate.caption", type: "ReactNode", description: "Подпись под датой." }
    ],    usageCode: `<Header
  left={<HeaderDate day="01" caption="Май'26" />}
  center={<ElementGroup items={toolbarItems} overflowIcon={<Icon name="more" />} />}
  right={
    <Dropdown
      trigger={
        <Tooltip content="Демо-заказчик / Участок 1">
          <button className={customerTrigger}>
            <Icon name="business" />
            <span>{customer.name} / {site.name}</span>
          </button>
        </Tooltip>
      }
    >
      <CustomerSiteMenu />
    </Dropdown>
  }
/>`,
    preview: (
      <Header
        left={<HeaderDate day="01" caption="Май'26" />}
        center={
          <ElementGroup
            items={[
              { id: "draw", element: <Button icon={<Icon name="draw" />}>Рисунки</Button> },
              { id: "screen", element: <Button icon={<Icon name="screen" />}>Сохранить экран</Button> },
              { id: "measure", element: <Button icon={<Icon name="measure" />}>Измерения</Button> }
            ]}
            overflowIcon={<Icon name="more" />}
          />
        }
        right={<Button variant="primary">Создать</Button>}
      />
    )
  };
}
