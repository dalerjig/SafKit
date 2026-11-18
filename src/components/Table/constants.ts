export const tableConfig = {
  minWidth: 100,
  minColumnResizeWidth: 100
} as const;

export const ShTableConfig = {
  MIN_WIDTH: tableConfig.minWidth,
  MIN_COLUMN_RESIZE_WIDTH: tableConfig.minColumnResizeWidth
} as const;
