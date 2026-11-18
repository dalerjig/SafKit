import { Popconfirm, Button } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getPopconfirmDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "popconfirm",
    name: "Popconfirm",
    importCode: 'import { Popconfirm } from "@ShKit";',
    description: "Компактное подтверждение опасных или необратимых действий без Ant Design.",    props: [
      { name: "trigger", type: "ReactNode", description: "Элемент открытия." },
      { name: "title/description", type: "ReactNode", description: "Текст подтверждения." },
      { name: "confirmText/cancelText", type: "ReactNode", description: "Подписи действий. По умолчанию переводятся по locale в ShKitProvider (ru, en, zh)." },
      { name: "danger", type: "boolean", defaultValue: "false", description: "Danger variant для confirm action." },
      { name: "open/onOpenChange", type: "boolean / callback", description: "Controlled режим." },
      { name: "onConfirm/onCancel", type: "callback", description: "События подтверждения и отмены." }
    ],    usageCode: `<Popconfirm
  trigger={<Button variant="danger">Удалить</Button>}
  title="Удалить элемент?"
  description="Действие нельзя отменить."
  confirmText="Удалить"
  cancelText="Отмена"
  danger
  onConfirm={removeItem}
/>`,
    preview: (
      <div className={styles.previewStack}>
        <Popconfirm
          trigger={<Button variant="danger">Удалить</Button>}
          title="Удалить элемент?"
          description="Действие нельзя отменить."
          danger
          onConfirm={() => new Promise(resolve => window.setTimeout(resolve, 650))}
        />
      </div>
    )
  };
}
