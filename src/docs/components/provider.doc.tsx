import { Badge, Button, FileItem, Icon, SegmentedControl } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import { ShKitProvider } from "../../provider";

export const getProviderDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "shkit-provider",
    name: "ShKitProvider",
    importCode: 'import { ShKitProvider } from "@ShKit";',
    description:
      "Общий контекст ShKit. Отвечает за локаль, сообщения, font scope, portal host, theme variables и z-index scale, чтобы kit можно было перекрасить и встроить в продуктовые overlay-слои.",    props: [
      { name: "locale", type: '"ru" | "en" | "zh"', defaultValue: '"ru"', description: "Активный язык интерфейса." },
      { name: "messages", type: "Partial<ShKitMessages>", description: "Переопределение отдельных сообщений." },
      { name: "themePreset", type: '"shtab" | "contrast" | "dark"', defaultValue: '"shtab"', description: "Готовая цветовая схема." },
      { name: "theme", type: "ShKitTheme", description: "Переопределение semantic colors через CSS variables." },
      { name: "theme.zIndex", type: "ShKitZIndexTheme", description: "Переопределение ShKit overlay-слоев и добавление продуктовых z-index variables." },
      { name: "children", type: "ReactNode", description: "Дерево компонентов ShKit." }
    ],    usageCode: `<ShKitProvider
  locale="ru"
  themePreset="dark"
  theme={{
    color: { accent: "#BDDC0F" },
    zIndex: {
      modal: 100,
      productMapToolbar: 140
    }
  }}
>
  <Table id="analytics" data={rows} columns={columns} />
</ShKitProvider>`,
    preview: (
      <div className={styles.previewStack}>
        <SegmentedControl
          value="ru"
          options={[
            { label: "RU", value: "ru" },
            { label: "EN", value: "en" },
            { label: "中文", value: "zh" }
          ]}
        />
        <ShKitProvider themePreset="dark">
          <div
            className={styles.previewNarrow}
            style={{
              background: "var(--shkit-color-surface)",
              border: "1px solid var(--shkit-color-border)",
              borderRadius: 8,
              display: "grid",
              gap: 12,
              padding: 12
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 8, justifyContent: "space-between" }}>
              <strong style={{ color: "var(--shkit-color-text)" }}>Dark ShKit</strong>
              <Badge text="preview" tone="lime" size="sm" />
            </div>
            <SegmentedControl
              fullWidth
              value="layers"
              options={[
                { label: "Слои", value: "layers" },
                { label: "Заметки", value: "notes" }
              ]}
            />
            <FileItem
              title="orthophoto_night_2026.tif"
              description="03.06.2026"
              icon={<Icon name="screen" />}
              label="Активный"
              labelTone="lime"
              labelSize="sm"
              actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
            />
            <Button size="sm" variant="primary" icon={<Icon name="plus" />}>
              Добавить слой
            </Button>
          </div>
        </ShKitProvider>
      </div>
    )
  };
}
