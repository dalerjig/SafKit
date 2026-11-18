import { useEffect, useRef, useState } from "react";
import { Checkbox } from "../Checkbox";
import { Input, NumberInput } from "../Input";
import { Select } from "../Select";
import type { TableColumn, TableRowBase } from "./types";

export type EditableCellProps<T extends TableRowBase> = {
  value: unknown;
  column: TableColumn<T>;
  saving?: boolean;
  error?: string;
  classNames: {
    editingWrap: string;
    editCheckbox: string;
    editControl: string;
    cellSpinner: string;
  };
  onCommit: (value: unknown) => void;
  onCancel?: () => void;
};

export const EditableCell = <T extends TableRowBase,>({
  value,
  column,
  saving,
  error,
  classNames,
  onCommit,
  onCancel
}: EditableCellProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commit = (nextValue: unknown = draft) => {
    if (Object.is(nextValue, value)) {
      onCancel?.();
      return;
    }
    onCommit(nextValue);
  };

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel?.();
    }
  };

  if (column.fieldType === "boolean") {
    return (
      <span className={classNames.editingWrap}>
        <Checkbox
          className={classNames.editCheckbox}
          checked={Boolean(draft)}
          disabled={saving}
          onChange={event => {
            const nextValue = event.currentTarget.checked;
            setDraft(nextValue);
            commit(nextValue);
          }}
        />
        {saving && <span className={classNames.cellSpinner} />}
      </span>
    );
  }

  if (column.fieldType === "select") {
    return (
      <span className={classNames.editingWrap}>
        <Select
          size="sm"
          className={classNames.editControl}
          value={String(draft ?? "")}
          options={column.selectOptions ?? []}
          disabled={saving}
          error={error}
          onChange={event => {
            const nextValue = event.currentTarget.value;
            setDraft(nextValue);
            commit(nextValue);
          }}
        />
        {saving && <span className={classNames.cellSpinner} />}
      </span>
    );
  }

  if (column.fieldType === "number") {
    return (
      <span className={classNames.editingWrap}>
        <NumberInput
          ref={inputRef}
          size="sm"
          className={classNames.editControl}
          value={typeof draft === "number" ? draft : draft === "" || draft === undefined || draft === null ? "" : Number(draft)}
          disabled={saving}
          error={error}
          onBlur={() => commit()}
          onChange={setDraft}
          onKeyDown={handleTextKeyDown}
        />
        {saving && <span className={classNames.cellSpinner} />}
      </span>
    );
  }

  return (
    <span className={classNames.editingWrap}>
      <Input
        ref={inputRef}
        size="sm"
        className={classNames.editControl}
        type={column.fieldType === "date" ? "date" : "text"}
        value={String(draft ?? "")}
        disabled={saving}
        error={error}
        onBlur={() => commit()}
        onChange={event => setDraft(event.currentTarget.value)}
        onKeyDown={handleTextKeyDown}
      />
      {saving && <span className={classNames.cellSpinner} />}
    </span>
  );
}
