import { Button, Flow, ImagePreview } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const demoImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#EDECDA"/>
  <path d="M0 390 L250 260 L430 335 L650 210 L960 330 L960 540 L0 540 Z" fill="#8aac80"/>
  <path d="M90 410 C250 350 360 460 520 390 S760 320 900 420" fill="none" stroke="#BDDC0F" stroke-width="34" stroke-linecap="round"/>
  <rect x="84" y="80" width="250" height="92" rx="12" fill="#103E36"/>
  <text x="112" y="136" font-family="Rubik, Arial" font-size="34" font-weight="700" fill="white">ShKit Preview</text>
</svg>
`)}`;

export const getImagePreviewDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "image-preview",
    name: "ImagePreview",
    importCode: 'import { ImagePreview } from "@ShKit";',
    description: "Media preview shell для markups, tasks, panorama/content и будущего UploadList без Ant Design Image.",    props: [
      { name: "src/alt", type: "string", description: "Изображение и alt-текст." },
      { name: "title/caption", type: "ReactNode", description: "Подпись под превью и в viewer." },
      { name: "actions", type: "ReactNode", description: "Действия рядом с caption." },
      { name: "preview", type: "boolean", defaultValue: "true", description: "Разрешает открывать fullscreen viewer." },
      { name: "open/onOpenChange", type: "boolean / callback", description: "Controlled режим viewer." },
      { name: "fallback", type: "ReactNode", description: "Содержимое при ошибке загрузки." },
      { name: "viewer controls", type: "built-in", description: "Fullscreen viewer фиксирован на 80dvw x 80dvh, использует исходные размеры изображения, поддерживает zoom колесиком, поворот и reset." }
    ],    usageCode: `<ImagePreview
  src={imageUrl}
  alt="Ортофото"
  title="Съемка 18.05"
  caption="960 x 540"
  actions={<Button size="sm">Открыть</Button>}
/>`,
    preview: (
      <Flow className={styles.previewNarrow} gap={12}>
        <ImagePreview
          src={demoImage}
          alt="Demo terrain"
          title="Съемка 18.05"
          caption="Ортофото, 960 x 540"
          actions={<Button size="sm" variant="secondary">Открыть</Button>}
        />
        <ImagePreview
          src=""
          alt="Broken preview"
          title="Fallback"
          caption="Ошибка загрузки"
          fallback="Превью недоступно"
        />
      </Flow>
    )
  };
}
