import { useState } from "react";
import { Alert, Button, Card, Description, Flow, ToastProvider, useToast } from "../../components";
import type { ToastPlacement } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const placements: ToastPlacement[] = ["top-right", "top-center", "top-left", "bottom-right", "bottom-center", "bottom-left"];

const ToastDemo = ({ placement, onPlacementChange }: { placement: ToastPlacement; onPlacementChange: (placement: ToastPlacement) => void }) => {
  const toast = useToast();

  return (
    <Flow gap={12}>
      <Alert compact variant="info" title="Viewport">
        Позиция меняется в ToastProvider, сами уведомления вызываются через useToast.
      </Alert>
      <Flow mode="horizontal" wrap gap={8}>
        {placements.map(item => (
          <Button
            key={item}
            size="sm"
            variant={placement === item ? "primary" : "outline"}
            onClick={() => {
              onPlacementChange(item);
              toast.info({ title: item, description: "Позиция toast viewport обновлена." });
            }}
          >
            {item}
          </Button>
        ))}
      </Flow>
      <Description
        bordered
        density="compact"
        columns={2}
        items={[
          { key: "placement", label: "Placement", value: placement },
          { key: "duration", label: "Duration", value: "4000 ms" }
        ]}
      />
      <Flow mode="horizontal" wrap gap={8}>
        <Button size="sm" onClick={() => toast.success({ title: "Сохранено", description: "Настройки слоя применены." })}>
          Success
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.info({ title: "Импорт запущен", description: "Файл добавлен в очередь обработки." })}>
          Info
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.warning({
              title: "Нужна проверка",
              description: "Есть расхождения после последней съемки.",
              action: { label: "Открыть", onClick: () => undefined }
            })
          }
        >
          Warning
        </Button>
        <Button size="sm" variant="danger" onClick={() => toast.error({ title: "Ошибка загрузки", description: "Не удалось получить список объектов.", duration: 0 })}>
          Error
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.info({
              title: "Широкий toast",
              description: "ToastOptions.width задаёт ширину этой карточки. Без пропа остаётся 420px.",
              width: 560
            })
          }
        >
          Width 560
        </Button>
      </Flow>
    </Flow>
  );
};

const ToastPlacementDemo = () => {
  const [placement, setPlacement] = useState<ToastPlacement>("bottom-right");

  return (
    <ToastProvider placement={placement} defaultDuration={4000}>
      <ToastDemo placement={placement} onPlacementChange={setPlacement} />
    </ToastProvider>
  );
}

export const getToastDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "toast",
    name: "Toast",
    importCode: 'import { ToastProvider, useToast } from "@ShKit";',
    description: "Глобальные transient feedback-сообщения вместо antd message.",    props: [
      { name: "ToastProvider.placement", type: '"top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"', defaultValue: '"top-right"', description: "Позиция viewport." },
      { name: "ToastProvider.offset", type: "number", defaultValue: "20", description: "Отступ от края (px): для top-* — от верха, для bottom-* — от низа." },
      { name: "ToastProvider.maxToasts", type: "number", defaultValue: "5", description: "Максимум уведомлений в стеке." },
      { name: "ToastProvider.defaultDuration", type: "number", defaultValue: "5000", description: "Автозакрытие в миллисекундах. 0 отключает таймер." },
      { name: "ToastProvider.width", type: "number", defaultValue: "420", description: "Ширина toast в px. Если не задана — как раньше, 420." },
      { name: "useToast().success/error/warning/info", type: "(options | ReactNode) => string", description: "Показывает toast и возвращает id." },
      { name: "ToastOptions.title/description", type: "ReactNode", description: "Основной текст уведомления." },
      { name: "ToastOptions.action", type: "{ label, onClick }", description: "Опциональное действие внутри toast." },
      { name: "ToastOptions.width", type: "number", description: "Ширина этой карточки в px. Перебивает ToastProvider.width." },
      { name: "dismiss/clear", type: "callbacks", description: "Закрытие одного уведомления или очистка стека." }
    ],    usageCode: `<ToastProvider>
  <SaveButton />
</ToastProvider>

const SaveButton = () => {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast.success({
          title: "Сохранено",
          description: "Настройки слоя применены."
        })
      }
    >
      Save
    </Button>
  );
}`,
    preview: (
      <Card className={styles.previewNarrow} title="Toast playground" subtitle="Проверь позиции, статусы и action внутри уведомления.">
        <ToastPlacementDemo />
      </Card>
    )
  };
}
