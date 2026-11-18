import { useState } from "react";
import { Input, RoadIcon, SegmentedControl, roadIconNames, type RoadIconName } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import { color } from "../../tokens";

const signs: Record<RoadIconName, { label: string; code: string; note?: string }> = {
  "road-narrows-right": { label: "Сужение дороги справа", code: "1.20.2" },
  "lanes-three-straight": { label: "Направления движения по полосам — три полосы только прямо", code: "5.15.1" },
  "u-turn-place": { label: "Место для разворота", code: "6.3.1" },
  "car": {"label": "Вид транспортного средства — легковой автомобиль", "code": "8.4.3"},
  "cargo-vehicle": {"label": "Вид транспортного средства — грузовой автомобиль", "code": "8.4.1"},
  "controller": {"label": "Работник в каске и сигнальном жилете", "code": "", "note": "Локальный символ регулировщика, без номера ПДД"},
  "crane": {"label": "Опасность: грузоподъёмный кран", "code": "", "note": "Предупреждающий производственный символ, без номера ПДД"},
  "crosswalk-horizontal": {"label": "Пешеходный переход — вертикальные полосы", "code": "", "note": "Графический вариант разметки (crossing_h)"},
  "crosswalk-vertical": {"label": "Пешеходный переход — горизонтальные полосы", "code": "", "note": "Графический вариант разметки (crossing_v)"},
  "pedestrian-crossing-right": {"label": "Пешеходный переход — зеркальный вариант", "code": "", "note": "Сохранённый рисунок CrosswalkRightIcon"},
  "info": {"label": "Информация — синий фон", "code": "", "note": "Информационный символ, без номера ПДД"},
  "info-orange": {"label": "Информация — оранжевый фон", "code": "", "note": "Информационный символ, без номера ПДД"},
  "parking-back-to-curb": {"label": "Способ постановки транспортного средства на стоянку — задом к бордюру", "code": "", "note": "Сохранённый рисунок парковочной таблички"},
  "speed-limit-20": {"label": "Ограничение максимальной скорости — 20 км/ч", "code": "3.24"},
  "traffic-control": {"label": "Патрульный автомобиль", "code": "", "note": "Локальный символ патруля, без номера ПДД"},
  stop: { label: "Движение без остановки запрещено", code: "2.5" },
  "give-way": { label: "Уступите дорогу", code: "2.4" },
  "priority-road": { label: "Главная дорога", code: "2.1" },
  "no-entry": { label: "Въезд запрещён", code: "3.1" },
  "speed-limit-60": { label: "Ограничение скорости — 60", code: "3.24" },
  "pedestrian-crossing": { label: "Пешеходный переход", code: "5.19.1" },
  roadworks: { label: "Дорожные работы", code: "1.25" },
  parking: { label: "Парковка", code: "6.4" },
  "no-stopping": { label: "Остановка запрещена", code: "3.27" },
  roundabout: { label: "Круговое движение", code: "4.3" },
  "priority-road-end": { label: "Конец главной дороги", code: "2.2" },
  "oncoming-priority": { label: "Преимущество встречного движения", code: "2.6" },
  "priority-over-oncoming": { label: "Преимущество перед встречным движением", code: "2.7" },
  "intersection-secondary": { label: "Пересечение со второстепенной дорогой", code: "2.3.1" },
  "no-vehicles": { label: "Движение запрещено", code: "3.2" },
  "no-motor-vehicles": { label: "Движение механических ТС запрещено", code: "3.3" },
  "no-trucks": { label: "Движение грузовых автомобилей запрещено", code: "3.4" },
  "no-bicycles": { label: "Движение на велосипедах запрещено", code: "3.9" },
  "no-pedestrians": { label: "Движение пешеходов запрещено", code: "3.10" },
  "weight-limit": { label: "Ограничение массы — 8 т", code: "3.11" },
  "height-limit": { label: "Ограничение высоты — 4 м", code: "3.13" },
  "width-limit": { label: "Ограничение ширины — 2,5 м", code: "3.14" },
  "no-right-turn": { label: "Поворот направо запрещён", code: "3.18.1" },
  "no-left-turn": { label: "Поворот налево запрещён", code: "3.18.2" },
  "no-u-turn": { label: "Разворот запрещён", code: "3.19" },
  "no-overtaking": { label: "Обгон запрещён", code: "3.20" },
  "speed-limit-end": { label: "Конец ограничения скорости — 60", code: "3.25" },
  "no-parking": { label: "Стоянка запрещена", code: "3.28" },
  "restrictions-end": { label: "Конец всех ограничений", code: "3.31" },
  "straight-ahead": { label: "Движение прямо", code: "4.1.1" },
  "turn-right": { label: "Движение направо", code: "4.1.2" },
  "turn-left": { label: "Движение налево", code: "4.1.3" },
  "keep-right": { label: "Объезд препятствия справа", code: "4.2.1" },
  "keep-left": { label: "Объезд препятствия слева", code: "4.2.2" },
  "cycle-path": { label: "Велосипедная дорожка", code: "4.4.1" },
  "pedestrian-path": { label: "Пешеходная дорожка", code: "4.5.1" },
  "railway-crossing-barrier": { label: "Железнодорожный переезд со шлагбаумом", code: "1.1" },
  "railway-crossing": { label: "Железнодорожный переезд без шлагбаума", code: "1.2" },
  "traffic-signals": { label: "Светофорное регулирование", code: "1.8" },
  "bend-right": { label: "Опасный поворот направо", code: "1.11.1" },
  "slippery-road": { label: "Скользкая дорога", code: "1.15" },
  "uneven-road": { label: "Неровная дорога", code: "1.16" },
  "road-narrows": { label: "Сужение дороги с обеих сторон", code: "1.20.1" },
  children: { label: "Осторожно, дети", code: "1.23" },
  "other-danger": { label: "Прочие опасности", code: "1.33" },
  motorway: { label: "Автомагистраль", code: "5.1" },
  "one-way": { label: "Дорога с односторонним движением", code: "5.5" },
  "bus-stop": { label: "Место остановки автобуса / троллейбуса", code: "5.16" },
  "residential-zone": { label: "Жилая зона", code: "5.21" },
  "dead-end": { label: "Тупик", code: "6.8.1" },
  "bend-left": { label: "Опасный поворот налево", code: "1.11.2" },
  "double-bend-right": { label: "Опасные повороты — первый направо", code: "1.12.1" },
  "steep-descent": { label: "Крутой спуск — 10%", code: "1.13" },
  "steep-ascent": { label: "Крутой подъём — 10%", code: "1.14" },
  "speed-bump": { label: "Искусственная неровность", code: "1.17" },
  "pedestrian-warning": { label: "Предупреждение о пешеходном переходе", code: "1.22" },
  "wild-animals": { label: "Дикие животные", code: "1.27" },
  "falling-rocks": { label: "Падение камней", code: "1.28" },
  "two-way-traffic": { label: "Двустороннее движение", code: "1.21" },
  "no-motorcycles": { label: "Движение мотоциклов запрещено", code: "3.5" },
  "no-trailers": { label: "Движение с прицепом запрещено", code: "3.7" },
  "length-limit": { label: "Ограничение длины — 10 м", code: "3.15" },
  "minimum-distance": { label: "Ограничение минимальной дистанции — 50 м", code: "3.16" },
  "no-horn": { label: "Подача звукового сигнала запрещена", code: "3.26" },
  "no-dangerous-goods": { label: "Движение с опасными грузами запрещено", code: "3.32" },
  "straight-or-right": { label: "Движение прямо или направо", code: "4.1.4" },
  "straight-or-left": { label: "Движение прямо или налево", code: "4.1.5" },
  "left-or-right": { label: "Движение направо или налево", code: "4.1.6" },
  "keep-either-side": { label: "Объезд препятствия справа или слева", code: "4.2.3" },
  "first-aid": { label: "Пункт медицинской помощи", code: "7.1" },
  "hospital": { label: "Больница", code: "7.2" },
  "fuel-station": { label: "Автозаправочная станция", code: "7.3" },
  "vehicle-service": { label: "Техническое обслуживание автомобилей", code: "7.4" },
  "car-wash": { label: "Мойка автомобилей", code: "7.5" },
  "rest-area": { label: "Место отдыха", code: "7.11" },
  "speed-limit-40": { label: "Ограничение скорости — 40 км/ч", code: "3.24" },
  "speed-limit-50": { label: "Ограничение скорости — 50 км/ч", code: "3.24" },
  "lane-end-right": { label: "Конец полосы справа", code: "5.15.5" },
  "lane-end-left": { label: "Конец полосы слева", code: "5.15.6" },
  "lane-directions": { label: "Направления движения по полосам — налево / прямо, прямо", code: "5.15.1" },
  "tram-stop": { label: "Место остановки трамвая", code: "5.17" },
  "zone-70-up": { label: "Зона действия — 70 м, стрелка вверх", code: "8.2.2" },
  "bus-lane": { label: "Полоса для маршрутных транспортных средств", code: "5.14.1" },
  "lanes-three-left": { label: "Три полосы — левая прямо и налево", code: "5.15.1" },
  "lanes-three-right": { label: "Три полосы — правая прямо и направо", code: "5.15.1" },
  "lanes-two-turns": { label: "Две полосы — прямо и налево / прямо и направо", code: "5.15.1" },
  "lanes-three-left-white": { label: "Три полосы — левая прямо и налево, белый фон", code: "", note: "Графический вариант на белом фоне" },
  "lanes-three-right-white": { label: "Три полосы — правая прямо и направо, белый фон", code: "", note: "Графический вариант на белом фоне" },
  "lanes-two-turns-white": { label: "Две полосы — прямо и налево / прямо и направо, белый фон", code: "", note: "Графический вариант на белом фоне" },
  "lane-directions-white": { label: "Две полосы — налево / прямо, прямо, белый фон", code: "", note: "Графический вариант на белом фоне" },
  "height-limit-5": { label: "Ограничение высоты — 5 м", code: "3.13" },
  "car-wash-square": { label: "Мойка автомобилей — квадратная", code: "", note: "Графический вариант знака 7.5" },
  "car-wash-round": { label: "Мойка автомобилей — круглая", code: "", note: "Графический вариант, без номера ПДД" },
  "bus-road": { label: "Дорога с полосой для маршрутных транспортных средств", code: "5.11.1" },
  "one-way-left": { label: "Выезд на дорогу с односторонним движением — налево", code: "5.7.2" },
  "one-way-right": { label: "Выезд на дорогу с односторонним движением — направо", code: "5.7.1" },
  "blind-pedestrians": { label: "Слепые пешеходы — очки", code: "8.15" },
  "action-directions": { label: "Направления действия — направо и налево", code: "8.3.3" },
  "zone-70": { label: "Зона действия — 70 м", code: "8.2.1" },
  "zone-100": { label: "Зона действия — 100 м", code: "8.2.1" },
  "time-of-operation": { label: "Время действия — 8.00–19.00", code: "8.5.4" },
  "paid-services": { label: "Платные услуги", code: "8.8" },
  "paid-parking": { label: "Платная парковка", code: "6.4 + 8.8", note: "Знак парковки с табличкой «Платные услуги»" },
};

