import { Button, Flow, Icon, NumberInput, ShortCard } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getShortCardDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "short-card",
    name: "ShortCard",
    importCode: 'import { ShortCard } from "@dalerjig/safkit";',
    description:
      "Компактная карточка для measurement tool windows: заголовок с иконкой, панели метрик, строки с label/value и координатные ряды. Заменяет Card + measurementToolStyles.",
    props: [
      { name: "title", type: "ReactNode", description: "Заголовок карточки." },
      { name: "icon", type: "IconName", description: "Иконка слева от title, например \"measurement-cross-section\"." },
      { name: "titleIcon", type: "ReactNode", description: "Кастомная иконка вместо icon." },
      { name: "ShortCard.Body", type: '"surface" | "muted"', defaultValue: '"surface"', description: "Панель с border и padding для группы метрик." },
      { name: "ShortCard.Row", type: "{ label?: ReactNode }", description: "Строка label + control/value." },
      { name: "ShortCard.Value", type: "ReactNode", description: "Read-only значение метрики." },
      { name: "ShortCard.Divider", type: "—", description: "Горизонтальный разделитель внутри Body." },
      { name: "ShortCard.Coords", type: "—", description: "Горизонтальный ряд координат; Row внутри получает flex: 1." },
      { name: "ShortCard.Content", type: "—", description: "Flow gap=12 для вложенных секций, например внутри Form." }
    ],
    usageCode: `<ShortCard
  title="Поперечник"
  icon="measurement-cross-section"
>
  <ShortCard.Body>
    <ShortCard.Row label="Шаг, м">
      <NumberInput size="sm" min={0.5} max={2000} value={10} />
    </ShortCard.Row>

    <ShortCard.Divider />

    <ShortCard.Row label="Ширина, м">
      <ShortCard.Coords>
        <ShortCard.Row label="Слева">
          <NumberInput size="sm" min={1} max={50} value={5} />
        </ShortCard.Row>
        <Button size="sm" square variant="outline" icon={<Icon name="link" />} />
        <ShortCard.Row label="Справа">
          <NumberInput size="sm" min={1} max={50} value={5} />
        </ShortCard.Row>
      </ShortCard.Coords>
    </ShortCard.Row>
  </ShortCard.Body>
</ShortCard>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <ShortCard title="Поперечник" icon="measurement-cross-section">
          <ShortCard.Body>
            <ShortCard.Row label="Шаг, м">
              <NumberInput size="sm" min={0.5} max={2000} defaultValue={10} />
            </ShortCard.Row>
            <ShortCard.Divider />
            <ShortCard.Row label="Ширина, м">
              <ShortCard.Coords>
                <ShortCard.Row label="Слева">
                  <NumberInput size="sm" min={1} max={50} defaultValue={5} />
                </ShortCard.Row>
                <Button size="sm" square variant="outline" icon={<Icon name="link" />} />
                <ShortCard.Row label="Справа">
                  <NumberInput size="sm" min={1} max={50} defaultValue={5} />
                </ShortCard.Row>
              </ShortCard.Coords>
            </ShortCard.Row>
          </ShortCard.Body>
        </ShortCard>

        <ShortCard>
          <ShortCard.Body>
            <ShortCard.Row label="Насыпь, м³">
              <ShortCard.Value>12 450</ShortCard.Value>
            </ShortCard.Row>
            <ShortCard.Divider />
            <ShortCard.Row label="Выемка, м³">
              <ShortCard.Value>8 320</ShortCard.Value>
            </ShortCard.Row>
          </ShortCard.Body>
        </ShortCard>
      </Flow>
    )
  };
};
