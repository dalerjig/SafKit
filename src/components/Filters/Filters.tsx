import { classes, style } from "typestyle";
import { Button } from "../Button";
import { CloseButton } from "../CloseButton";
import { DateInput, DateRangeInput } from "../DateInput";
import { Input, NumberInput } from "../Input";
import { Select } from "../Select";
import { useShKitLocale } from "../../provider";
import { color, radius, scrollbar, space } from "../../tokens";
import {
  createDefaultFilterRule,
  getDefaultFilterOperator,
  getDefaultFilterValue,
  getFilterOperatorOptions,
  isDateRangeValue,
  isEmptyFilterValue,
  isUnaryFilterOperator
} from "./filtering";
import type { FilterCondition, FilterField, FilterRule, FilterValue } from "./types";
import type { ShKitMessages } from "../../i18n";
import { FilterOperator } from "./types";

type FilterMessages = ShKitMessages["table"];

export type FiltersVariant = "dropdown" | "inline";

export type FiltersProps = {
  fields: FilterField[];
  rules: FilterRule[];
  onRulesChange: (rules: FilterRule[]) => void;
  className?: string;
  compact?: boolean;
  /** dropdown — панель для popover (тень, фикс. ширина). inline — в форме/модалке без тени. */
  variant?: FiltersVariant;
};

export const Filters = ({
  fields,
  rules,
  onRulesChange,
  className,
  compact = false,
  variant = "dropdown"
}: FiltersProps) => {
  const updateRules = (updater: (rules: FilterRule[]) => FilterRule[]) => onRulesChange(updater(rules));
  const addRule = () => onRulesChange([...rules, createDefaultFilterRule(fields, rules.length)]);
  const clearRules = () => onRulesChange([]);

  return (
    <FilterPanel
      className={className}
      compact={compact}
      variant={variant}
      fields={fields}
      rules={rules}
      onAddRule={addRule}
      onChangeRules={updateRules}
      onClear={clearRules}
    />
  );
};

export type FilterPanelProps = {
  fields: FilterField[];
  rules: FilterRule[];
  onAddRule: () => void;
  onChangeRules: (updater: (rules: FilterRule[]) => FilterRule[]) => void;
  onClear: () => void;
  className?: string;
  compact?: boolean;
  variant?: FiltersVariant;
};

export const FilterPanel = ({
  fields,
  rules,
  onAddRule,
  onChangeRules,
  onClear,
  className,
  compact = false,
  variant = "dropdown"
}: FilterPanelProps) => {
  const { messages } = useShKitLocale();
  const filterMessages = messages.table;
  const fieldOptions = fields.map(field => ({ label: field.label, value: field.key }));
  const activeRuleCount = rules.filter(
    rule => !isEmptyFilterValue(rule.value) || isUnaryFilterOperator(rule.operator)
  ).length;

  return (
    <div
      className={classes(
        filterStyles.filtersRoot,
        variant === "inline" ? filterStyles.filtersInline : filterStyles.filtersDropdown,
        className
      )}
    >
      <div className={filterStyles.filtersHeader}>
        <span>
          <strong>{filterMessages.filters}</strong>
          <small>{activeRuleCount > 0 ? filterMessages.activeFilters(activeRuleCount) : filterMessages.filter.noActiveRules}</small>
        </span>
        <Button type="button" size="sm" variant="secondary" onClick={onAddRule}>{filterMessages.filter.addRule}</Button>
      </div>

      {rules.length === 0 && (
        <button
          type="button"
          className={filterStyles.filtersEmpty}
          onClick={onAddRule}
          aria-label={filterMessages.filter.addRule}
        >
          {filterMessages.filter.empty}
        </button>
      )}

      {rules.map((rule, index) => {
        const field = fields.find(item => item.key === rule.fieldKey) ?? fields[0];
        if (!field) return null;

        return (
          <div key={rule.id} className={filterStyles.filterCard}>
            <div className={filterStyles.filterCardHeader}>
              <div className={filterStyles.ruleTitle}>
                <span>{filterMessages.filter.rule(index + 1)}</span>
                {index > 0 && (
                  <Select
                    size="sm"
                    value={rule.condition}
                    options={[
                      { label: filterMessages.filterSummaryPrefix.and, value: "and" },
                      { label: filterMessages.filterSummaryPrefix.or, value: "or" }
                    ]}
                    onValueChange={condition => {
                      onChangeRules(previous =>
                        previous.map(item => (item.id === rule.id ? { ...item, condition: condition as FilterCondition } : item))
                      );
                    }}
                  />
                )}
              </div>
              <CloseButton
                type="button"
                label={filterMessages.filter.clear}
                onClick={() => onChangeRules(previous => previous.filter(item => item.id !== rule.id))}
              />
            </div>

            <div className={filterStyles.filterRule(compact)}>
              <label className={filterStyles.field}>
                <span>{filterMessages.filter.column}</span>
                <Select
                  searchable
                  size="sm"
                  value={rule.fieldKey}
                  options={fieldOptions}
                  onValueChange={fieldKey => {
                    const nextField = fields.find(item => item.key === fieldKey) ?? field;
                    onChangeRules(previous =>
                      previous.map(item =>
                        item.id === rule.id
                          ? {
                              ...item,
                              fieldKey,
                              operator: getDefaultFilterOperator(nextField),
                              value: getDefaultFilterValue(nextField)
                            }
                          : item
                      )
                    );
                  }}
                />
              </label>
              <label className={filterStyles.field}>
                <span>{filterMessages.filter.operator}</span>
                <Select
                  size="sm"
                  value={rule.operator}
                  options={getFilterOperatorOptions(field, filterMessages.filterOperators)}
                  onValueChange={operator => {
                    onChangeRules(previous =>
                      previous.map(item => (item.id === rule.id ? { ...item, operator: operator as FilterOperator } : item))
                    );
                  }}
                />
              </label>
              <label className={classes(filterStyles.field, compact && filterStyles.valueFieldRow)}>
                <span>{filterMessages.filter.value}</span>
                <FilterValueControl
                  field={field}
                  rule={rule}
                  messages={filterMessages}
                  onChange={value => {
                    onChangeRules(previous => previous.map(item => (item.id === rule.id ? { ...item, value } : item)));
                  }}
                />
              </label>
            </div>
          </div>
        );
      })}

      <div className={filterStyles.filterActions}>
        <Button type="button" size="sm" variant="secondary" onClick={onClear}>{filterMessages.filter.clear}</Button>
      </div>
    </div>
  );
};

