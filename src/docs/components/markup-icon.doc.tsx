import { useState } from "react";
import { MarkupIcon, markupIconNames, SegmentedControl, type MarkupIconName } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const labels: Record<MarkupIconName, string> = {
  camera: "Камера / Camera / 相机",
  cross: "Крест / Cross / 十字",
  marker: "Маркер / Marker / 标记",
  flag: "Флаг / Flag / 旗帜",
  danger: "Опасность / Danger / 危险",
  "haul-road": "Дорога / Haul Road / 运输道路",
  keyway: "Траншея / Keyway / 键槽",
  "panorama-360": "Панорама / Panorama / 全景",
  video: "Видео / Video / 视频",
};

export const getMarkupIconDoc = (_context: ComponentDocPreviewContext): ComponentDoc => ({
  id: "markup-icon",
  name: "MarkupIcon — маркеры на карте",
  importCode: 'import { MarkupIcon, markupIconNames } from "@dalerjig/safkit";',
  description: "9 типов маркапов. Круглый маркер (small) и пин переиспользуют один исходный символ с общей оболочкой; положение и масштаб символа задаются программно. Пины сохраняют пропорции 28×42 (видео — 28×38); edit увеличивает высоту на 6 и добавляет кольцо активности. Панорама — самостоятельный символ 32×32 без состояний. Все дорожные знаки и варианты разметки находятся в RoadIcon.",
  props: [
    { name: "name", type: "MarkupIconName", description: "camera, cross, marker, flag, danger, haul-road, keyway, panorama-360, video. Полный список: markupIconNames." },
    { name: "small", type: "boolean", defaultValue: "false", description: "Круглый SVG 24×24 вместо пина. Панорама не меняется." },
    { name: "edit", type: "boolean", defaultValue: "false", description: "Кольцо активности внизу пина. Доступно при small=false." },
    { name: "addContour", type: "boolean", defaultValue: "true", description: "Контур малого маркера. Доступно при small=true." },
    { name: "color", type: "string", defaultValue: "black; marker: currentColor", description: "Цвет заливки маркера/пина. Внутренний символ белый. Цвет панорамы фиксирован." },
    { name: "size", type: "number", description: "Ширина в px. Высота масштабируется пропорционально исходному viewBox с учётом edit. По умолчанию: маркер 24, пин 28, панорама 32." },
    { name: "title", type: "string", description: "Доступное название; также поддерживаются className, style, aria-label и SVG-обработчики." },
  ],
  usageCode: `<MarkupIcon name="camera" color="#007AFF" title="Камера" />
<MarkupIcon name="camera" small addContour={false} />
<MarkupIcon name="video" edit size={42} />
<MarkupIcon name="panorama-360" />
// embassy → flag, fire-station → danger, 360 → panorama-360.
<RoadIcon name="speed-limit-20" size={24} />`,
  preview: <MarkupIconPreview />,
});

function MarkupIconPreview() {
  const [background, setBackground] = useState("light");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <SegmentedControl value={background} onChange={setBackground} options={[
        { value: "light", label: "Светлый фон" }, { value: "dark", label: "Тёмный фон" },
      ]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
        {markupIconNames.map(name => (
          <div key={name} style={{ background: background === "dark" ? "#242424" : "#f0f0f0", color: background === "dark" ? "white" : "black", padding: 16, borderRadius: 8 }}>
            <div>{labels[name]}</div>
            <code>{name}</code>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 16 }}>
              {name === "panorama-360" ? <MarkupIcon name={name} title={labels[name]} /> : <>
                <MarkupIcon name={name} small color="#007AFF" title="Маркер с контуром" />
                <MarkupIcon name={name} small addContour={false} color="#007AFF" title="Маркер без контура" />
                <MarkupIcon name={name} color="#007AFF" title="Пин" />
                <MarkupIcon name={name} edit color="#007AFF" title="Активный пин" />
              </>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
