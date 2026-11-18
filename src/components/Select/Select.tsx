import { type KeyboardEvent, type MouseEvent, type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { classes, style } from "typestyle";
import { useShKitPortalTarget } from "../../provider";
import { color, radius, scrollbar, shadow, space, zIndex } from "../../tokens";
import { Icon } from "../Icon";

export type SelectOption = {
  label: ReactNode;
  value: string;
  group?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  description?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
};

export type SelectSize = "sm" | "md" | "lg";

export type SelectChangeEvent = {
  currentTarget: {
    name?: string;
    value: string;
  };
};

export type SelectProps = {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  options: SelectOption[];
  size?: SelectSize;
  placeholder?: ReactNode;
  value?: string;
  defaultValue?: string;
  values?: string[];
  defaultValues?: string[];
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  allowClear?: boolean;
  multiple?: boolean;
  tags?: boolean;
  searchable?: boolean;
  maxVisibleTags?: number;
  emptyText?: ReactNode;
  className?: string;
  /** Ширина popup-списка = ширина control (без min 160px и расширения под длинные label). */
  matchTriggerWidth?: boolean;
  /** Ограничивает максимальную высоту popup-списка. */
  popupMaxHeight?: number;
  onChange?: (event: SelectChangeEvent) => void;
  onClear?: () => void;
  onValueChange?: (value: string, option: SelectOption) => void;
  onValuesChange?: (values: string[], options: SelectOption[]) => void;
  renderOption?: (option: SelectOption, state: { selected: boolean; active: boolean }) => ReactNode;
  renderValue?: (option: SelectOption | null) => ReactNode;
  renderTag?: (option: SelectOption, onRemove: () => void) => ReactNode;
};

const heights: Record<SelectSize, number> = {
  sm: 32,
  md: 40,
  lg: 52
};

const fontSizes: Record<SelectSize, number> = {
  sm: 13,
  md: 15,
  lg: 18
};

const selectIconActionStyle = style({
  alignItems: "center",
  borderRadius: radius.xs,
  color: color.textSubtle,
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: 0,
  justifyContent: "center",
  $nest: {
    "&:hover": {
      background: color.surfaceMuted,
      color: color.primary
    },
    "&:focus-visible": {
      outline: `2px solid ${color.primary}`,
      outlineOffset: 1
    }
  }
});

type SelectIconActionProps = {
  label: string;
  className?: string;
  iconSize?: number;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const SelectIconAction = ({ label, className, iconSize = 18, onClick }: SelectIconActionProps) => {
  const activate = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event as MouseEvent<HTMLElement>);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      data-select-action="true"
      className={classes(selectIconActionStyle, className)}
      onPointerDown={event => event.stopPropagation()}
      onClick={activate}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") activate(event);
      }}
    >
      <Icon name="close" size={iconSize} />
    </span>
  );
};

