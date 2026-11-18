import { useState } from "react";
import { Button, FileItem, FolderItem, Icon, Slider } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

const filePreviewImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" fill="#DDE8E0"/>
  <path d="M0 122 L42 86 L72 102 L108 66 L160 98 L160 160 L0 160 Z" fill="#7A9E77"/>
  <path d="M17 121 C45 105 68 130 96 111 S130 90 150 116" fill="none" stroke="#BDDC0F" stroke-width="10" stroke-linecap="round"/>
  <circle cx="42" cy="42" r="18" fill="#F2C94C"/>
</svg>
`)}`;

export const getFileFolderDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "file-folder",
    name: "FileItem / FolderItem",
    importCode: 'import { FileItem, FolderItem } from "@ShKit";',
    description:
      "Атомарные строки для файлов и папок. Они повторяют полезный опыт front explorer: фиксированная высота 60px, hover actions, description, label и отдельный клик по иконке папки.",    props: [
      { name: "title", type: "ReactNode", description: "Название файла или папки." },
      { name: "description", type: "ReactNode", description: "Дата, размер, автор или любое вторичное описание." },
      { name: "FileItem.activeContent", type: "ReactNode | render fn", description: "Inline-контент вместо description, когда файл активен." },
      { name: "FileItem.showActiveContent", type: "boolean", description: "Переопределяет правило показа activeContent. По умолчанию равен selected." },
      { name: "FileItem.preview", type: "{ src: string; alt?: string; title?: ReactNode; caption?: ReactNode }", description: "Фото-превью вместо иконки файла. Клик по thumbnail открывает ImagePreview." },
      { name: "icon", type: "ReactNode | render fn | null", description: "Кастомная иконка. Render-функция получает selected/hovered. null скрывает слот, название начинается сразу." },
      { name: "actions", type: "ReactNode | render fn", description: "Действия справа, видимые на hover." },
      { name: "selected", type: "boolean", defaultValue: "false", description: "Активный/выбранный элемент." },
      { name: "loading", type: "boolean", defaultValue: "false", description: "Placeholder для виртуальной/постраничной подгрузки." },
      { name: "height", type: "number", defaultValue: "FILE_ITEM_HEIGHT", description: "Фиксированная высота строки. Нужна для pagination/virtual viewport расчетов." },
      { name: "FILE_ITEM_HEIGHT", type: "60", description: "Экспортируемая константа высоты строки." },
      { name: "FileItem.label", type: "ReactNode", description: "Badge справа от имени файла." },
      { name: "FileItem.labelTone", type: 'BadgeTone', defaultValue: '"default"', description: "Тон Badge для label." },
      { name: "FileItem.labelSize", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Размер Badge для label." },
      { name: "FileItem.onSelect", type: "() => void", description: "Выбор файла." },
      { name: "FolderItem.containsItems", type: "boolean", description: "Состояние папки с вложенными элементами." },
      { name: "FolderItem.onOpen", type: "() => void", description: "Открыть папку." },
      { name: "FolderItem.onIconClick", type: "(nextSelected) => void", description: "Отдельный action по иконке, как выбор всех элементов папки во front." }
    ],    usageCode: `const [selectedFileId, setSelectedFileId] = useState<string | null>("orthophoto");

<FolderItem
  title={folder.name}
  description={formatDate(folder.createdAt)}
  containsItems={folderHasItems}
  selected={folderSelected}
  onOpen={() => openFolder(folder)}
  onIconClick={next => toggleFolder(folder, next)}
  height={FILE_ITEM_HEIGHT}
  actions={<FolderActions folder={folder} />}
/>

<FileItem
  title={file.name}
  description={file.createdAt}
  preview={file.thumbnailUrl ? {
    src: file.thumbnailUrl,
    alt: file.name,
    title: file.name,
    caption: file.createdAt
  } : undefined}
  activeContent={<OpacitySlider value={opacity} onChange={setOpacity} />}
  label={file.label}
  labelTone="lime"
  labelSize="sm"
  icon={getFileIcon(file)}
  selected={selectedFileId === file.id}
  height={FILE_ITEM_HEIGHT}
  onSelect={() => setSelectedFileId(file.id)}
  actions={({ hovered }) => hovered && <FileActions file={file} />}
/>

<FileItem
  title={bimLayer.name}
  description={bimLayer.createdAt}
  icon={null}
  selected={selectedFileId === bimLayer.id}
  onSelect={() => setSelectedFileId(bimLayer.id)}
/>`,
    preview: <FileFolderPreview className={styles.previewNarrow} />
  };
}

const FileFolderPreview = ({ className }: { className: string }) => {
  const [selectedFileId, setSelectedFileId] = useState("orthophoto");

  return (
    <div className={className} style={{ border: "1px solid #D9D8DA", borderRadius: 8, overflow: "hidden" }}>
      <FolderItem
        title="техника строительная 2025"
        description="31.10.2025"
        containsItems
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FolderItem
        title="Панорамы"
        description="28.11.2025"
        selected
        onIconClick={() => undefined}
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FileItem
        title="orthophoto_2026_04_20.jpg"
        description="20.04.2026"
        preview={{
          src: filePreviewImage,
          alt: "Ортофото 20.04.2026",
          title: "orthophoto_2026_04_20.jpg",
          caption: "20.04.2026"
        }}
        selected={selectedFileId === "orthophoto"}
        onSelect={() => setSelectedFileId("orthophoto")}
        label="Полигон"
        labelTone="lime"
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FileItem
        title="orthophoto_2026_04_20.jpg"
        description="20.04.2026"
        preview={{
          src: filePreviewImage,
          alt: "Ортофото 20.04.2026",
          title: "orthophoto_2026_04_20.jpg",
          caption: "20.04.2026"
        }}
        selected={selectedFileId === "orthophoto-green"}
        onSelect={() => setSelectedFileId("orthophoto-green")}
        label="Полигон"
        labelTone="green"
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FileItem
        title="analysis_result_long_badge.geojson"
        description="03.06.2026"
        selected={selectedFileId === "long-badge"}
        onSelect={() => setSelectedFileId("long-badge")}
        label="Очень длинное название бейджа"
        labelTone="orange"
        labelSize="sm"
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FileItem
        title="overlay_2026_05_01.tif"
        description="01.05.2026"
        selected={selectedFileId === "overlay"}
        icon={<Icon name="screen" />}
        activeContent={
          <span style={{ alignItems: "center", display: "grid", gap: 8, gridTemplateColumns: "auto minmax(0, 1fr)", fontSize: 12, fontWeight: 800 }}>
            <span>Opacity</span>
            <Slider defaultValue={68} showValue={false} />
          </span>
        }
        label="Активный слой"
        labelTone="dark"
        labelSize="sm"
        onSelect={() => setSelectedFileId("overlay")}
        actions={<Button size="sm" variant="ghost" square icon={<Icon name="more" />} />}
      />
      <FileItem
        title="IFC Site"
        description="без иконки, название сразу"
        icon={null}
        selected={selectedFileId === "bim-no-icon"}
        onSelect={() => setSelectedFileId("bim-no-icon")}
      />
      <FileItem title="загрузка следующей страницы" loading />
    </div>
  );
};
