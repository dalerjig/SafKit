import { Alert, Button, Flow } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getAlertDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "alert",
    name: "Alert",
    importCode: 'import { Alert } from "@ShKit";',
    description: "Семантический inline feedback block для info/success/warning/error сообщений без Ant Design Alert.",    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "error"', defaultValue: '"info"', description: "Семантический вариант." },
      { name: "title", type: "ReactNode", description: "Заголовок сообщения." },
      { name: "children", type: "ReactNode", description: "Основной текст." },
      { name: "action", type: "ReactNode", description: "Действие справа." },
      { name: "compact", type: "boolean", description: "Плотный режим для панелей." }
    ],    usageCode: `<Alert variant="warning" title="Нужна проверка" action={<Button size="sm">Открыть</Button>}>
  Есть расхождения после последней съемки.
</Alert>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={10}>
        <Alert variant="info" title="Информация">
          Данные слоя обновлены из последней съемки.
        </Alert>
        <Alert variant="success" title="Сохранено">Настройки слоя применены.</Alert>
        <Alert variant="warning" title="Нужна проверка" action={<Button size="sm" variant="outline">Открыть</Button>}>
          Есть расхождения после последней съемки.
        </Alert>
        <Alert variant="error" title="Ошибка загрузки" action={<Button size="sm" variant="danger">Повторить</Button>}>
          Не удалось получить список объектов.
        </Alert>
        <Alert compact variant="info" title="Compact">
          Плотный вариант для sidebar и tool panels.
        </Alert>
      </Flow>
    )
  };
}
