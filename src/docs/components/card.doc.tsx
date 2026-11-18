import { Button, Card, CloseButton, Flow, Icon, Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getCardDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "card",
    name: "Card",
    importCode: 'import { Card } from "@ShKit";',
    description: "Легкая surface-карточка для метрик, настроек, tool windows и compact info blocks без возвращения старого Panel.",    props: [
      { name: "title/subtitle", type: "ReactNode", description: "Заголовочная зона." },
      { name: "titleIcon", type: "ReactNode", description: "Иконка слева от title, например <Icon name=\"measurement-stockpiles\" />." },
      { name: "titleSize", type: '"default" | "prominent"', defaultValue: '"default"', description: "Размер и плотность заголовка." },
      { name: "titleAlign", type: '"start" | "center"', defaultValue: '"start"', description: "Выравнивание title/subtitle. Без actions заголовочная зона занимает всю ширину Card." },
      { name: "headerDivider", type: "boolean", defaultValue: "true, если есть body/footer", description: "Линия-разделитель под header." },
      { name: "hoverable", type: "boolean", defaultValue: "true для outlined/elevated", description: "Легкий hover на surface карточки." },
      { name: "actions", type: "ReactNode", description: "Действия справа в header." },
      { name: "footer", type: "ReactNode", description: "Нижняя зона." },
      { name: "variant", type: '"plain" | "outlined" | "elevated"', defaultValue: '"outlined"', description: "Визуальный тип поверхности." },
      { name: "padding", type: '"none" | "sm" | "md"', defaultValue: '"md"', description: "Плотность внутреннего отступа." },
      { name: "as", type: '"article" | "section" | "div"', defaultValue: '"section"', description: "HTML element для root." }
    ],    usageCode: `<Card
  title="Объем проделанных работ"
  titleIcon={<Icon name="measurement-stockpiles" size={22} />}
  titleSize="prominent"
  actions={<CloseButton label="Закрыть" />}
>
  ...
</Card>

<Card title="Параметры слоя" actions={<Button size="sm">Save</Button>}>
  <Switch label="Показывать на карте" />
</Card>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Card
          title="Объем проделанных работ"
          titleIcon={<Icon name="measurement-stockpiles" size={22} />}
          titleSize="prominent"
          variant="elevated"
          actions={<CloseButton label="Закрыть" />}
        >
          <Switch label="Показывать на карте" defaultChecked />
        </Card>
        <Card
          title="Параметры слоя"
          subtitle="Surface для компактных настроек"
          actions={<Button size="sm" variant="secondary">Save</Button>}
          footer={<Button size="sm" variant="primary">Применить</Button>}
        >
          <Switch label="Показывать на карте" defaultChecked />
        </Card>
        <Card title="Пустое состояние" subtitle="Title центрируется и занимает всю ширину без actions" titleAlign="center">
          <Switch label="Показывать подсказки" />
        </Card>
      </Flow>
    )
  };
}