const previousNames: readonly RoadIconName[] = ["lanes-three-left", "lanes-three-right", "lanes-two-turns", "lanes-three-left-white", "lanes-three-right-white", "lanes-two-turns-white", "lane-directions-white", "height-limit-5", "car-wash-square", "car-wash-round", "bus-road", "one-way-left", "one-way-right", "blind-pedestrians", "paid-parking"];
const newestNames: readonly RoadIconName[] = ["action-directions", "zone-70", "zone-100", "time-of-operation", "paid-services", "keep-either-side", "bus-road"];
const reviewNames: readonly RoadIconName[] = ["road-narrows-right", "lanes-three-straight", "u-turn-place", ...newestNames, ...previousNames, "speed-limit-40", "speed-limit-50", "lane-end-right", "lane-end-left", "lane-directions", "tram-stop", "zone-70-up", "bus-lane", "children", "keep-either-side", "traffic-signals", "straight-ahead", "turn-left", "turn-right", "left-or-right", "straight-or-left", "straight-or-right", "no-left-turn", "no-right-turn", "car-wash"];

const categories = [
  { value: "all", label: `Все ${roadIconNames.length}` },
  { value: "review", label: "По вашим описаниям" },
  { value: "1", label: "Предупреждения" },
  { value: "2", label: "Приоритет" },
  { value: "3", label: "Запреты" },
  { value: "4", label: "Предписания" },
  { value: "5", label: "Особые предписания" },
  { value: "6", label: "Информация" },
  { value: "7", label: "Сервис" },
  { value: "8", label: "Таблички" },
  { value: "custom", label: "Графические варианты" },
];

