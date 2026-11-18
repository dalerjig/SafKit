import { type ReactNode, useMemo } from "react";
import { classes } from "typestyle";
import { useShKitLocale } from "../../provider";
import { Select, type SelectOption } from "../Select";
import { timePickerStyles } from "./timePickerStyles";

export type TimePickerProps = {
  label?: ReactNode;
  value: string;
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
  withDivider?: boolean;
  onChange: (value: string) => void;
};

const hourOptions: SelectOption[] = Array.from({ length: 24 }, (_, hour) => {
  const option = padTimePart(hour);
  return { label: option, value: option };
});

export const TimePicker = ({
  label,
  value,
  minuteStep = 1,
  disabled,
  className,
  withDivider = false,
  onChange
}: TimePickerProps) => {
  const { messages } = useShKitLocale();
  const [hourValue, minuteValue] = splitTimeValue(value);
  const labelContent = label === undefined ? messages.timePicker.label : label;
  const minuteOptions = useMemo(
    (): SelectOption[] =>
      getMinuteOptions(minuteStep, minuteValue).map(minute => {
        const option = padTimePart(minute);
        return { label: option, value: option };
      }),
    [minuteStep, minuteValue]
  );

  return (
    <div className={classes(timePickerStyles.root, withDivider && timePickerStyles.withDivider, className)}>
      {labelContent && <span className={timePickerStyles.label}>{labelContent}</span>}
      <div className={timePickerStyles.selects}>
        <Select
          value={hourValue}
          disabled={disabled}
          options={hourOptions}
          placeholder="00"
          size="sm"
          matchTriggerWidth
          popupMaxHeight={300}
          className={timePickerStyles.select}
          onValueChange={nextHour => onChange(`${nextHour}:${minuteValue}`)}
        />
        <span className={timePickerStyles.separator} aria-hidden="true">
          :
        </span>
        <Select
          value={minuteValue}
          disabled={disabled}
          options={minuteOptions}
          placeholder="00"
          size="sm"
          matchTriggerWidth
          popupMaxHeight={300}
          className={timePickerStyles.select}
          onValueChange={nextMinute => onChange(`${hourValue}:${nextMinute}`)}
        />
      </div>
    </div>
  );
};

const getMinuteOptions = (minuteStep: number, currentMinute: string) => {
  const normalizedStep = Number.isFinite(minuteStep) ? Math.max(1, Math.min(60, Math.floor(minuteStep))) : 1;
  const options = Array.from({ length: Math.ceil(60 / normalizedStep) }, (_, index) => index * normalizedStep).filter(minute => minute < 60);
  const currentMinuteNumber = Number(currentMinute);

  if (Number.isInteger(currentMinuteNumber) && currentMinuteNumber >= 0 && currentMinuteNumber < 60 && !options.includes(currentMinuteNumber)) {
    return [...options, currentMinuteNumber].sort((left, right) => left - right);
  }

  return options;
};

const splitTimeValue = (value: string) => {
  const [hour = "00", minute = "00"] = value.split(":");
  return [padTimePart(Number(hour), 23), padTimePart(Number(minute), 59)];
};

function padTimePart(value: number, max = 59) {
  return Number.isInteger(value) && value >= 0 && value <= max ? String(value).padStart(2, "0") : "00";
}
