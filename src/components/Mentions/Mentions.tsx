import {
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { classes, style } from "typestyle";
import { useShKitPortalTarget } from "../../provider";
import { color, radius, scrollbar, shadow, space, zIndex } from "../../tokens";
import { Spinner } from "../Spinner";

export type MentionOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  meta?: unknown;
};

export type MentionsProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "onSelect"> & {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  value?: string;
  defaultValue?: string;
  options?: MentionOption[];
  triggers?: string[];
  emptyText?: ReactNode;
  loadingText?: ReactNode;
  onChange?: (value: string) => void;
  onSearch?: (query: string, trigger: string) => MentionOption[] | Promise<MentionOption[]>;
  onSelect?: (option: MentionOption, trigger: string) => void;
  renderOption?: (option: MentionOption, state: { active: boolean }) => ReactNode;
};

type MentionMatch = {
  from: number;
  query: string;
  trigger: string;
};

type PopupRect = {
  left: number;
  top: number;
  width: number;
};

const defaultTriggers = ["@"];

export const Mentions = ({
  label,
  error,
  hint,
  value,
  defaultValue = "",
  options = [],
  triggers = defaultTriggers,
  emptyText = "Ничего не найдено",
  loadingText = "Загрузка",
  disabled,
  readOnly,
  className,
  onChange,
  onSearch,
  onSelect,
  renderOption,
  onKeyDown,
  onBlur,
  onClick,
  onFocus,
  ...rest
}: MentionsProps) => {
  const portalTarget = useShKitPortalTarget();
  const hasError = Boolean(error);
  const isControlled = value !== undefined;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const searchRequestRef = useRef(0);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [match, setMatch] = useState<MentionMatch | null>(null);
  const [popupRect, setPopupRect] = useState<PopupRect | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchedOptions, setSearchedOptions] = useState<MentionOption[] | null>(null);
  const [searching, setSearching] = useState(false);
  const currentValue = isControlled ? value : internalValue;
  const popupOpen = Boolean(match && popupRect && !disabled && !readOnly);

  const matchedOptions = useMemo(() => {
    if (!match) return [];
    const source = searchedOptions ?? options;
    const normalizedQuery = match.query.toLocaleLowerCase();

    return source.filter(option => {
      if (!normalizedQuery) return true;
      const labelText = typeof option.label === "string" ? option.label : "";
      return [option.value, labelText, option.description].some(item =>
        typeof item === "string" && item.toLocaleLowerCase().includes(normalizedQuery)
      );
    });
  }, [match, options, searchedOptions]);

  const enabledOptions = matchedOptions.filter(option => !option.disabled);

  useEffect(() => {
    if (!match || !onSearch) {
      setSearchedOptions(null);
      setSearching(false);
      return undefined;
    }

    const requestId = searchRequestRef.current + 1;
    searchRequestRef.current = requestId;
    setSearching(true);

    Promise.resolve(onSearch(match.query, match.trigger))
      .then(nextOptions => {
        if (searchRequestRef.current === requestId) {
          setSearchedOptions(nextOptions);
        }
      })
      .finally(() => {
        if (searchRequestRef.current === requestId) {
          setSearching(false);
        }
      });

    return undefined;
  }, [match?.query, match?.trigger, onSearch]);

  useEffect(() => {
    if (!popupOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!textareaRef.current?.contains(target) && !popupRef.current?.contains(target)) {
        closePopup();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [popupOpen]);

  useEffect(() => {
    const firstEnabledIndex = matchedOptions.findIndex(option => !option.disabled);
    setActiveIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : 0);
  }, [match?.query, matchedOptions.length]);

  const closePopup = () => {
    setMatch(null);
    setPopupRect(null);
    setSearchedOptions(null);
    setSearching(false);
  };

  const setNextValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const updateMentionState = () => {
    const textarea = textareaRef.current;
    if (!textarea || disabled || readOnly) return;

    const nextMatch = getMentionMatch(textarea.value, textarea.selectionStart, triggers);
    if (!nextMatch) {
      closePopup();
      return;
    }

    setMatch(nextMatch);
    setPopupRect(getMentionPopupRect(textarea));
  };

  const insertOption = (option: MentionOption) => {
    if (!match || option.disabled) return;

    const textarea = textareaRef.current;
    const selectionEnd = textarea?.selectionEnd ?? currentValue.length;
    const insertText = `${match.trigger}${option.value} `;
    const nextValue = `${currentValue.slice(0, match.from)}${insertText}${currentValue.slice(selectionEnd)}`;
    const nextCaret = match.from + insertText.length;

    setNextValue(nextValue);
    onSelect?.(option, match.trigger);
    closePopup();

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const moveActive = (direction: -1 | 1) => {
    if (enabledOptions.length === 0) return;

    const currentOption = matchedOptions[activeIndex];
    const enabledIndex = Math.max(0, enabledOptions.findIndex(option => option.value === currentOption?.value));
    const nextEnabled = enabledOptions[(enabledIndex + direction + enabledOptions.length) % enabledOptions.length];
    const nextIndex = matchedOptions.findIndex(option => option.value === nextEnabled.value);
    setActiveIndex(nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (popupOpen && event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }

    if (popupOpen && event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }

    if (popupOpen && event.key === "Escape") {
      event.preventDefault();
      closePopup();
      return;
    }

    if (popupOpen && (event.key === "Enter" || event.key === "Tab")) {
      const option = matchedOptions[activeIndex];
      if (option && !option.disabled) {
        event.preventDefault();
        insertOption(option);
        return;
      }
    }

    onKeyDown?.(event);
  };

  return (
    <label className={classes(mentionsStyles.root, disabled && mentionsStyles.disabled, className)}>
      {label && <span className={classes(mentionsStyles.label, hasError && mentionsStyles.errorText)}>{label}</span>}
      <textarea
        ref={textareaRef}
        className={classes(mentionsStyles.control, hasError && mentionsStyles.invalid)}
        disabled={disabled}
        readOnly={readOnly}
        value={currentValue}
        aria-autocomplete="list"
        aria-expanded={popupOpen}
        onBlur={onBlur}
        onClick={event => {
          onClick?.(event);
          window.requestAnimationFrame(updateMentionState);
        }}
        onFocus={event => {
          onFocus?.(event);
          window.requestAnimationFrame(updateMentionState);
        }}
        onChange={event => {
          setNextValue(event.currentTarget.value);
          window.requestAnimationFrame(updateMentionState);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={updateMentionState}
        {...rest}
      />
      {popupOpen &&
        popupRect &&
        createPortal(
          <div
            ref={popupRef}
            className={mentionsStyles.popup}
            role="listbox"
            style={{
              left: popupRect.left,
              top: popupRect.top,
              width: popupRect.width
            }}
          >
            {searching && (
              <div className={mentionsStyles.state}>
                <Spinner size="sm" />
                <span>{loadingText}</span>
              </div>
            )}
            {!searching && matchedOptions.length === 0 && <div className={mentionsStyles.state}>{emptyText}</div>}
            {!searching &&
              matchedOptions.map((option, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classes(mentionsStyles.option, active && mentionsStyles.optionActive)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={active}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => insertOption(option)}
                  >
                    {renderOption ? renderOption(option, { active }) : renderDefaultOption(option)}
                  </button>
                );
              })}
          </div>,
          portalTarget ?? document.body
        )}
      {(error || hint) && (
        <span className={classes(mentionsStyles.caption, hasError && mentionsStyles.error)}>{error || hint}</span>
      )}
    </label>
  );
}

const renderDefaultOption = (option: MentionOption) => {
  return (
    <span className={mentionsStyles.optionText}>
      <strong>{option.label}</strong>
      {option.description && <small>{option.description}</small>}
    </span>
  );
}

const getMentionMatch = (value: string, caret: number, triggers: string[]): MentionMatch | null  => {
  const beforeCaret = value.slice(0, caret);
  const tokenStart = Math.max(beforeCaret.lastIndexOf(" "), beforeCaret.lastIndexOf("\n"), beforeCaret.lastIndexOf("\t")) + 1;
  const token = beforeCaret.slice(tokenStart);
  const trigger = triggers.find(item => token.startsWith(item));

  if (!trigger || token.length < trigger.length) return null;

  return {
    from: tokenStart,
    query: token.slice(trigger.length),
    trigger
  };
}

const getMentionPopupRect = (textarea: HTMLTextAreaElement): PopupRect  => {
  const textareaRect = textarea.getBoundingClientRect();
  const caretRect = getTextareaCaretRect(textarea);
  const viewportPadding = 12;
  const width = Math.max(260, Math.min(textareaRect.width, 360));
  const left = Math.min(Math.max(viewportPadding, caretRect.left), window.innerWidth - width - viewportPadding);
  const openAbove = caretRect.bottom + 220 > window.innerHeight && caretRect.top > 220;

  return {
    left,
    top: openAbove ? Math.max(viewportPadding, caretRect.top - 214) : caretRect.bottom + 6,
    width
  };
}

const getTextareaCaretRect = (textarea: HTMLTextAreaElement) => {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const caret = document.createElement("span");
  const properties = [
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    "boxSizing",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "letterSpacing",
    "lineHeight",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "textTransform",
    "whiteSpace",
    "wordBreak",
    "wordSpacing",
    "overflowWrap"
  ] as const;

  properties.forEach(property => {
    mirror.style[property] = style[property];
  });

  mirror.style.height = "auto";
  mirror.style.left = "-9999px";
  mirror.style.position = "fixed";
  mirror.style.top = "0";
  mirror.style.visibility = "hidden";
  mirror.style.width = `${textarea.getBoundingClientRect().width}px`;
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.textContent = textarea.value.slice(0, textarea.selectionStart);
  caret.textContent = textarea.value.slice(textarea.selectionStart, textarea.selectionStart + 1) || " ";
  mirror.appendChild(caret);
  document.body.appendChild(mirror);

  const textareaRect = textarea.getBoundingClientRect();
  const caretRect = caret.getBoundingClientRect();
  const rect = {
    bottom: textareaRect.top + caretRect.bottom - mirror.getBoundingClientRect().top - textarea.scrollTop,
    left: textareaRect.left + caretRect.left - mirror.getBoundingClientRect().left - textarea.scrollLeft,
    top: textareaRect.top + caretRect.top - mirror.getBoundingClientRect().top - textarea.scrollTop
  };

  document.body.removeChild(mirror);

  return rect;
}

const mentionsStyles = {
  root: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0
  }),
  disabled: style({
    opacity: 0.58
  }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800
  }),
  control: style({
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    boxSizing: "border-box",
    color: color.text,
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.45,
    minHeight: 96,
    minWidth: 0,
    outline: "none",
    padding: `${space[10]}px ${space[12]}px`,
    resize: "vertical",
    transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
    width: "100%",
    $nest: {
      "&:focus": {
        borderColor: color.primary,
        boxShadow: shadow.focus
      },
      "&::placeholder": {
        color: color.textSubtle
      },
      "&:disabled": {
        cursor: "not-allowed"
      },
      "&:read-only": {
        cursor: "default"
      }
    }
  }),
  invalid: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    borderWidth: 2,
    color: color.danger,
    $nest: {
      "&:focus": {
        borderColor: color.danger,
        boxShadow: "0 0 0 3px rgba(192, 59, 43, 0.22)"
      }
    }
  }),
  popup: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    boxSizing: "border-box",
    display: "grid",
    gap: space[4],
    maxHeight: 220,
    overflow: "auto",
    padding: space[6],
    position: "fixed",
    zIndex: zIndex.dropdown,
    $nest: scrollbar
  }),
  option: style({
    background: "transparent",
    border: 0,
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    padding: `${space[8]}px ${space[10]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.46
      }
    }
  }),
  optionActive: style({
    background: color.surfaceMuted
  }),
  optionText: style({
    display: "grid",
    gap: 2,
    minWidth: 0,
    $nest: {
      "& strong": {
        fontSize: 14,
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& small": {
        color: color.textMuted,
        fontSize: 12,
        fontWeight: 700,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  }),
  state: style({
    alignItems: "center",
    color: color.textMuted,
    display: "inline-flex",
    fontSize: 13,
    fontWeight: 800,
    gap: space[8],
    minHeight: 36,
    padding: `${space[6]}px ${space[10]}px`
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
