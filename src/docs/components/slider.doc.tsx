import { Slider } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const temperatureMarks = {
  0: "0°C",
  26: "26°C",
  37: "37°C",
  100: {
    label: "100°C",
    style: { color: "#c2410c", fontWeight: 800 }
  }
};

export const getSliderDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "slider",
    name: "Slider",
    importCode: 'import { Slider, type SliderMarks } from "@ShKit";',
    description:
      "Range-control для opacity, интенсивности, высотных настроек и других числовых параметров. Fill и thumb двигаются от одного ratio; step/marks/dots как в antd Slider.",    props: [
      { name: "value/defaultValue", type: "number", description: "Controlled/uncontrolled значение." },
      { name: "min/max/step", type: "number", description: "Диапазон и шаг. step=null + marks -> только значения marks." },
      { name: "marks", type: "SliderMarks", description: "Подписи и точки на track. Ключ — значение slider." },
      { name: "marksOffset", type: "number", defaultValue: "8", description: "Отступ подписей marks от track в px." },
      { name: "dots", type: "boolean", defaultValue: "false", description: "Точки на каждом step." },
      { name: "showValue", type: "boolean", defaultValue: "true", description: "Показывать текущее значение рядом с label (horizontal) или под label (vertical)." },
      { name: "vertical", type: "boolean", defaultValue: "false", description: "Вертикальный slider, как antd Slider vertical." },
      { name: "height", type: "number | string", defaultValue: "200", description: "Высота вертикального track в px или css-единицах." },
      { name: "formatValue", type: "(value) => ReactNode", description: "Форматирование значения, например 72%." },
      { name: "onChange", type: "(value) => void", description: "Изменение значения." },
      { name: "error/hint", type: "ReactNode", description: "Состояния подписи." }
    ],    usageCode: `<Slider
  label="Opacity"
  min={0}
  max={100}
  step={5}
  dots
  defaultValue={72}
  formatValue={value => \`\${value}%\`}
/>

const marks: SliderMarks = {
  0: "0°C",
  26: "26°C",
  37: "37°C",
  100: "100°C"
};

<Slider
  label="Temperature"
  min={0}
  max={100}
  step={null}
  marks={marks}
  marksOffset={4}
  defaultValue={26}
/>`,
    preview: (
      <div className={styles.previewNarrow} style={{ display: "grid", gap: 14 }}>
        <Slider label="Opacity" defaultValue={72} step={5} dots formatValue={value => `${value}%`} />
        <Slider label="Cut intensity" defaultValue={35} min={0} max={50} step={5} dots />
        <Slider label="Temperature" defaultValue={26} marks={temperatureMarks} step={null} />
        <Slider label="Disabled" defaultValue={20} disabled step={10} dots />
        <div style={{ display: "flex", gap: 32, justifyContent: "center", paddingTop: 8 }}>
          <Slider vertical height={180} label="Height" defaultValue={65} step={10} dots formatValue={value => `${value}m`} />
          <Slider vertical height={180} label="Temp" defaultValue={37} marks={temperatureMarks} marksOffset={4} step={null} />
        </div>
      </div>
    )
  };
};
