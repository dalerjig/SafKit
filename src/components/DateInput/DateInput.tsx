import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dayjs, { type Dayjs } from "dayjs";
import { classes } from "typestyle";
import { useShKitLocale, useShKitPortalTarget } from "../../provider";
import { type InputSize } from "../Input";
import { TimePicker } from "../TimePicker/TimePicker";
import {
  addMonths,
  capitalize,
  formatDisplayValue,
  getCalendarDays,
  getCalendarRect,
  getYearRange,
  isDateDisabled,
  startOfMonth,
  toDateValue,
  type CalendarRect
} from "./calendarUtils";
import { dateInputStyles } from "./dateInputStyles";

type CalendarView = "days" | "months" | "years";
export type DateInputPopupAlign = "start" | "center" | "end";

export type DateInputPreset = {
  label: ReactNode;
  value: string;
};

export type DateRangeInputPreset = {
  label: ReactNode;
  value: DateRangeValue;
};

export type DateInputProps = {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  name?: string;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  disabledDate?: (date: string) => boolean;
  presets?: DateInputPreset[];
  iconOnly?: boolean;
  showTime?: boolean;
  minuteStep?: number;
  align?: DateInputPopupAlign;
  open?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  footer?: ReactNode;
  closeOnSelect?: boolean;
};

