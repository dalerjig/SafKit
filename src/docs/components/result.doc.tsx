import { Button, Flow, Result } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getResultDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "result",
    name: "Result",
    importCode: 'import { Result } from "@ShKit";',
    description: "Финальное состояние операции: success, error, warning или info без Ant Design Result.",    props: [
      { name: "status", type: '"success" | "error" | "warning" | "info"', defaultValue: '"info"', description: "Тип результата." },
      { name: "title", type: "ReactNode", description: "Основной текст." },
      { name: "subtitle", type: "ReactNode", description: "Дополнительное описание." },
      { name: "actions", type: "ReactNode", description: "Кнопки восстановления или перехода." },
      { name: "compact", type: "boolean", description: "Плотный вариант." },
      { name: "icon", type: "ReactNode", description: "Кастомная иконка." }
    ],    usageCode: `<Result
  status="success"
  title="Импорт завершен"
  subtitle="12 объектов добавлены на карту."
  actions={<Button>Открыть</Button>}
/>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <Result
          status="success"
          title="Импорт завершен"
          subtitle="12 объектов добавлены на карту."
          actions={<Button size="sm" variant="primary">Открыть</Button>}
          compact
        />
        <Result
          status="error"
          title="Импорт не выполнен"
          subtitle="Файл не прошел проверку структуры."
          actions={<Button size="sm" variant="outline">Загрузить другой</Button>}
          compact
        />
      </Flow>
    )
  };
}
