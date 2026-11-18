export type CalendarRect = {
  anchorLeft: number;
  anchorWidth: number;
  left: number;
  maxHeight: number;
  top: number;
  width: number;
};

export const getCalendarRect = (rect: DOMRect): CalendarRect  => {
  const viewportPadding = 12;
  const popupWidth = Math.max(276, Math.min(rect.width, 340));
  const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
  const availableAbove = rect.top - viewportPadding;
  const openAbove = availableBelow < 280 && availableAbove > availableBelow;
  const left = Math.min(Math.max(viewportPadding, rect.left), window.innerWidth - popupWidth - viewportPadding);
  const maxHeight = Math.max(220, Math.min(360, openAbove ? availableAbove : availableBelow));

  return {
    anchorLeft: rect.left,
    anchorWidth: rect.width,
    left,
    maxHeight,
    top: openAbove ? Math.max(viewportPadding, rect.top - maxHeight - 6) : rect.bottom + 6,
    width: popupWidth
  };
}

export const getCalendarDays = (month: Date) => {
  const firstDay = startOfMonth(month);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = addDays(firstDay, -mondayOffset);

  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export const getYearRange = (year: number) => {
  const start = Math.floor(year / 12) * 12;
  return Array.from({ length: 12 }, (_, index) => start + index);
}

export const parseDateValue = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const formatDisplayValue = (value: string | undefined, locale: string) => {
  const date = parseDateValue(value);
  if (!date) return value ?? "";

  return new Intl.DateTimeFormat(locale).format(date);
}

export const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const addMonths = (date: Date, months: number) => {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export const isDateDisabled = (value: string, min?: string, max?: string) => {
  return Boolean((min && value < min) || (max && value > max));
}

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
