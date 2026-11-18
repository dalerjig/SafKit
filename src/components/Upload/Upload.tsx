import { type DragEvent, type InputHTMLAttributes, type ReactNode, useRef, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, scrollbar, space } from "../../tokens";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { DateInput } from "../DateInput";
import { Icon } from "../Icon";
import { Popconfirm } from "../Popconfirm";
import { Spinner } from "../Spinner";
import { Tag } from "../Tag";

export type UploadTitlePlacement = "beside" | "below";

export type UploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "children"> & {
  label?: ReactNode;
  description?: ReactNode;
  trigger?: ReactNode;
  onFilesChange?: (files: File[]) => void;
  /** Заголовок dropzone: строка — стиль ShKit (<strong>), любой ReactNode — как передали. */
  mainTitle?: ReactNode;
  /** beside — текст слева, кнопка справа. below — кнопка сверху, mainTitle и description под ней. */
  titlePlacement?: UploadTitlePlacement;
};

const defaultMainTitle = "Перетащите файлы сюда";

const renderMainTitle = (title: ReactNode) => {
  if (typeof title === "string" || typeof title === "number") {
    return <strong>{title}</strong>;
  }
  return title;
};

export const Upload = ({
  label = "Загрузить файл",
  description,
  trigger,
  onFilesChange,
  mainTitle = defaultMainTitle,
  titlePlacement = "beside",
  multiple,
  disabled,
  className,
  ...rest
}: UploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const emitFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    onFilesChange?.(multiple ? files : files.slice(0, 1));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (disabled) return;
    emitFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={classes(
        uploadStyles.root(titlePlacement),
        dragActive && uploadStyles.dragActive,
        disabled && uploadStyles.disabled,
        className
      )}
      onDragEnter={event => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragOver={event => event.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        disabled={disabled}
        className={uploadStyles.input}
        onChange={event => emitFiles(event.currentTarget.files)}
        {...rest}
      />
      {titlePlacement === "below" ? (
        <>
          <Button
            type="button"
            variant="primary"
            icon={<Icon name="plus" />}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {label}
          </Button>
          <div className={classes(uploadStyles.copy, uploadStyles.copyBelow)}>
            {renderMainTitle(mainTitle)}
            {description && <span>{description}</span>}
          </div>
        </>
      ) : (
        <>
          <div className={uploadStyles.copy}>
            {renderMainTitle(mainTitle)}
            {description && <span>{description}</span>}
          </div>
          <Button
            type="button"
            variant="primary"
            icon={<Icon name="plus" />}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {label}
          </Button>
        </>
      )}
      {trigger && (
        <button type="button" className={uploadStyles.triggerProxy} disabled={disabled} onClick={() => inputRef.current?.click()}>
          {trigger}
        </button>
      )}
    </div>
  );
}

export type UploadListItemStatus = "idle" | "uploading" | "done" | "error";

export type UploadListItem = {
  id: string;
  name: string;
  size?: number;
  status?: UploadListItemStatus;
  progress?: number;
  error?: ReactNode;
  previewUrl?: string;
  date?: string;
};

export type UploadListProps = {
  items: UploadListItem[];
  onRemove?: (item: UploadListItem) => void;
  onRetry?: (item: UploadListItem) => void;
  onPreview?: (item: UploadListItem) => void;
  showDatePicker?: boolean;
  /** Показывает чекбокс применения выбранной даты ко всем файлам. */
  showApplyToAll?: boolean;
  onDateChange?: (item: UploadListItem, date: string) => void;
  className?: string;
};

const statusTone: Record<UploadListItemStatus, "default" | "success" | "warning" | "danger" | "info"> = {
  idle: "default",
  uploading: "info",
  done: "success",
  error: "danger"
};

const statusLabel: Record<UploadListItemStatus, string> = {
  idle: "Ожидает",
  uploading: "Загрузка",
  done: "Готово",
  error: "Ошибка"
};

export const UploadList = ({ items, onRemove, onRetry, onPreview, showDatePicker = false, showApplyToAll = false, onDateChange, className }: UploadListProps) => {
  return (
    <div className={classes(uploadStyles.list, className)}>
      {items.map(item => {
        const status = item.status ?? "idle";

        return (
          <div key={item.id} className={uploadStyles.item(showDatePicker)}>
            <button type="button" className={uploadStyles.fileButton} onClick={() => onPreview?.(item)}>
              <span>
                <strong>{item.name}</strong>
                <small>{formatFileSize(item.size)}</small>
              </span>
            </button>
            <div className={uploadStyles.meta}>
              {status === "done" ? (
                showDatePicker && (
                  <UploadDatePicker
                    item={item}
                    items={items}
                    showApplyToAll={showApplyToAll}
                    onDateChange={onDateChange}
                  />
                )
              ) : (
                <Tag size="sm" tone={statusTone[status]}>{statusLabel[status]}</Tag>
              )}
              {status === "uploading" && <Spinner size="sm" />}
            </div>
            {status === "uploading" && typeof item.progress === "number" && (
              <div className={uploadStyles.progress}>
                <span style={{ width: `${Math.max(0, Math.min(item.progress, 100))}%` }} />
              </div>
            )}
            {item.error && <div className={uploadStyles.error}>{item.error}</div>}
            <div className={uploadStyles.actions}>
              {status === "error" && onRetry && (
                <Button size="sm" variant="outline" onClick={() => onRetry(item)}>
                  Повторить
                </Button>
              )}
              {onRemove && (
                <Popconfirm
                  title="Удалить файл?"
                  confirmText="Удалить"
                  cancelText="Отмена"
                  danger
                  onConfirm={() => onRemove(item)}
                  trigger={<Button size="sm" variant="ghost" square aria-label="Удалить" icon={<Icon name="close" size={16} />} />}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const UploadDatePicker = ({ item, items, showApplyToAll, onDateChange }: {
  item: UploadListItem;
  items: UploadListItem[];
  showApplyToAll: boolean;
  onDateChange: UploadListProps["onDateChange"];
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);

  return (
    <DateInput
      iconOnly
      size="sm"
      label={`Выбрать дату для ${item.name}`}
      value={item.date ?? ""}
      align="end"
      closeOnSelect={!showApplyToAll}
      onOpenChange={open => {
        if (open) {
          setSelectedDate("");
          setApplyToAll(false);
        }
      }}
      onChange={date => {
        if (date === item.date) return;
        setSelectedDate(date);
        if (applyToAll) {
          items.forEach(file => onDateChange?.(file, date));
        } else {
          onDateChange?.(item, date);
        }
      }}
      footer={showApplyToAll && (
        <div className={uploadStyles.dateFooter}>
          <Checkbox
            label="Применить ко всем файлам"
            disabled={!selectedDate}
            checked={applyToAll}
            onChange={event => {
              const checked = event.currentTarget.checked;
              setApplyToAll(checked);
              if (checked && selectedDate) {
                items.forEach(file => onDateChange?.(file, selectedDate));
              }
            }}
          />
        </div>
      )}
    />
  );
};

const formatFileSize = (size?: number) => {
  if (typeof size !== "number") return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const uploadStyles = {
  dateFooter: style({
    borderTop: `1px solid ${color.border}`,
    marginTop: space[8],
    paddingTop: space[8]
  }),
  root: (titlePlacement: UploadTitlePlacement) =>
    style({
      alignItems: "center",
      background: color.surface,
      border: `1px dashed ${color.borderStrong}`,
      borderRadius: radius.md,
      display: "grid",
      gap: space[12],
      gridTemplateColumns: titlePlacement === "below" ? "1fr" : "minmax(0, 1fr) auto",
      justifyItems: titlePlacement === "below" ? "center" : undefined,
      minWidth: 0,
      padding: space[16],
      textAlign: titlePlacement === "below" ? "center" : undefined,
      transition: "background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease"
    }),
  copyBelow: style({
    justifyItems: "center",
    width: "100%"
  }),
  dragActive: style({
    background: "rgba(189, 220, 15, 0.16)",
    borderColor: color.primary
  }),
  disabled: style({
    opacity: 0.58
  }),
  input: style({
    display: "none"
  }),
  copy: style({
    display: "grid",
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 15,
        fontWeight: 900
      },
      "& span": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 700
      }
    }
  }),
  triggerProxy: style({
    background: "transparent",
    border: 0,
    padding: 0
  }),
  list: style({
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    display: "grid",
    maxHeight: 340,
    minWidth: 0,
    overflow: "auto",
    $nest: scrollbar
  }),
  item: (withDatePicker: boolean) => style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    minWidth: 0,
    padding: withDatePicker ? `${space[6]}px ${space[10]}px` : space[10],
    $nest: {
      "& + &": {
        borderTop: `1px solid ${color.border}`
      }
    }
  }),
  fileButton: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    color: color.primary,
    cursor: "pointer",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr)",
    minWidth: 0,
    padding: 0,
    textAlign: "left",
    $nest: {
      "& strong, & small": {
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& strong": {
        color: color.primary,
        fontSize: 13,
        fontWeight: 900
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 11,
        fontWeight: 700
      }
    }
  }),
  meta: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6]
  }),
  progress: style({
    background: color.surfaceMuted,
    borderRadius: radius.round,
    gridColumn: "1 / -1",
    height: 4,
    overflow: "hidden",
    $nest: {
      "& span": {
        background: color.accent,
        display: "block",
        height: "100%"
      }
    }
  }),
  error: style({
    color: color.danger,
    fontSize: 12,
    fontWeight: 800,
    gridColumn: "1 / -1"
  }),
  actions: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6]
  })
};
