import { Switch } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getSwitchDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "switch",
    name: "Switch",
    importCode: 'import { Switch } from "@ShKit";',
    description: "Binary toggle для настроек панелей, видимости слоев и compact form sections.",    props: [
      { name: "checked/defaultChecked", type: "boolean", description: "Controlled/uncontrolled состояние." },
      { name: "label", type: "ReactNode", description: "Основная подпись." },
      { name: "hint", type: "ReactNode", description: "Вторичная подпись." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disabled state." }
    ],    usageCode: `<Switch
  label="Показывать на карте"
  checked={visible}
  onChange={event => setVisible(event.currentTarget.checked)}
/>`,
    preview: (
      <div className={styles.previewStack}>
        <Switch label="Показывать на карте" defaultChecked />
        <Switch label="Pinned" hint="Закрепить панель" />
      </div>
    )
  };
}