const sources = [
  ["ПДД РФ: сервис", "https://www.consultant.ru/document/cons_doc_LAW_2709/cfb2278f8070b6d8205a0053a42f4236379105ca/"],
  ["ПДД РФ: приоритет", "https://www.consultant.ru/document/cons_doc_LAW_2709/f813c443e749db7b760a9fb7729a4e4ccdb2f3ea/"],
  ["ПДД РФ: запреты", "https://www.consultant.ru/document/cons_doc_LAW_2709/bf1f4781b8aa1172e9993c89c36db0dcdc88c495/"],
  ["ПДД РФ: предупреждения", "https://www.consultant.ru/document/cons_doc_LAW_2709/b284ec5e9ad7be3925387bbb60d7916447e5f3fe/"],
  ["ПДД РФ: предписания", "https://www.consultant.ru/document/cons_doc_LAW_2709/cfcce287ebd89cee09dc5b780337286c556b0978/"],
  ["ПДД РФ: особые предписания", "https://www.consultant.ru/document/cons_doc_LAW_2709/abf54a3a53893a59aab95ff7cfb06d2ce2b47435/"],
  ["ПДД РФ: информация", "https://www.consultant.ru/document/cons_doc_LAW_2709/8e2220e5b0d5072a22fdce5e3294847b0c673773/"],
  ["ПДД РФ: таблички", "https://www.consultant.ru/document/cons_doc_LAW_2709/d507c6724f67c7a6ff27ba125eb7db3e4d36a3a6/"],
  ["DfT: распространённые дорожные знаки", "https://www.gov.uk/government/publications/know-your-traffic-signs/introduction"],
  ["Highway Code: каталог дорожных знаков", "https://www.gov.uk/guidance/the-highway-code/traffic-signs"],
] as const;

