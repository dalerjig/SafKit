import { useState } from "react";
import { RangeSlider, type RangeSliderValue } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const depthMarks = {
  0: "0 м",
  250: "250 м",
  500: "500 м",
  1000: "1000 м"
};

const RangeSliderPreview = () => {
  const [depth, setDepth] = useState<RangeSliderValue>([250, 750]);

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div style={{ display: "flex", gap: 52, justifyContent: "center", paddingTop: 8 }}>
        <RangeSlider label="Slice" defaultValue={[20, 80]} step={5} formatValue={value => `${value}%`} />
        <RangeSlider label="Depth" value={depth} onChange={setDepth} min={0} max={1000} step={50} marks={depthMarks} marksOffset={6} />
        <RangeSlider label="Gap 20" defaultValue={[30, 70]} step={10} dots minDistance={20} />
        <RangeSlider label="One bar" mode="single" defaultValue={60} step={5} formatValue={value => `${value}%`} />
        <RangeSlider label="Disabled" defaultValue={[35, 65]} step={5} disabled />
      </div>
      <RangeSlider label="Horizontal" vertical={false} defaultValue={[15, 60]} step={5} formatValue={value => `${value}%`} />
      <RangeSlider label="Horizontal, one bar" mode="single" vertical={false} defaultValue={40} step={5} dots formatValue={value => `${value}%`} />
    </div>
  );
};

export const getRangeSliderDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc => {
  return {
    id: "range-slider",
    name: "RangeSlider",
    importCode: 'import { RangeSlider, type RangeSliderValue } from "@ShKit";',
    description:
      "Slider с ручками-полосками вместо круглых thumb. По умолчанию вертикальный: одна полоска сверху, другая снизу, между ними подсвечен выбранный диапазон. mode=\"single\" оставляет одну такую же полоску и одно число вместо пары. Полезно для срезов, глубин и min/max фильтров.",
    props: [
      { name: "mode", type: '"range" | "single"', defaultValue: '"range"', description: 'Две полоски и диапазон или одна полоска и одно значение. От mode зависит тип value/defaultValue/onChange.' },
      { name: "value/defaultValue", type: "RangeSliderValue | number", defaultValue: "[min, max] / min", description: 'В mode="range" пара [min, max], порядок нормализуется автоматически. В mode="single" одно число.' },
      { name: "min/max/step", type: "number", description: "Диапазон и шаг. step=null + marks -> только значения marks." },
      { name: "minDistance", type: "number", defaultValue: "0", description: 'Минимальный зазор между полосками в единицах значения. Только для mode="range".' },
      { name: "vertical", type: "boolean", defaultValue: "true", description: "Вертикальная раскладка: полоски сверху и снизу. false -> слева и справа." },
      { name: "barLength", type: "number", defaultValue: "30", description: "Длина полоски поперёк track в px." },
      { name: "height", type: "number | string", defaultValue: "200", description: "Высота вертикального track." },
      { name: "marks", type: "SliderMarks", description: "Подписи и точки на track. Ключ — значение slider." },
      { name: "marksOffset", type: "number", defaultValue: "8", description: "Отступ подписей marks от track в px." },
      { name: "dots", type: "boolean", defaultValue: "false", description: "Точки на каждом step." },
      { name: "showValue", type: "boolean", defaultValue: "true", description: "Показывать текущий диапазон рядом с label." },
      { name: "formatValue", type: "(value) => ReactNode", description: "Форматирование каждой границы, например 72%." },
      { name: "onChange", type: "(value: RangeSliderValue | number) => void", description: 'Изменение значения: пара в mode="range", число в mode="single".' },
      { name: "error/hint", type: "ReactNode", description: "Состояния подписи." }
    ],
    usageCode: `const [depth, setDepth] = useState<RangeSliderValue>([250, 750]);

<RangeSlider
  label="Depth"
  value={depth}
  onChange={setDepth}
  min={0}
  max={1000}
  step={50}
  formatValue={value => \`\${value} м\`}
/>

<RangeSlider
  label="Slice"
  vertical={false}
  defaultValue={[20, 80]}
  step={5}
  minDistance={10}
/>

// Одна полоска вместо двух: value и onChange становятся числом
<RangeSlider
  label="Opacity"
  mode="single"
  defaultValue={60}
  step={5}
  formatValue={value => \`\${value}%\`}
/>`,
    preview: (
      <div className={styles.previewStack}>
        <RangeSliderPreview />
      </div>
    )
  };
};