export const DateInput = ({
  label,
  error,
  hint,
  value,
  defaultValue = "",
  min,
  max,
  name,
  disabled,
  size = "md",
  className,
  disabledDate,
  presets = [],
  iconOnly = false,
  showTime = false,
  minuteStep = 1,
  align = "start",
  open,
  onChange,
  onOpenChange,
  footer,
  closeOnSelect = true
}: DateInputProps) => {
  const { locale, messages } = useShKitLocale();
  const portalTarget = useShKitPortalTarget();
  const hasError = Boolean(error);
  const isControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const currentValue = isControlled ? value : internalValue;
  const currentOpen = isOpenControlled ? open : internalOpen;
  const selectedDate = parsePickerValue(currentValue);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate?.toDate() ?? new Date()));
  const [focusedValue, setFocusedValue] = useState(() => formatDateValue(selectedDate ?? dayjs()));
  const [timeValue, setTimeValue] = useState(() => formatTimeValue(selectedDate));
  const triggerRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarRect, setCalendarRect] = useState<CalendarRect | null>(null);
  const monthNameFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: "short" }), [locale]);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  const setOpenState = (nextOpen: boolean) => {
    if (!isOpenControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!currentOpen) return;
    const nextFocus = selectedDate ?? dayjs();
    setVisibleMonth(startOfMonth(nextFocus.toDate()));
    setFocusedValue(formatDateValue(nextFocus));
    setTimeValue(formatTimeValue(selectedDate));
  }, [currentOpen, currentValue]);

  useEffect(() => {
    if (!currentOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !calendarRef.current?.contains(target)) {
        setOpenState(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [currentOpen]);

  useEffect(() => {
    if (!currentOpen) return undefined;

    const updateCalendarRect = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCalendarRect(getCalendarRect(rect));
    };

    updateCalendarRect();
    window.addEventListener("resize", updateCalendarRect);
    window.addEventListener("scroll", updateCalendarRect, true);
    return () => {
      window.removeEventListener("resize", updateCalendarRect);
      window.removeEventListener("scroll", updateCalendarRect, true);
    };
  }, [currentOpen]);

  const isDisabledValue = (dateValue: string) => isDateDisabled(dateValue, min, max) || Boolean(disabledDate?.(dateValue));

  const commitValue = (dateValue: string, nextTime = timeValue) => {
    if (isDisabledValue(dateValue)) return;

    const nextValue = showTime ? `${dateValue}T${nextTime || "00:00"}` : dateValue;
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
    if (closeOnSelect) {
      setOpenState(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const moveFocusedDate = (days: number) => {
    const next = dayjs(focusedValue).add(days, "day");
    const nextValue = formatDateValue(next);
    setFocusedValue(nextValue);
    setVisibleMonth(startOfMonth(next.toDate()));
  };

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentOpen && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpenState(true);
      return;
    }

    if (!currentOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpenState(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      commitValue(focusedValue);
      return;
    }

    const keyMove: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -30,
      PageDown: 30
    };
    const move = keyMove[event.key];
    if (move) {
      event.preventDefault();
      moveFocusedDate(move);
    }
  };

  const updateTimeValue = (nextTime: string) => {
    setTimeValue(nextTime);
    if (currentValue) {
      const dateValue = formatDateValue(parsePickerValue(currentValue));
      if (dateValue) {
        const nextValue = `${dateValue}T${nextTime || "00:00"}`;
        if (!isControlled) setInternalValue(nextValue);
        onChange?.(nextValue);
      }
    }
  };

  return (
    <label className={classes(dateInputStyles.root, disabled && dateInputStyles.disabled, className)}>
      {label && !iconOnly && <span className={classes(dateInputStyles.label, hasError && dateInputStyles.errorText)}>{label}</span>}
      <span className={classes(dateInputStyles.control(size), iconOnly && dateInputStyles.iconOnly, hasError && dateInputStyles.invalid, currentOpen && dateInputStyles.open)}>
        <input
          ref={triggerRef}
          name={name}
          disabled={disabled}
          readOnly
          value={currentValue}
          aria-haspopup="dialog"
          aria-expanded={currentOpen}
          aria-label={typeof label === "string" ? label : messages.dateInput.placeholder}
          onClick={() => setOpenState(true)}
          onKeyDown={handleKeyboard}
        />
        {!iconOnly && (
          <span className={dateInputStyles.displayValue(currentValue)} aria-hidden="true">
            {formatAdvancedDisplayValue(currentValue, locale) || messages.dateInput.placeholder}
          </span>
        )}
        <span className={dateInputStyles.calendarIcon} aria-hidden="true" />
      </span>

      {currentOpen &&
        calendarRect &&
        createPortal(
          <div
            ref={calendarRef}
            data-shkit-portal
            className={classes(dateInputStyles.calendar, presets.length > 0 && dateInputStyles.calendarWithPresets)}
            onPointerDown={event => event.stopPropagation()}
            role="dialog"
            style={getAdvancedCalendarStyle(calendarRect, presets.length > 0 ? 420 : calendarRect.width, align)}
          >
            {presets.length > 0 && (
              <div className={dateInputStyles.presets}>
                {presets.map(preset => (
                  <button key={String(preset.label)} type="button" onClick={() => commitValue(formatDateValue(parsePickerValue(preset.value) ?? dayjs()))}>
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            <div className={dateInputStyles.calendarPanel}>
              <AdvancedCalendar
                calendarDays={calendarDays}
                currentValue={formatDateValue(selectedDate)}
                focusedValue={focusedValue}
                locale={locale}
                messages={messages}
                monthNameFormatter={monthNameFormatter}
                visibleMonth={visibleMonth}
                isDateDisabled={isDisabledValue}
                onMoveMonth={months => setVisibleMonth(addMonths(visibleMonth, months))}
                onSelect={commitValue}
                onFocusDay={setFocusedValue}
              />
              {footer}
              {showTime && (
                <TimePicker value={timeValue} minuteStep={minuteStep} onChange={updateTimeValue} withDivider />
              )}
            </div>
          </div>,
          portalTarget ?? document.body
        )}

      {(error || hint) && <span className={classes(dateInputStyles.caption, hasError && dateInputStyles.error)}>{error || hint}</span>}
    </label>
  );
}


export type DateRangeValue = {
  from: string;
  to: string;
};

export type DateRangeInputProps = {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  min?: string;
  max?: string;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  disabledDate?: (date: string) => boolean;
  presets?: DateRangeInputPreset[];
  align?: DateInputPopupAlign;
  open?: boolean;
  onChange?: (value: DateRangeValue) => void;
  onOpenChange?: (open: boolean) => void;
};

export const DateRangeInput = ({
  label,
  error,
  hint,
  value,
  defaultValue = { from: "", to: "" },
  min,
  max,
  disabled,
  size = "md",
  className,
  disabledDate,
  presets = [],
  align = "start",
  open,
  onChange,
  onOpenChange
}: DateRangeInputProps) => {
  const { locale, messages } = useShKitLocale();
  const portalTarget = useShKitPortalTarget();
  const hasError = Boolean(error);
  const isControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const currentValue = isControlled ? value : internalValue;
  const currentOpen = isOpenControlled ? open : internalOpen;
  const fromDate = parsePickerValue(currentValue.from);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(fromDate?.toDate() ?? new Date()));
  const [focusedValue, setFocusedValue] = useState(() => formatDateValue(fromDate ?? dayjs()));
  const [selectingEnd, setSelectingEnd] = useState(false);
  const triggerRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarRect, setCalendarRect] = useState<CalendarRect | null>(null);
  const monthNameFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { month: "short" }), [locale]);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  const setOpenState = (nextOpen: boolean) => {
    if (!isOpenControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!currentOpen) return;
    const nextFocus = fromDate ?? dayjs();
    setVisibleMonth(startOfMonth(nextFocus.toDate()));
    setFocusedValue(formatDateValue(nextFocus));
    setSelectingEnd(Boolean(currentValue.from && !currentValue.to));
  }, [currentOpen, currentValue.from, currentValue.to]);

  useEffect(() => {
    if (!currentOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !calendarRef.current?.contains(target)) {
        setOpenState(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [currentOpen]);

  useEffect(() => {
    if (!currentOpen) return undefined;

    const updateCalendarRect = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCalendarRect(getCalendarRect(rect));
    };

    updateCalendarRect();
    window.addEventListener("resize", updateCalendarRect);
    window.addEventListener("scroll", updateCalendarRect, true);
    return () => {
      window.removeEventListener("resize", updateCalendarRect);
      window.removeEventListener("scroll", updateCalendarRect, true);
    };
  }, [currentOpen]);

  const isDisabledValue = (dateValue: string) => isDateDisabled(dateValue, min, max) || Boolean(disabledDate?.(dateValue));

  const setNextRange = (nextValue: DateRangeValue, close = false) => {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
    if (close) {
      setOpenState(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectRangeDate = (dateValue: string) => {
    if (isDisabledValue(dateValue)) return;

    if (!selectingEnd || !currentValue.from || currentValue.to) {
      setNextRange({ from: dateValue, to: "" });
      setSelectingEnd(true);
      return;
    }

    const from = dayjs(currentValue.from);
    const to = dayjs(dateValue);
    const nextValue = to.isBefore(from, "day")
      ? { from: dateValue, to: currentValue.from }
      : { from: currentValue.from, to: dateValue };
    setNextRange(nextValue, true);
    setSelectingEnd(false);
  };

  const moveFocusedDate = (days: number) => {
    const next = dayjs(focusedValue).add(days, "day");
    const nextValue = formatDateValue(next);
    setFocusedValue(nextValue);
    setVisibleMonth(startOfMonth(next.toDate()));
  };

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!currentOpen && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpenState(true);
      return;
    }

    if (!currentOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setOpenState(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectRangeDate(focusedValue);
      return;
    }

    const keyMove: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -30,
      PageDown: 30
    };
    const move = keyMove[event.key];
    if (move) {
      event.preventDefault();
      moveFocusedDate(move);
    }
  };

  const displayValue = currentValue.from || currentValue.to
    ? `${formatDisplayValue(currentValue.from, locale) || "…"} - ${formatDisplayValue(currentValue.to, locale) || "…"}`
    : "";

  return (
    <label className={classes(dateInputStyles.root, disabled && dateInputStyles.disabled, className)}>
      {label && <span className={classes(dateInputStyles.label, hasError && dateInputStyles.errorText)}>{label}</span>}
      <span className={classes(dateInputStyles.control(size), hasError && dateInputStyles.invalid, currentOpen && dateInputStyles.open)}>
        <input
          ref={triggerRef}
          disabled={disabled}
          readOnly
          value={`${currentValue.from}:${currentValue.to}`}
          aria-haspopup="dialog"
          aria-expanded={currentOpen}
          aria-label={typeof label === "string" ? label : messages.dateInput.placeholder}
          onClick={() => setOpenState(true)}
          onKeyDown={handleKeyboard}
        />
        <span className={dateInputStyles.displayValue(displayValue)} aria-hidden="true">
          {displayValue || messages.dateInput.placeholder}
        </span>
        <span className={dateInputStyles.calendarIcon} aria-hidden="true" />
      </span>

      {currentOpen &&
        calendarRect &&
        createPortal(
          <div
            ref={calendarRef}
            data-shkit-portal
            className={classes(dateInputStyles.calendar, presets.length > 0 && dateInputStyles.calendarWithPresets)}
            onPointerDown={event => event.stopPropagation()}
            role="dialog"
            style={getAdvancedCalendarStyle(calendarRect, presets.length > 0 ? 440 : calendarRect.width, align)}
          >
            {presets.length > 0 && (
              <div className={dateInputStyles.presets}>
                {presets.map(preset => (
                  <button
                    key={String(preset.label)}
                    type="button"
                    onClick={() => {
                      setNextRange(preset.value, true);
                      setSelectingEnd(false);
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
            <div className={dateInputStyles.calendarPanel}>
              <AdvancedCalendar
                calendarDays={calendarDays}
                currentValue={currentValue.to || currentValue.from}
                focusedValue={focusedValue}
                fromValue={currentValue.from}
                locale={locale}
                messages={messages}
                monthNameFormatter={monthNameFormatter}
                toValue={currentValue.to}
                visibleMonth={visibleMonth}
                isDateDisabled={isDisabledValue}
                onMoveMonth={months => setVisibleMonth(addMonths(visibleMonth, months))}
                onSelect={selectRangeDate}
                onFocusDay={setFocusedValue}
              />
            </div>
          </div>,
          portalTarget ?? document.body
        )}

      {(error || hint) && <span className={classes(dateInputStyles.caption, hasError && dateInputStyles.error)}>{error || hint}</span>}
    </label>
  );
}

type AdvancedCalendarProps = {
  calendarDays: Date[];
  currentValue?: string;
  focusedValue: string;
  fromValue?: string;
  locale: string;
  messages: ReturnType<typeof useShKitLocale>["messages"];
  monthNameFormatter: Intl.DateTimeFormat;
  toValue?: string;
  visibleMonth: Date;
  isDateDisabled: (value: string) => boolean;
  onFocusDay: (value: string) => void;
  onMoveMonth: (months: number) => void;
  onSelect: (value: string) => void;
};

const AdvancedCalendar = ({
  calendarDays,
  currentValue,
  focusedValue,
  fromValue,
  locale: _locale,
  messages,
  monthNameFormatter,
  toValue,
  visibleMonth,
  isDateDisabled,
  onFocusDay,
  onMoveMonth,
  onSelect
}: AdvancedCalendarProps) => {
  const [calendarView, setCalendarView] = useState<CalendarView>("days");
  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, month) => capitalize(monthNameFormatter.format(new Date(visibleMonth.getFullYear(), month, 1)))),
    [monthNameFormatter, visibleMonth]
  );
  const yearRange = useMemo(() => getYearRange(visibleMonth.getFullYear()), [visibleMonth]);
  const moveVisiblePeriod = (direction: -1 | 1) => {
    if (calendarView === "years") {
      onMoveMonth(direction * 12 * 12);
      return;
    }

    if (calendarView === "months") {
      onMoveMonth(direction * 12);
      return;
    }

    onMoveMonth(direction);
  };
  const selectMonth = (month: number) => {
    onMoveMonth(month - visibleMonth.getMonth());
    setCalendarView("days");
  };
  const selectYear = (year: number) => {
    onMoveMonth((year - visibleMonth.getFullYear()) * 12);
    setCalendarView("months");
  };

  return (
    <>
      <div className={dateInputStyles.calendarHeader}>
        <button
          type="button"
          onClick={() => moveVisiblePeriod(-1)}
          aria-label={calendarView === "years" ? messages.dateInput.previousYears : calendarView === "months" ? messages.dateInput.previousYear : messages.dateInput.previousMonth}
        >
          ‹
        </button>
        <span className={dateInputStyles.headerTitle}>
          {calendarView === "years" ? (
            <strong>
              {yearRange[0]}-{yearRange[yearRange.length - 1]}
            </strong>
          ) : (
            <>
              <button
                type="button"
                className={dateInputStyles.headerTitleButton}
                onClick={() => setCalendarView("months")}
                aria-label={messages.dateInput.chooseMonth}
              >
                {capitalize(monthNameFormatter.format(visibleMonth))}
              </button>
              <button
                type="button"
                className={dateInputStyles.headerTitleButton}
                onClick={() => setCalendarView("years")}
                aria-label={messages.dateInput.chooseYear}
              >
                {visibleMonth.getFullYear()}
              </button>
            </>
          )}
        </span>
        <button
          type="button"
          onClick={() => moveVisiblePeriod(1)}
          aria-label={calendarView === "years" ? messages.dateInput.nextYears : calendarView === "months" ? messages.dateInput.nextYear : messages.dateInput.nextMonth}
        >
          ›
        </button>
      </div>
      {calendarView === "days" && (
        <>
          <div className={dateInputStyles.weekdays}>
            {messages.dateInput.weekdays.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className={dateInputStyles.days}>
            {calendarDays.map(day => {
              const dayValue = toDateValue(day);
              const inMonth = day.getMonth() === visibleMonth.getMonth();
              const selected = dayValue === currentValue || dayValue === fromValue || dayValue === toValue;
              const focused = dayValue === focusedValue;
              const today = dayValue === toDateValue(new Date());
              const disabledDay = isDateDisabled(dayValue);
              const inRange = Boolean(fromValue && toValue && dayjs(dayValue).isAfter(fromValue, "day") && dayjs(dayValue).isBefore(toValue, "day"));

              return (
                <button
                  key={dayValue}
                  type="button"
                  disabled={disabledDay}
                  className={classes(
                    dateInputStyles.day,
                    !inMonth && dateInputStyles.dayMuted,
                    today && dateInputStyles.dayToday,
                    inRange && dateInputStyles.dayInRange,
                    focused && dateInputStyles.dayFocused,
                    selected && dateInputStyles.daySelected
                  )}
                  onClick={() => onSelect(dayValue)}
                  onFocus={() => onFocusDay(dayValue)}
                  onMouseEnter={() => onFocusDay(dayValue)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}
      {calendarView === "months" && (
        <div className={dateInputStyles.pickerGrid}>
          {monthNames.map((month, monthIndex) => (
            <button
              key={month}
              type="button"
              className={classes(dateInputStyles.pickerButton, monthIndex === visibleMonth.getMonth() && dateInputStyles.pickerSelected)}
              onClick={() => selectMonth(monthIndex)}
            >
              {month}
            </button>
          ))}
        </div>
      )}
      {calendarView === "years" && (
        <div className={dateInputStyles.pickerGrid}>
          {yearRange.map(year => (
            <button
              key={year}
              type="button"
              className={classes(dateInputStyles.pickerButton, year === visibleMonth.getFullYear() && dateInputStyles.pickerSelected)}
              onClick={() => selectYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

const parsePickerValue = (value?: string) => {
  if (!value) return null;
  const date = dayjs(value);
  return date.isValid() ? date : null;
}

const formatDateValue = (date?: Dayjs | null) => {
  return date?.isValid() ? date.format("YYYY-MM-DD") : "";
}

const formatTimeValue = (date?: Dayjs | null) => {
  return date?.isValid() ? date.format("HH:mm") : "00:00";
}

const formatAdvancedDisplayValue = (value: string | undefined, locale: string) => {
  const date = parsePickerValue(value);
  if (!date) return value ?? "";
  const hasTime = Boolean(value?.includes("T"));
  return new Intl.DateTimeFormat(locale, hasTime ? { dateStyle: "short", timeStyle: "short" } : undefined).format(date.toDate());
}

const getAdvancedCalendarStyle = (rect: CalendarRect, preferredWidth: number, align: DateInputPopupAlign) => {
  const viewportPadding = 12;
  const width = Math.min(preferredWidth, window.innerWidth - viewportPadding * 2);
  const alignedLeft = align === "end"
    ? rect.anchorLeft + rect.anchorWidth - width
    : align === "center"
    ? rect.anchorLeft + (rect.anchorWidth - width) / 2
    : rect.left;

  return {
    left: Math.min(Math.max(viewportPadding, alignedLeft), window.innerWidth - width - viewportPadding),
    maxHeight: rect.maxHeight,
    top: rect.top,
    width
  };
}
