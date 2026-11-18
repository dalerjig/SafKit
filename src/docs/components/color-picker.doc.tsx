import { useState } from "react";
import { ColorPicker, Flow } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const demoPalette = [
  "#ABDDA4",
  "#f1c40f",
  "#e74c3c",
  "#9b59b6",
  "#3498db",
  "#1abc9c",
  "#2c3e50",
  "#95a5a6"
];

export const getColorPickerDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "color-picker",
    name: "ColorPicker",
    importCode: 'import { ColorPicker } from "@ShKit";',
    description:
      "Палитровый выбор цвета для markup, wires, analytics и 3D-настроек без Ant Design ColorPicker/Popover.",
    props: [
      { name: "value/defaultValue", type: "string", description: "Controlled/uncontrolled (#hex, rgb, rgba)." },
      { name: "palette", type: "string[]", description: "Набор цветов." },
      { name: "onChange", type: "(color: string) => void", description: "Выбор цвета." },
      { name: "fullMode", type: "boolean", defaultValue: "false", description: "Графический picker: S/V, hue, alpha, HEX или RGB." },
      {
        name: "format",
        type: '"hex" | "rgb" | "hsb" | Array<"hex" | "rgb" | "hsb">',
        defaultValue: '"hex"',
        description: "Формат value/onChange. Если массив - в fullMode появляется селект форматов."
      },
      { name: "rgb", type: "boolean", defaultValue: "false", description: "Deprecated. Используйте format='rgb'." },
      { name: "showValueLabel", type: "boolean", defaultValue: "false", description: "Строка текущего цвета над кружком." },
      {
        name: "counterMode",
        type: "boolean",
        defaultValue: "false",
        description: "Badge-триггер 36×36 с children внутри (например счётчик). Фон = текущий цвет."
      },
      { name: "children", type: "ReactNode", description: "Содержимое внутри counterMode badge." },
      { name: "onBlur", type: "() => void", description: "Вызывается при закрытии popup picker." },
      { name: "allowCustom", type: "boolean", defaultValue: "false", description: "Ручной ввод hex/rgb/hsb." },
      { name: "label", type: "ReactNode", description: "Отдельная подпись поля." },
      {
        name: "labelPlacement",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"top"',
        description: "Положение label относительно блока с кружком."
      },
      { name: "disabled", type: "boolean", description: "Отключенное состояние." }
    ],
    usageCode: `<ColorPicker label="Цвет разметки" value={color} palette={markupPalette} allowCustom onChange={setColor} />

<ColorPicker
  counterMode
  label="Цвет группы"
  value={groupColor}
  palette={groupPalette}
  fullMode
  onChange={setGroupColor}
  onBlur={saveGroupColor}
>
  {groupCount}
</ColorPicker>

<ColorPicker format="rgb" showValueLabel label="RGB only" value={rgbColor} palette={markupPalette} fullMode onChange={setRgbColor} />

<ColorPicker format={["hex", "rgb", "hsb"]} label="HEX/RGB/HSB" value={formatValue} palette={markupPalette} fullMode onChange={setFormatValue} />`,
    preview: <ColorPickerPreview styles={styles} />
  };
};

const ColorPickerPreview = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const [value, setValue] = useState("#e74c3c");
  const [fullValue, setFullValue] = useState("#3D324B");
  const [rgbValue, setRgbValue] = useState("rgb(46, 204, 113)");
  const [formatValue, setFormatValue] = useState("hsb(281, 34%, 29%)");
  const [counterColor, setCounterColor] = useState("#103E36");
  const [counterCount] = useState(12);

  return (
    <Flow className={styles.previewNarrow} gap={20}>
      <ColorPicker label="Цвет разметки" value={value} palette={demoPalette} allowCustom onChange={setValue} />
      <code>{value}</code>
      <Flow mode="horizontal" align="center" gap={12} fullWidth={false}>
        <ColorPicker
          counterMode
          label="counterMode"
          value={counterColor}
          palette={demoPalette}
          fullMode
          onChange={setCounterColor}
        >
          {counterCount}
        </ColorPicker>
        <code>{counterColor}</code>
      </Flow>
      <ColorPicker label="fullMode" value={fullValue} palette={demoPalette} fullMode onChange={setFullValue} />
      <code>{fullValue}</code>
      <ColorPicker label="RGB only (temporary example)" value={rgbValue} palette={demoPalette} fullMode format="rgb" onChange={setRgbValue} />
      <code>{rgbValue}</code>
      <ColorPicker
        label="HEX/RGB/HSB select (temporary example)"
        value={formatValue}
        palette={demoPalette}
        fullMode
        format={["hex", "rgb", "hsb"]}
        onChange={setFormatValue}
      />
      <code>{formatValue}</code>
    </Flow>
  );
};
