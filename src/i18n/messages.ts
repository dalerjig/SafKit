import type { ShKitLocale, ShKitMessages } from "./types";

export const messages: Record<ShKitLocale, ShKitMessages> = {
  ru: {
    popconfirm: {
      confirm: "Подтвердить",
      cancel: "Отмена"
    },
    table: {
      columns: "Столбцы",
      emptyText: "Нет данных",
      exportAllCsv: "Экспорт всей таблицы в CSV",
      exportAllXlsx: "Экспорт всей таблицы в XLSX",
      exportFilteredCsv: "Экспорт отфильтрованных строк в CSV",
      exportFilteredXlsx: "Экспорт отфильтрованных строк в XLSX",
      exportTable: "Экспорт",
      filters: "Фильтры",
      loading: "Загрузка...",
      pinColumn: "Закрепить",
      notDefined: "Не задано",
      resetState: "Сбросить состояние",
      rows: "строк",
      visibleRows: "видимых",
      activeFilters: count => `${count} активно`,
      filterSummaryPrefix: {
        and: "И",
        or: "ИЛИ"
      },
      filter: {
        addRule: "+ Условие",
        any: "Любое",
        booleanFalse: "Нет",
        booleanTrue: "Да",
        clear: "Сбросить фильтры",
        column: "Колонка",
        empty: "Добавьте условие фильтрации",
        noActiveRules: "нет активных условий",
        noValue: "Без значения",
        operator: "Оператор",
        rule: index => `Условие ${index}`,
        value: "Значение",
        valuePlaceholder: "Любое"
      },
      filterOperators: {
        contains: "содержит",
        dateAfter: "после",
        dateBefore: "до",
        dateBetween: "между",
        dateEq: "=",
        dateNotEq: "!=",
        dateNotEmpty: "не пусто",
        dateOnOrAfter: "не раньше",
        dateOnOrBefore: "не позднее",
        empty: "пусто",
        eq: "=",
        gt: ">",
        gte: ">=",
        isAnyOf: "любой из",
        isNoneOf: "ни один из",
        lt: "<",
        lte: "<=",
        nEq: "!=",
        notContains: "не содержит",
        notEmpty: "не пусто"
      }
    },
    actions: {
      copy: "Копировать"
    },
    dateInput: {
      chooseMonth: "Выбрать месяц",
      chooseYear: "Выбрать год",
      nextMonth: "Следующий месяц",
      nextYears: "Следующие годы",
      nextYear: "Следующий год",
      placeholder: "Выберите дату",
      previousMonth: "Предыдущий месяц",
      previousYears: "Предыдущие годы",
      previousYear: "Предыдущий год",
      rangeFrom: "C",
      rangeTo: "По",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    },
    timePicker: {
      label: "Время"
    }
  },
  en: {
    popconfirm: {
      confirm: "OK",
      cancel: "Cancel"
    },
    table: {
      columns: "Columns",
      emptyText: "No data",
      exportAllCsv: "Export whole table to CSV",
      exportAllXlsx: "Export whole table to XLSX",
      exportFilteredCsv: "Export filtered rows to CSV",
      exportFilteredXlsx: "Export filtered rows to XLSX",
      exportTable: "Export",
      filters: "Filters",
      loading: "Loading...",
      pinColumn: "Pin column",
      notDefined: "Not set",
      resetState: "Reset state",
      rows: "rows",
      visibleRows: "visible",
      activeFilters: count => `${count} active`,
      filterSummaryPrefix: {
        and: "AND",
        or: "OR"
      },
      filter: {
        addRule: "+ Rule",
        any: "Any",
        booleanFalse: "No",
        booleanTrue: "Yes",
        clear: "Clear filters",
        column: "Column",
        empty: "Add a filter rule",
        noActiveRules: "no active rules",
        noValue: "No value",
        operator: "Operator",
        rule: index => `Rule ${index}`,
        value: "Value",
        valuePlaceholder: "Any"
      },
      filterOperators: {
        contains: "contains",
        dateAfter: "after",
        dateBefore: "before",
        dateBetween: "between",
        dateEq: "=",
        dateNotEq: "!=",
        dateNotEmpty: "not empty",
        dateOnOrAfter: "on or after",
        dateOnOrBefore: "on or before",
        empty: "empty",
        eq: "=",
        gt: ">",
        gte: ">=",
        isAnyOf: "any of",
        isNoneOf: "none of",
        lt: "<",
        lte: "<=",
        nEq: "!=",
        notContains: "does not contain",
        notEmpty: "not empty"
      }
    },
    actions: {
      copy: "Copy"
    },
    dateInput: {
      chooseMonth: "Choose month",
      chooseYear: "Choose year",
      nextMonth: "Next month",
      nextYears: "Next years",
      nextYear: "Next year",
      placeholder: "Select date",
      previousMonth: "Previous month",
      previousYears: "Previous years",
      previousYear: "Previous year",
      rangeFrom: "From",
      rangeTo: "To",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    timePicker: {
      label: "Time"
    }
  },
  zh: {
    popconfirm: {
      confirm: "确认",
      cancel: "取消"
    },
    table: {
      columns: "列",
      emptyText: "暂无数据",
      exportAllCsv: "导出整张表为 CSV",
      exportAllXlsx: "导出整张表为 XLSX",
      exportFilteredCsv: "导出筛选行到 CSV",
      exportFilteredXlsx: "导出筛选行到 XLSX",
      exportTable: "导出",
      filters: "筛选",
      loading: "加载中...",
      pinColumn: "固定列",
      notDefined: "未设置",
      resetState: "重置状态",
      rows: "行",
      visibleRows: "可见",
      activeFilters: count => `${count} 个已启用`,
      filterSummaryPrefix: {
        and: "且",
        or: "或"
      },
      filter: {
        addRule: "+ 条件",
        any: "任意",
        booleanFalse: "否",
        booleanTrue: "是",
        clear: "清除筛选",
        column: "列",
        empty: "添加筛选条件",
        noActiveRules: "没有启用条件",
        noValue: "无需填写",
        operator: "运算符",
        rule: index => `条件 ${index}`,
        value: "值",
        valuePlaceholder: "任意"
      },
      filterOperators: {
        contains: "包含",
        dateAfter: "晚于",
        dateBefore: "早于",
        dateBetween: "介于",
        dateEq: "=",
        dateNotEq: "!=",
        dateNotEmpty: "非空",
        dateOnOrAfter: "不早于",
        dateOnOrBefore: "不晚于",
        empty: "为空",
        eq: "=",
        gt: ">",
        gte: ">=",
        isAnyOf: "任一",
        isNoneOf: "都不是",
        lt: "<",
        lte: "<=",
        nEq: "!=",
        notContains: "不包含",
        notEmpty: "非空"
      }
    },
    actions: {
      copy: "复制"
    },
    dateInput: {
      chooseMonth: "选择月份",
      chooseYear: "选择年份",
      nextMonth: "下个月",
      nextYears: "后几年",
      nextYear: "明年",
      placeholder: "选择日期",
      previousMonth: "上个月",
      previousYears: "前几年",
      previousYear: "去年",
      rangeFrom: "从",
      rangeTo: "至",
      weekdays: ["一", "二", "三", "四", "五", "六", "日"]
    },
    timePicker: {
      label: "时间"
    }
  }
};