const FilterValueControl = ({
  field,
  rule,
  messages,
  onChange
}: {
  field: FilterField;
  rule: FilterRule;
  messages: FilterMessages;
  onChange: (value: FilterValue) => void;
}) => {
  if (isUnaryFilterOperator(rule.operator)) {
    return <div className={filterStyles.filterValuePlaceholder}>{messages.filter.noValue}</div>;
  }

  if (field.type === "select") {
    const isMultiple =
      rule.operator === FilterOperator.StringIsAnyOf || rule.operator === FilterOperator.StringIsNoneOf;

    return (
      <Select
        multiple={isMultiple}
        searchable
        size="sm"
        value={!isMultiple && typeof rule.value === "string" ? rule.value : undefined}
        values={isMultiple && Array.isArray(rule.value) ? rule.value.map(String) : []}
        options={field.options ?? []}
        onValueChange={value => onChange(value)}
        onValuesChange={values => onChange(values)}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <Select
        size="sm"
        value={typeof rule.value === "boolean" ? String(rule.value) : ""}
        placeholder={messages.filter.any}
        options={[
          { label: messages.filter.booleanTrue, value: "true" },
          { label: messages.filter.booleanFalse, value: "false" }
        ]}
        onValueChange={nextValue => onChange(nextValue === "true")}
      />
    );
  }

  if (field.type === "number") {
    return <NumberInput size="sm" value={typeof rule.value === "number" ? rule.value : ""} onChange={onChange} />;
  }

  if (field.type === "date") {
    if (rule.operator !== FilterOperator.DateBetween) {
      return (
        <DateInput
          size="sm"
          value={typeof rule.value === "string" ? rule.value : ""}
          onChange={onChange}
        />
      );
    }

    return (
      <DateRangeInput
        size="sm"
        value={isDateRangeValue(rule.value) ? rule.value : { from: "", to: "" }}
        onChange={onChange}
      />
    );
  }

  return (
    <Input
      size="sm"
      value={typeof rule.value === "string" ? rule.value : ""}
      onChange={event => onChange(event.currentTarget.value)}
    />
  );
};

const filterStyles = {
  filtersRoot: style({
    boxSizing: "border-box",
    display: "grid",
    gap: space[10],
    minWidth: 0,
    overflow: "auto",
    $nest: scrollbar
  }),
  filtersDropdown: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 14px 34px rgba(25, 25, 25, 0.16)",
    padding: space[12],
    width: "min(720px, calc(100vw - 24px))"
  }),
  filtersInline: style({
    background: "transparent",
    border: 0,
    boxShadow: "none",
    padding: 0,
    width: "100%"
  }),
  filtersHeader: style({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 16
      },
      "& small": {
        color: color.textSubtle,
        display: "block",
        fontSize: 12,
        fontWeight: 800,
        marginTop: 2
      }
    }
  }),
  filtersEmpty: style({
    background: color.surfaceMuted,
    border: `1px dashed ${color.border}`,
    borderRadius: radius.sm,
    color: color.textSubtle,
    cursor: "pointer",
    font: "inherit",
    fontSize: 13,
    fontWeight: 800,
    padding: space[12],
    textAlign: "center",
    transition: "background 0.12s ease, color 0.12s ease, border-color 0.12s ease",
    width: "100%",
    $nest: {
      "&:hover": {
        background: color.surfaceSecondary,
        borderColor: color.primary,
        color: color.primary
      },
      "&:focus-visible": {
        outline: `2px solid ${color.primary}`,
        outlineOffset: 2
      }
    }
  }),
  filterCard: style({
    background: color.surfaceMuted,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    display: "grid",
    gap: space[8],
    padding: space[10]
  }),
  filterCardHeader: style({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
  }),
  ruleTitle: style({
    alignItems: "center",
    color: color.primary,
    display: "flex",
    fontSize: 13,
    fontWeight: 900,
    gap: space[8]
  }),
  filterRule: (compact: boolean) =>
    style({
      alignItems: "end",
      display: "grid",
      gap: space[8],
      gridTemplateColumns: compact
        ? "minmax(150px, 1.2fr) minmax(130px, 0.85fr)"
        : "minmax(150px, 1.2fr) minmax(130px, 0.85fr) minmax(170px, 1.2fr)"
    }),
  valueFieldRow: style({
    gridColumn: "1 / -1"
  }),
  field: style({
    display: "grid",
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& > span": {
        color: color.textSubtle,
        fontSize: 11,
        fontWeight: 900,
        textTransform: "uppercase"
      }
    }
  }),
  filterValuePlaceholder: style({
    alignItems: "center",
    background: color.surfaceMuted,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    color: color.textSubtle,
    display: "flex",
    fontSize: 13,
    fontWeight: 800,
    minHeight: 32,
    padding: `0 ${space[10]}px`
  }),
  filterActions: style({
    display: "flex",
    justifyContent: "flex-end"
  })
};