export const getRoadIconDoc = (_context: ComponentDocPreviewContext): ComponentDoc => ({
  id: "road-icon",
  name: "RoadIcon — дорожные знаки",
  importCode: 'import { RoadIcon, roadIconNames } from "@dalerjig/safkit";',
  description: `${roadIconNames.length} дорожных знаков и графических вариантов на основе ПДД РФ. SVG с viewBox 24×24, стандартными цветами и векторными символами, без шрифтов и картинок. Галерея с поиском по названию, name и номеру ПДД, фильтром категорий, размерами 20–96 px и светлым/тёмным фоном. Числовые образцы: скорость 20, 40, 50 и 60, масса 8 т, высота 4 и 5 м, ширина 2,5 м, длина 10 м, дистанция 50 м, уклон 10%.`,
  props: [
    { name: "name", type: "RoadIconName", description: `Одно из ${roadIconNames.length} имён. roadIconNames содержит полный доступный список.` },
    { name: "size", type: "number", defaultValue: "20", description: "Ширина и высота SVG в px." },
    { name: "title", type: "string", description: "Доступное название знака. Без title иконка декоративная, как Icon." },
    { name: "…svgProps", type: "SVGProps<SVGSVGElement>", description: "className, style, aria-label, обработчики и остальные SVG props. Цвета знаков заданы внутри SVG и сохраняются в тёмной теме." },
  ],
  usageCode: `<RoadIcon name="stop" size={32} title="Движение без остановки запрещено" />
<RoadIcon name="pedestrian-crossing" size={48} title="Пешеходный переход" />
<RoadIcon name="parking" size={24} />
<RoadIcon name="cycle-path" size={32} title="Велосипедная дорожка" />
<RoadIcon name="no-overtaking" size={32} title="Обгон запрещён" />
<RoadIcon name="fuel-station" size={32} title="АЗС" />
<RoadIcon name="falling-rocks" size={32} title="Падение камней" />`,
  preview: <RoadIconPreview />,
});

