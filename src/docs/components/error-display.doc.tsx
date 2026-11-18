import { ErrorDisplay, ErrorRetryButton, Flow } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getErrorDisplayDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "error-display",
    name: "ErrorDisplay",
    importCode: 'import { ErrorDisplay } from "@ShKit";',
    description: "Inline error UI для продуктовых и технических ошибок без локального sh-error.",    props: [
      { name: "title", type: "ReactNode", defaultValue: '"Ошибка"', description: "Заголовок." },
      { name: "error", type: "ReactNode", description: "Пользовательское описание ошибки." },
      { name: "details", type: "ReactNode | ReactNode[]", description: "Технические детали в disclosure." },
      { name: "action", type: "ReactNode", description: "Действие восстановления." },
      { name: "severity", type: '"error" | "warning"', defaultValue: '"error"', description: "Тип отображения." },
      { name: "compact", type: "boolean", description: "Плотный режим." }
    ],    usageCode: `<ErrorDisplay
  title="Не удалось загрузить объект"
  error="Проверьте соединение и повторите попытку."
  details={requestId}
  action={<Button>Повторить</Button>}
/>`,
    preview: (
      <Flow className={styles.previewNarrow}>
        <ErrorDisplay
          title="Не удалось загрузить объект"
          error="Проверьте соединение и повторите попытку."
          details={["GET /api/sites/demo-site/objects -> 500", "requestId: demo-42"]}
          action={<ErrorRetryButton />}
        />
      </Flow>
    )
  };
}
