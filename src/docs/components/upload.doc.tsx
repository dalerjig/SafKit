import { useState } from "react";
import { style } from "typestyle";
import { Alert, Badge, Card, Description, Flow, Tag, Upload, UploadList, type UploadListItem } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";
import { color } from "../../tokens";

const initialItems: UploadListItem[] = [
  { id: "1", name: "orthophoto-18-05.tif", size: 24_200_000, status: "done" },
  { id: "2", name: "markup.json", size: 18_400, status: "uploading", progress: 62 },
  { id: "3", name: "broken-las.zip", size: 9_800_000, status: "error", error: "Файл не прошел проверку структуры" }
];

export const getUploadDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "upload",
    name: "Upload / UploadList",
    importCode: 'import { Upload, UploadList } from "@ShKit";',
    description: "UI-слой для выбора файлов, drag-and-drop и списка статусов без Ant Design Upload. Transport остается во front.",    props: [
      { name: "Upload.accept/multiple/disabled", type: "native input props", description: "Ограничения выбора файлов." },
      { name: "Upload.onFilesChange", type: "(files: File[]) => void", description: "Выбранные или dropped файлы." },
      {
        name: "Upload.mainTitle",
        type: "ReactNode",
        defaultValue: "Перетащите файлы сюда",
        description: "Заголовок dropzone. Строка — оформление ShKit (<strong>). ReactNode — без обёртки, свои стили на front."
      },
      {
        name: "Upload.titlePlacement",
        type: '"beside" | "below"',
        defaultValue: '"beside"',
        description: "beside — mainTitle слева от кнопки. below — кнопка сверху, mainTitle и description под ней."
      },
      { name: "Upload.description", type: "ReactNode", description: "Подпись под mainTitle." },
      { name: "Upload.label", type: "ReactNode", description: "Текст кнопки выбора файла." },
      { name: "UploadList.items", type: "UploadListItem[]", description: "Файлы со status/progress/error." },
      { name: "UploadListItem.id", type: "string", description: "Стабильный id файла в списке." },
      { name: "UploadListItem.name", type: "string", description: "Имя файла." },
      { name: "UploadListItem.date", type: "string", description: "Выбранная дата файла в формате YYYY-MM-DD." },
      { name: "UploadList.showDatePicker", type: "boolean", defaultValue: "false", description: "Компактные строки с иконкой календаря у файлов со статусом done. По клику открывает выбор даты." },
      { name: "UploadList.showApplyToAll", type: "boolean", defaultValue: "false", description: "Чекбокс внизу календаря: доступен после изменения даты, вызывает onDateChange для каждого файла. Обновляйте items через функциональный setState." },
      { name: "UploadList.onDateChange", type: "(item: UploadListItem, date: string) => void", description: "Передаёт файл и дату YYYY-MM-DD для обработки на фронте. Обновите item.date для управляемого значения." },
      { name: "UploadListItem.size", type: "number", description: "Размер файла в байтах." },
      { name: "UploadListItem.status", type: '"idle" | "uploading" | "done" | "error"', defaultValue: '"idle"', description: "Текущий статус файла." },
      { name: "UploadListItem.progress", type: "number", description: "Прогресс загрузки от 0 до 100 для uploading." },
      { name: "UploadListItem.error", type: "ReactNode", description: "Текст или ReactNode ошибки для error state." },
      { name: "UploadList.onRemove/onRetry/onPreview", type: "callbacks", description: "Действия над файлом." }
    ],    usageCode: `<Upload onFilesChange={uploadFiles} />

<Upload
  titlePlacement="below"
  mainTitle="Перетащите файлы сюда"
  description="или нажмите кнопку выше"
  onFilesChange={uploadFiles}
/>
<UploadList
  items={files}
  onRemove={removeFile}
  onRetry={retryFile}
  onPreview={previewFile}
/>

<UploadList
  items={files}
  showDatePicker
  showApplyToAll
  onDateChange={(item, date) => {
    setFiles(current => current.map(file =>
      file.id === item.id ? { ...file, date } : file
    ));
  }}
/>`,
    preview: <UploadPreview styles={styles} />
  };
}

