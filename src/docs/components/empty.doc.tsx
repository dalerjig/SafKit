import { Button, Card, Empty, Flow } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getEmptyDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "empty",
    name: "Empty",
    importCode: 'import { Empty } from "@ShKit";',
    description: "Пустое состояние для списков, таблиц, explorer и submenu без Ant Design Empty.",    props: [
      { name: "title", type: "ReactNode", defaultValue: '"Нет данных"', description: "Заголовок пустого состояния." },
      { name: "description", type: "ReactNode", description: "Пояснение." },
      { name: "action", type: "ReactNode", description: "Основное действие." },
      { name: "icon", type: "ReactNode", description: "Кастомная иконка." },
      { name: "variant", type: '"default" | "compact"', defaultValue: '"default"', description: "Плотность отображения." }
    ],    usageCode: `<Empty
  title="Нет объектов"
  description="Создайте первый объект или измените фильтр."
  action={<Button>Создать</Button>}
/>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Card padding="sm">
          <Empty
            title="Нет объектов"
            description="Создайте первый объект или измените фильтр."
            action={<Button size="sm" variant="primary">Создать</Button>}
          />
        </Card>
        <Card padding="sm">
          <Empty variant="compact" title="Нет файлов" description="Папка пока пустая." />
        </Card>
      </Flow>
    )
  };
}
