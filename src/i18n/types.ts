export type ShKitLocale = "ru" | "en" | "zh";

export type ShKitMessages = {
  popconfirm: {
    confirm: string;
    cancel: string;
  };
  table: {
    columns: string;
    emptyText: string;
    exportAllCsv: string;
    exportAllXlsx: string;
    exportFilteredCsv: string;
    exportFilteredXlsx: string;
    exportTable: string;
    filters: string;
    loading: string;
    pinColumn: string;
    notDefined: string;
    resetState: string;
    rows: string;
    visibleRows: string;
    activeFilters: (count: number) => string;
    filterSummaryPrefix: {
      and: string;
      or: string;
    };
    filter: {
      addRule: string;
      any: string;
      booleanFalse: string;
      booleanTrue: string;
      clear: string;
      column: string;
      empty: string;
      noActiveRules: string;
      noValue: string;
      operator: string;
      rule: (index: number) => string;
      value: string;
      valuePlaceholder: string;
    };
    filterOperators: {
      contains: string;
      dateAfter: string;
      dateBefore: string;
      dateBetween: string;
      dateEq: string;
      dateNotEq: string;
      dateNotEmpty: string;
      dateOnOrAfter: string;
      dateOnOrBefore: string;
      empty: string;
      eq: string;
      gt: string;
      gte: string;
      isAnyOf: string;
      isNoneOf: string;
      lt: string;
      lte: string;
      nEq: string;
      notContains: string;
      notEmpty: string;
    };
  };
  actions: {
    copy: string;
  };
  dateInput: {
    chooseMonth: string;
    chooseYear: string;
    nextMonth: string;
    nextYears: string;
    nextYear: string;
    placeholder: string;
    previousMonth: string;
    previousYears: string;
    previousYear: string;
    rangeFrom: string;
    rangeTo: string;
    weekdays: string[];
  };
  timePicker: {
    label: string;
  };
};