const UploadPreview = ({ styles }: { styles: ComponentDocPreviewContext["styles"] }) => {
  const [items, setItems] = useState(initialItems);
  const completedCount = items.filter(item => item.status === "done").length;
  const errorCount = items.filter(item => item.status === "error").length;

  const appendFiles = (files: File[]) => {
    setItems(current => [
      ...files.map(file => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        status: "idle" as const
      })),
      ...current
    ]);
  };

  return (
    <Flow className={styles.previewNarrow} gap={12}>
      <Alert compact variant="warning" title="Transport остается снаружи">
        Upload отвечает за выбор файлов и UI состояния, а загрузку выполняет продуктовый слой.
      </Alert>
      <UploadDatePickerComparison />
      <div className={uploadDocStyles.sectionLabel}>mainTitle по умолчанию (строка)</div>
      <Upload multiple accept=".jpg,.png,.tif,.json" onFilesChange={appendFiles} />
      <div className={uploadDocStyles.sectionLabel}>mainTitle — свой ReactNode</div>
      <Upload
        multiple
        accept=".jpg,.png,.tif,.json"
        mainTitle={<span className={uploadDocStyles.customTitle}>Перетащите ортофото сюда</span>}
        description="JPG, PNG до 200 МБ"
        onFilesChange={appendFiles}
      />
      <div className={uploadDocStyles.sectionLabel}>titlePlacement=&quot;below&quot; — текст под кнопкой</div>
      <Upload
        multiple
        accept=".jpg,.png,.tif,.json"
        titlePlacement="below"
        mainTitle="Перетащите файлы сюда"
        description="JPG, PNG до 200 МБ"
        label="Выбрать файлы"
        onFilesChange={appendFiles}
      />
      <Card
        title="Пакет импорта"
        subtitle="Dropzone и список статусов в одной композиции"
        actions={<Badge tone={errorCount > 0 ? "danger" : "success"} text={`${items.length} файлов`} />}
      >
        <Flow gap={12}>
          <Description
            bordered
            density="compact"
            minColumnWidth={120}
            items={[
              { key: "ready", label: "Готово", value: <Tag tone="success">{completedCount}</Tag> },
              { key: "errors", label: "Ошибки", value: <Tag tone={errorCount > 0 ? "danger" : "default"}>{errorCount}</Tag> }
            ]}
          />
          <div className={uploadDocStyles.sectionLabel}>Обычный список — без иконок файла и готовности</div>
          <UploadList items={items} />
          <div className={uploadDocStyles.sectionLabel}>showDatePicker — выбор даты готового файла</div>
          <UploadList
            items={items}
            showDatePicker
            showApplyToAll
            onDateChange={(item, date) => setItems(current => current.map(file => file.id === item.id ? { ...file, date } : file))}
            onPreview={item => window.alert(item.name)}
            onRetry={item => setItems(current => current.map(file => (file.id === item.id ? { ...file, status: "uploading", progress: 24 } : file)))}
            onRemove={item => setItems(current => current.filter(file => file.id !== item.id))}
          />
          {items.filter(item => item.date).map(item => (
            <div key={item.id} className={uploadDocStyles.sectionLabel}>{item.name}: {item.date}</div>
          ))}
        </Flow>
      </Card>
    </Flow>
  );
};

// Temporary before/after comparison. Fake metadata only; no uploads or network requests.
const comparisonFiles: UploadListItem[] = [
  { id: "demo-1", name: "Ортофотоплан_участок_01.tif", size: 24_200_000, status: "done", date: "2026-11-06" },
  { id: "demo-2", name: "Акт_выполненных_работ.pdf", size: 1_480_000, status: "done", date: "2026-11-06" },
  { id: "demo-3", name: "Очень_длинное_название_файла_съёмки_строительной_площадки_версия_04.jpg", size: 3_600_000, status: "done" },
  { id: "demo-4", name: "Разметка.json", size: 18_400, status: "done" }
];

const UploadDatePickerComparison = () => (
  <Card title="Временно: showDatePicker — до / после" subtitle="По 4 фейковых файла. Дата, применение ко всем, предпросмотр и удаление доступны в обоих списках.">
    <Flow gap={12}>
      <UploadDatePickerSample before />
      <UploadDatePickerSample />
    </Flow>
  </Card>
);

const UploadDatePickerSample = ({ before = false }: { before?: boolean }) => {
  const [items, setItems] = useState(comparisonFiles);
  return (
    <div>
      <div className={uploadDocStyles.sectionLabel}>{before ? "До — отступы 10px" : "После — отступы 6px, календарь и удаление 32px"}</div>
      <UploadList
        className={before ? uploadDocStyles.beforeDatePicker : undefined}
        items={items}
        showDatePicker
        showApplyToAll
        onDateChange={(item, date) => setItems(current => current.map(file => file.id === item.id ? { ...file, date } : file))}
        onRemove={item => setItems(current => current.filter(file => file.id !== item.id))}
        onPreview={item => window.alert(`Фейковый файл: ${item.name}`)}
      />
      {items.filter(item => item.date).map(item => (
        <div key={item.id} className={uploadDocStyles.sectionLabel}>{item.name}: {item.date}</div>
      ))}
    </div>
  );
};

const uploadDocStyles = {
  // Restore only the previous row spacing for the temporary reference example.
  beforeDatePicker: style({
    $nest: { "&& > div": { padding: 10 } }
  }),
  sectionLabel: style({
    color: color.textSubtle,
    fontSize: 12,
    fontWeight: 800
  }),
  customTitle: style({
    color: color.accent,
    fontSize: 16,
    fontWeight: 900
  })
};