export const Select = ({
  label,
  error,
  hint,
  options,
  size = "md",
  placeholder = "Выберите",
  value,
  defaultValue = "",
  values,
  defaultValues = [],
  name,
  disabled,
  readOnly,
  allowClear,
  multiple,
  tags,
  searchable,
  maxVisibleTags = 3,
  emptyText = "Ничего не найдено",
  className,
  matchTriggerWidth = false,
  popupMaxHeight,
  onChange,
  onClear,
  onValueChange,
  onValuesChange,
  renderOption,
  renderValue,
  renderTag
}: SelectProps) => {
  const portalTarget = useShKitPortalTarget();
  const hasError = Boolean(error);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalValues, setInternalValues] = useState(defaultValues);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");
  const [popupRect, setPopupRect] = useState<SelectPopupRect | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const isMultiControlled = values !== undefined;
  const isMulti = Boolean(multiple || tags);
  const canSearch = searchable ?? Boolean(multiple || tags);
  const triggerSearch = canSearch && !tags && !readOnly;
  const controlPlaceholder = triggerSearch && placeholder === "Выберите" ? "Поиск" : placeholder;
  const currentValue = isControlled ? value : internalValue;
  const currentValues = isMultiControlled ? values : internalValues;
  const hasSelection = isMulti ? currentValues.length > 0 : Boolean(currentValue);
  const canClear = Boolean(allowClear && hasSelection && !disabled && !readOnly);
  const customOptions = useMemo(
    () =>
      currentValues
        .filter(selectedValue => !options.some(option => option.value === selectedValue))
        .map<SelectOption>(selectedValue => ({ label: selectedValue, value: selectedValue })),
    [currentValues, options]
  );
  const allOptions = useMemo(() => [...options, ...customOptions], [customOptions, options]);
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return allOptions;

    return allOptions.filter(option => {
      const label = typeof option.label === "string" ? option.label : option.value;
      const description = typeof option.description === "string" ? option.description : "";
      return `${label} ${description} ${option.value}`.toLocaleLowerCase().includes(query);
    });
  }, [allOptions, search]);
  const selectedOption = useMemo(
    () => allOptions.find(option => option.value === currentValue) ?? null,
    [allOptions, currentValue]
  );
  const selectedOptions = useMemo(
    () => currentValues.map(selectedValue => allOptions.find(option => option.value === selectedValue) ?? { label: selectedValue, value: selectedValue }),
    [allOptions, currentValues]
  );

  useEffect(() => {
    if (!open && triggerSearch) {
      setSearch("");
    }
  }, [open, triggerSearch]);

  useEffect(() => {
    if (!open || !triggerSearch) return;

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, triggerSearch]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const updatePopupRect = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPopupRect(getFloatingRect(rect, matchTriggerWidth, popupMaxHeight));
    };

    updatePopupRect();
    window.addEventListener("resize", updatePopupRect);
    window.addEventListener("scroll", updatePopupRect, true);
    return () => {
      window.removeEventListener("resize", updatePopupRect);
      window.removeEventListener("scroll", updatePopupRect, true);
    };
  }, [matchTriggerWidth, open, popupMaxHeight]);

  useEffect(() => {
    if (!open) return;

    const selectedIndex = filteredOptions.findIndex(option => option.value === currentValue && !option.disabled);
    const firstEnabledIndex = filteredOptions.findIndex(option => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : Math.max(firstEnabledIndex, 0));
  }, [currentValue, filteredOptions, open]);

  const selectOption = (option: SelectOption) => {
    if (option.disabled || readOnly) return;
    if (isMulti) {
      const nextValues = currentValues.includes(option.value)
        ? currentValues.filter(selectedValue => selectedValue !== option.value)
        : [...currentValues, option.value];
      const nextOptions = nextValues.map(selectedValue => allOptions.find(item => item.value === selectedValue) ?? { label: selectedValue, value: selectedValue });

      if (!isMultiControlled) {
        setInternalValues(nextValues);
      }
      onValuesChange?.(nextValues, nextOptions);
      setOpen(true);
      return;
    }

    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.({ currentTarget: { name, value: option.value } });
    onValueChange?.(option.value, option);
    setOpen(false);
    setSearch("");
  };

  const removeValue = (removedValue: string) => {
    if (readOnly) return;
    const nextValues = currentValues.filter(selectedValue => selectedValue !== removedValue);
    const nextOptions = nextValues.map(selectedValue => allOptions.find(item => item.value === selectedValue) ?? { label: selectedValue, value: selectedValue });

    if (!isMultiControlled) {
      setInternalValues(nextValues);
    }
    onValuesChange?.(nextValues, nextOptions);
  };

  const clearValue = () => {
    if (!canClear) return;
    if (isMulti) {
      if (!isMultiControlled) {
        setInternalValues([]);
      }
      onValuesChange?.([], []);
    } else {
      if (!isControlled) {
        setInternalValue("");
      }
      onChange?.({ currentTarget: { name, value: "" } });
      onValueChange?.("", { label: "", value: "" });
    }
    setSearch("");
    setTagInput("");
    setOpen(false);
    onClear?.();
  };

  const addTag = () => {
    if (readOnly) return;
    const nextTag = tagInput.trim();
    if (!nextTag || currentValues.includes(nextTag)) return;
    const nextValues = [...currentValues, nextTag];
    const nextOptions = nextValues.map(selectedValue => allOptions.find(item => item.value === selectedValue) ?? { label: selectedValue, value: selectedValue });

    if (!isMultiControlled) {
      setInternalValues(nextValues);
    }
    onValuesChange?.(nextValues, nextOptions);
    setTagInput("");
    setOpen(true);
  };

  const moveActive = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) return;

    for (let step = 1; step <= filteredOptions.length; step += 1) {
      const nextIndex = (activeIndex + direction * step + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[nextIndex].disabled) {
        setActiveIndex(nextIndex);
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (readOnly) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      moveActive(1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      moveActive(-1);
    }
    if (event.key === "Enter" || event.key === " ") {
      if (triggerSearch && event.key === " ") {
        return;
      }
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const option = filteredOptions[activeIndex];
      if (option) selectOption(option);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      if (triggerSearch) {
        setSearch("");
        searchInputRef.current?.blur();
      }
    }
  };

  const openSelect = () => {
    if (readOnly || disabled) return;
    setOpen(true);
  };

  const getSearchInputValue = () => {
    if (search) return search;
    if (!open && !isMulti && selectedOption) {
      if (renderValue) return "";
      const label = typeof selectedOption.label === "string" ? selectedOption.label : selectedOption.value;
      return label;
    }
    return "";
  };

  const renderTriggerValue = () => {
    if (isMulti) {
      return selectedOptions.length > 0 ? (
        <span className={selectStyles.tags}>
          {selectedOptions.slice(0, maxVisibleTags).map(option =>
            renderTag ? (
              renderTag(option, () => removeValue(option.value))
            ) : (
              <span key={option.value} className={selectStyles.tag}>
                {option.label}
                <SelectIconAction
                  label="Удалить тег"
                  className={selectStyles.tagRemove}
                  iconSize={16}
                  onClick={() => removeValue(option.value)}
                />
              </span>
            )
          )}
          {selectedOptions.length > maxVisibleTags && (
            <span className={selectStyles.tag}>+{selectedOptions.length - maxVisibleTags}</span>
          )}
        </span>
      ) : null;
    }

    if (renderValue) {
      return renderValue(selectedOption);
    }

    if (selectedOption) {
      return renderDefaultValue(selectedOption);
    }

    return placeholder;
  };

  const renderTriggerActions = () => (
    <span
      className={selectStyles.actions}
      data-select-action="true"
      onMouseDown={event => event.preventDefault()}
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        if ((event.target as HTMLElement).closest("[data-select-action]") !== event.currentTarget) return;
        if (readOnly || disabled) return;
        if (open) {
          setOpen(false);
          searchInputRef.current?.blur();
          return;
        }
        openSelect();
      }}
    >
      {canClear && (
        <SelectIconAction
          label="Очистить"
          className={selectStyles.clearButton}
          onClick={() => clearValue()}
        />
      )}
      <span className={selectStyles.chevron} />
    </span>
  );

  return (
    <div ref={rootRef} className={classes(selectStyles.root, disabled && selectStyles.disabled, readOnly && selectStyles.readOnly, className)}>
      {label && <span className={classes(selectStyles.label, hasError && selectStyles.errorText)}>{label}</span>}
      <input type="hidden" name={name} value={isMulti ? currentValues.join(",") : currentValue ?? ""} />
      {triggerSearch ? (
        <div
          ref={triggerRef as React.RefObject<HTMLDivElement>}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-readonly={readOnly}
          className={classes(
            selectStyles.control(size),
            selectStyles.searchableControl,
            hasError && selectStyles.invalid,
            open && selectStyles.open,
            disabled && selectStyles.controlDisabled
          )}
          onClick={event => {
            if ((event.target as HTMLElement).closest("[data-select-action]")) return;
            openSelect();
          }}
        >
          <span
            className={classes(
              selectStyles.value,
              selectStyles.searchableValue,
              !hasSelection && !search && selectStyles.placeholder
            )}
          >
            {isMulti && renderTriggerValue()}
            {!isMulti && !open && !search && selectedOption && renderValue ? (
              <span className={selectStyles.selectedValue}>{renderTriggerValue()}</span>
            ) : null}
            {(isMulti || open || search || !selectedOption || !renderValue) && (
              <input
                ref={searchInputRef}
                className={selectStyles.searchInput(size)}
                value={getSearchInputValue()}
                placeholder={
                  isMulti
                    ? selectedOptions.length > 0
                      ? "Найти"
                      : String(controlPlaceholder)
                    : !selectedOption || open || search
                      ? String(controlPlaceholder)
                      : undefined
                }
                disabled={disabled}
                readOnly={readOnly}
                aria-autocomplete="list"
                onChange={event => {
                  setSearch(event.currentTarget.value);
                  setOpen(true);
                }}
                onFocus={() => openSelect()}
                onKeyDown={handleKeyDown}
              />
            )}
          </span>
          {renderTriggerActions()}
        </div>
      ) : (
        <button
          type="button"
          ref={triggerRef as RefObject<HTMLButtonElement>}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-readonly={readOnly}
          disabled={disabled}
          className={classes(selectStyles.control(size), hasError && selectStyles.invalid, open && selectStyles.open)}
          onClick={() => {
            if (!readOnly) setOpen(value => !value);
          }}
          onKeyDown={handleKeyDown}
        >
          <span className={classes(selectStyles.value, !selectedOption && selectedOptions.length === 0 && selectStyles.placeholder)}>
            {isMulti ? renderTriggerValue() : <span className={selectStyles.selectedValue}>{renderTriggerValue()}</span>}
          </span>
          {renderTriggerActions()}
        </button>
      )}

      {open &&
        popupRect &&
        createPortal(
          <div
            ref={listRef}
            data-shkit-portal
            className={selectStyles.list(size)}
            role="listbox"
            onPointerDown={event => event.stopPropagation()}
            style={{
              bottom: popupRect.bottom,
              left: popupRect.left,
              maxHeight: popupRect.maxHeight,
              maxWidth: popupRect.maxWidth,
              top: popupRect.top,
              width: popupRect.width
            }}
          >
          {!readOnly && tags && (
            <div className={selectStyles.tagEditor}>
              <input
                value={tagInput}
                placeholder="Добавить тег"
                onChange={event => setTagInput(event.currentTarget.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveActive(1);
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveActive(-1);
                  }
                }}
              />
              <button type="button" onClick={addTag}>+</button>
            </div>
          )}
          {filteredOptions.length === 0 && <div className={selectStyles.empty}>{emptyText}</div>}
          {filteredOptions.map((option, index) => {
            const selected = isMulti ? currentValues.includes(option.value) : option.value === currentValue;
            const active = index === activeIndex;
            const previousGroup = index > 0 ? filteredOptions[index - 1].group : undefined;
            const showGroup = option.group !== undefined && option.group !== previousGroup;

            return (
              <div key={option.value} className={selectStyles.optionWrap}>
                {showGroup && <div className={selectStyles.groupLabel}>{option.group}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  className={classes(
                    selectStyles.option,
                    selected && selectStyles.selected,
                    active && selectStyles.active,
                    option.tone && selectStyles.tone(option.tone)
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {renderOption ? renderOption(option, { selected, active }) : renderDefaultOption(option)}
                  {selected && <span className={selectStyles.check}>✓</span>}
                </button>
              </div>
            );
          })}
          </div>,
          portalTarget ?? document.body
        )}

      {(error || hint) && <span className={classes(selectStyles.caption, hasError && selectStyles.error)}>{error || hint}</span>}
    </div>
  );
}

const renderDefaultValue = (option: SelectOption) => {
  return (
    <span className={selectStyles.value}>
      {option.icon && <span className={selectStyles.icon}>{option.icon}</span>}
      <span className={selectStyles.selectedValue}>{option.label}</span>
    </span>
  );
}

const renderDefaultOption = (option: SelectOption) => {
  return (
    <>
      {option.icon && <span className={selectStyles.icon}>{option.icon}</span>}
      <span className={selectStyles.optionText}>
        <span>{option.label}</span>
        {option.description && <small>{option.description}</small>}
      </span>
    </>
  );
}

const selectStyles = {
  root: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0,
    position: "relative"
  }),
  disabled: style({
    opacity: 0.58
  }),
  readOnly: style({
    $nest: {
      "& button": {
        cursor: "default"
      }
    }
  }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800
  }),
  control: (size: SelectSize) =>
    style({
      alignItems: "center",
      background: color.surface,
      border: `1px solid ${color.borderStrong}`,
      borderRadius: radius.sm,
      boxSizing: "border-box",
      color: color.text,
      cursor: "pointer",
      display: "grid",
      fontSize: fontSizes[size],
      fontWeight: 700,
      gridTemplateColumns: "minmax(0, 1fr) auto",
      minHeight: heights[size],
      minWidth: 0,
      padding: `0 ${space[10]}px`,
      textAlign: "left",
      transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
      width: "100%",
      $nest: {
        "&:focus-visible": {
          borderColor: color.primary,
          boxShadow: shadow.focus,
          outline: "none"
        },
        "&:disabled": {
          cursor: "not-allowed"
        }
      }
    }),
  open: style({
    borderColor: color.primary,
    boxShadow: shadow.focus
  }),
  searchableControl: style({
    cursor: "text"
  }),
  controlDisabled: style({
    cursor: "not-allowed"
  }),
  searchableValue: style({
    alignItems: "center",
    display: "inline-flex",
    flex: "1 1 auto",
    flexWrap: "wrap",
    gap: space[4],
    minWidth: 0
  }),
  selectedValue: style({
    flex: "0 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  searchInput: (size: SelectSize) =>
    style({
      background: "transparent",
      border: 0,
      color: "inherit",
      flex: "1 1 40px",
      font: "inherit",
      fontSize: fontSizes[size],
      fontWeight: 700,
      minWidth: 0,
      textOverflow: "ellipsis",
      outline: "none",
      padding: 0,
      width: "100%",
      $nest: {
        "&::placeholder": {
          color: color.textSubtle,
          fontWeight: 700
        },
        "&:disabled": {
          cursor: "not-allowed"
        }
      }
    }),
  invalid: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    borderWidth: 2,
    color: color.danger,
    $nest: {
      "&:focus-visible": {
        borderColor: color.danger,
        boxShadow: "0 0 0 3px rgba(192, 59, 43, 0.22)"
      }
    }
  }),
  value: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[8],
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  placeholder: style({
    color: color.textSubtle
  }),
  chevron: style({
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: `6px solid currentColor`,
    flexShrink: 0,
    height: 0,
    width: 0
  }),
  actions: style({
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    gap: space[4],
    justifyContent: "flex-end",
    marginLeft: space[4],
    minHeight: 24,
    minWidth: 10,
    padding: 0,
    position: "relative",
    zIndex: 1
  }),
  clearButton: style({
    height: 24,
    minWidth: 24,
    width: 24
  }),
  list: (size: SelectSize) =>
    style({
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      boxSizing: "border-box",
      boxShadow: "0 18px 42px rgba(25, 25, 25, 0.18)",
      display: "grid",
      gap: space[4],
      left: 0,
      minWidth: 0,
      overflow: "auto",
      padding: space[6],
      position: "fixed",
      zIndex: zIndex.select,
      $nest: {
        "& button": {
          fontSize: fontSizes[size]
        },
        ...scrollbar
      }
    }),
  option: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    display: "grid",
    fontWeight: 700,
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minHeight: 34,
    padding: `${space[8]}px ${space[10]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5
      }
    }
  }),
  optionWrap: style({
    display: "grid",
    gap: space[4]
  }),
  groupLabel: style({
    color: color.textSubtle,
    fontSize: 11,
    fontWeight: 900,
    padding: `${space[6]}px ${space[10]}px 0`,
    textTransform: "uppercase"
  }),
  empty: style({
    color: color.textSubtle,
    fontSize: 13,
    fontWeight: 800,
    padding: `${space[10]}px ${space[12]}px`,
    textAlign: "center"
  }),
  active: style({
    background: color.surfaceMuted
  }),
  selected: style({
    background: color.surfaceSecondary,
    color: color.primary
  }),
  tone: (tone: NonNullable<SelectOption["tone"]>) =>
    style({
      color:
        tone === "danger"
          ? color.danger
          : tone === "warning"
          ? color.warning
          : tone === "success"
          ? color.primary
          : color.text
    }),
  icon: style({
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center"
  }),
  optionText: style({
    display: "grid",
    gap: 2,
    minWidth: 0,
    $nest: {
      "& span": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 700,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  }),
  check: style({
    color: color.primary,
    fontWeight: 900
  }),
  tags: style({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    minWidth: 0,
    padding: "3px 0"
  }),
  tag: style({
    alignItems: "center",
    background: color.surfaceSecondary,
    borderRadius: radius.xs,
    color: color.primary,
    display: "inline-flex",
    fontSize: 12,
    fontWeight: 900,
    gap: 4,
    minHeight: 22,
    padding: "0 7px"
  }),
  tagRemove: style({
    height: 18,
    minWidth: 18,
    width: 18
  }),
  tagEditor: style({
    borderBottom: `1px solid ${color.border}`,
    display: "grid",
    gap: space[6],
    gridTemplateColumns: "minmax(0, 1fr) 32px",
    marginBottom: space[4],
    padding: `${space[4]}px ${space[4]}px ${space[8]}px`,
    $nest: {
      "& input": {
        border: `1px solid ${color.borderStrong}`,
        borderRadius: radius.xs,
        boxSizing: "border-box",
        fontWeight: 700,
        minWidth: 0,
        outline: "none",
        padding: `0 ${space[8]}px`
      },
      "& button": {
        alignItems: "center",
        background: color.primary,
        border: 0,
        borderRadius: radius.xs,
        color: color.surface,
        cursor: "pointer",
        display: "inline-flex",
        fontSize: 18,
        fontWeight: 900,
        justifyContent: "center"
      }
    }
  }),
  caption: style({
    color: color.textMuted,
    fontSize: 12,
    fontWeight: 700
  }),
  error: style({
    color: color.danger
  }),
  errorText: style({
    color: color.danger
  })
};

type SelectPopupRect = {
  bottom?: number;
  left: number;
  maxHeight: number;
  maxWidth: number;
  top?: number;
  width: number;
};

const getFloatingRect = (rect: DOMRect, matchTriggerWidth: boolean, popupMaxHeight?: number): SelectPopupRect  => {
  const margin = 12;
  const gap = 6;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const availableBelow = viewportHeight - rect.bottom - gap - margin;
  const availableAbove = rect.top - gap - margin;
  const placeBelow = availableBelow >= Math.min(280, availableAbove);
  const viewportMaxWidth = Math.max(viewportWidth - margin * 2, 160);
  const triggerWidth = Math.max(rect.width, 1);
  const width = matchTriggerWidth
    ? Math.min(triggerWidth, viewportMaxWidth)
    : Math.min(Math.max(rect.width, 160), viewportMaxWidth);
  const left = Math.min(Math.max(rect.left, margin), viewportWidth - width - margin);
  const availableHeight = Math.max(placeBelow ? availableBelow : availableAbove, 120);
  const maxHeight = popupMaxHeight ? Math.min(availableHeight, popupMaxHeight) : availableHeight;

  return {
    bottom: placeBelow ? undefined : viewportHeight - rect.top + gap,
    left,
    maxHeight,
    maxWidth: matchTriggerWidth ? width : viewportMaxWidth,
    top: placeBelow ? rect.bottom + gap : undefined,
    width
  };
}