function RoadIconPreview() {
  const [size, setSize] = useState(64);
  const [background, setBackground] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const dark = background === "dark";
  const normalize = (value: string) => value.toLowerCase().replace(/ё/g, "е");
  const search = normalize(query.trim());
  const filteredNames = roadIconNames.filter(name => (
    (category === "all" || (category === "review" ? reviewNames.includes(name) : category === "custom" ? !signs[name].code : signs[name].code.startsWith(`${category}.`))) &&
    normalize(`${name} ${signs[name].label} ${signs[name].code} ${signs[name].note ?? ""}`).includes(search)
  ));

  return (
    <div style={{ display: "grid", gap: 20, width: "100%", minWidth: 0 }}>
      <Input value={query} onChange={event => setQuery(event.currentTarget.value)}
        aria-label="Поиск дорожных знаков" placeholder="Название, name или номер ПДД — например, 3.27" />
      <SegmentedControl value={category} onChange={setCategory} options={categories} fullWidth scrollable />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <SegmentedControl value={size} onChange={setSize}
          options={[20, 24, 32, 48, 64, 96].map(value => ({ value, label: `${value} px` }))} />
        <SegmentedControl value={background} onChange={setBackground}
          options={[{ value: "light", label: "Светлый фон" }, { value: "dark", label: "Тёмный фон" }]} />
      </div>
      <span style={{ color: color.textMuted, fontSize: 13 }} aria-live="polite">
        Показано {filteredNames.length} из {roadIconNames.length} знаков
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {filteredNames.map(name => (
          <div key={name} style={{ background: dark ? "#18232D" : "#FFFFFF", color: dark ? "#FFFFFF" : "#18232D",
            border: `1px solid ${dark ? "#344350" : "#D9DDE1"}`,
            borderRadius: 10, padding: 16,
            display: "grid", gap: 8, justifyItems: "center", alignContent: "start", textAlign: "center" }}>
            <div style={{ height: 100, display: "flex", alignItems: "center" }}>
              <RoadIcon name={name} size={size} title={signs[name].label} />
            </div>
            <strong style={{ fontSize: 13 }}>{signs[name].label}</strong>
            {signs[name].code && <span style={{ fontSize: 12 }}>ПДД {signs[name].code}</span>}
            {signs[name].note && <span style={{ fontSize: 11 }}>{signs[name].note}</span>}
            <code style={{ fontSize: 11, overflowWrap: "anywhere" }}>{name}</code>
          </div>
        ))}
      </div>
      {filteredNames.length === 0 && <p>Знаки не найдены. Измените поиск или категорию.</p>}
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 800 }}>Каталог всех {roadIconNames.length} знаков и источники</summary>
        <p style={{ color: color.textMuted, lineHeight: 1.6 }}>
          Подборка для библиотеки на основе категорий ПДД РФ и справочников DfT / Highway Code.
          Единого рейтинга важности в этих источниках нет. Приоритет: знаки остановки и проезда,
          ограничения, опасности, направления и городская инфраструктура. Ограничение скорости представлено
          образцами 40, 50 и 60; левые и правые направления включены там, где нужен отдельный символ.
          Другие числовые образцы: масса 8 т, высота 4 и 5 м, ширина 2,5 м, длина 10 м, дистанция 50 м и уклон 10%. Зона действия 8.2.1 представлена образцами 70 и 100 м. Значения заданы в SVG.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead><tr>{["№", "ПДД", "Знак", "name"].map(label => (
              <th key={label} style={{ padding: 8, borderBottom: `1px solid ${color.border}` }}>{label}</th>
            ))}</tr></thead>
            <tbody>{roadIconNames.map((name, index) => (
              <tr key={name}>
                {[String(index + 1), signs[name].code || "Графический вариант", signs[name].label, name].map((value, i) => (
                  <td key={i} style={{ padding: 8, borderBottom: `1px solid ${color.border}` }}>{value}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p>Источники, просмотрены 08.10.2026:</p>
        <ul>{sources.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>
      </details>
    </div>
  );
}
