import { type ComponentType, type SVGProps } from "react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AppstoreIcon,
  BorderBottomIcon,
  BorderIcon,
  BorderTopIcon,
  BusinessIcon,
  CheckIcon,
  ClearAllIcon,
  ClearIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DashboardIcon,
  DeleteIcon,
  DrawIcon,
  DownloadIcon,
  EditIcon,
  EnvironmentIcon,
  ExpandIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  ExportIcon,
  FieldTimeIcon,
  FileDoneIcon,
  FileIcon,
  FilterIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  FolderActiveIcon,
  FolderEmptyIcon,
  FolderIcon,
  HighlightIcon,
  HomeIcon,
  ImportIcon,
  LineIcon,
  LinkIcon,
  LockIcon,
  MeasureIcon,
  MeasurementAreaIcon,
  MeasurementCounterIcon,
  MeasurementCrossSectionIcon,
  MeasurementCutFillIcon,
  MeasurementCutFillToDesignIcon,
  MeasurementDistanceSlopeIcon,
  MeasurementElevationIcon,
  MeasurementPinCoordinatesIcon,
  MeasurementRemovalsIcon,
  MeasurementStockpilesIcon,
  MenuIcon,
  MinusIcon,
  MenuAnalyticsIcon,
  MenuBimIcon,
  MenuCompareSurfacesIcon,
  MenuExhibitsIcon,
  MenuFilesIcon,
  MenuMarkupsIcon,
  MenuOverlaysIcon,
  MenuPanoramaIcon,
  MenuPlanningIcon,
  MenuPrintIcon,
  MenuRoadAxisIcon,
  MenuScansIcon,
  MenuViewsIcon,
  MenuWiresIcon,
  MoreIcon,
  NotesIcon,
  PinIcon,
  PointIcon,
  PlusIcon,
  ResetIcon,
  RotateLeftIcon,
  RotateRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ZoomResetIcon,
  ScreenIcon,
  ScannerIcon,
  SearchIcon,
  SettingsIcon,
  SliceViewBottomIcon,
  SliceViewTopIcon,
  StopIcon,
  TableIcon,
  TagIcon,
  ToolCaptureIcon,
  ToolDashboardIcon,
  ToolDrawIcon,
  ToolSnipIcon,
  ToolTasksIcon,
  UnpinIcon,
  UploadIcon,
  UserIcon,
  AiOutlineArrowUpIcon,
  AiOutlineBlockIcon,
  AiOutlineBorderIcon,
  AiOutlineFontSizeIcon,
  AiOutlineInsertRowBelowIcon,
  AiOutlineMonitorIcon,
  AiOutlineRollbackIcon,
  BiCollapseVerticalIcon,
  BiExpandVerticalIcon,
  BiIntersectIcon,
  BiNetworkChartIcon,
  BiObjectsHorizontalLeftIcon,
  BiObjectsVerticalBottomIcon,
  BiRenameIcon,
  BiSolidColorIcon,
  BsBorderOuterIcon,
  BsFillFolderSymlinkFillIcon,
  BsReverseListColumnsReverseIcon,
  BsSignIntersectionTIcon,
  ChevronUpIcon,
  CiBoxListIcon,
  DrawRectangleIcon,
  FaChartGanttIcon,
  FaCubesIcon,
  FaRoadIcon,
  FolderPlusIcon,
  GoBlockedIcon,
  GoSidebarExpandIcon,
  GrTableAddIcon,
  ImageIcon,
  ImCrossIcon,
  IoBarChartOutlineIcon,
  IoIosArrowUpIcon,
  IoLayersOutlineIcon,
  IoTimerIcon,
  LineSegmentIcon,
  LuCircleDashedIcon,
  LuTablePropertiesIcon,
  MdCalendarTodayIcon,
  MdCompressIcon,
  MdEditNoteIcon,
  MdMoveToInboxIcon,
  MdOutlineDragIndicatorIcon,
  MdOutlineEditRoadIcon,
  MdOutlineSortByAlphaIcon,
  MdPlaylistRemoveIcon,
  PiCubeFocusFillIcon,
  PiProjectorScreenChartIcon,
  PiProjectorScreenIcon,
  PiRectangleDashedIcon,
  PiSelectionBoldIcon,
  PiSelectionForegroundDuotoneIcon,
  PiSelectionForegroundLightIcon,
  RiCheckboxBlankFillIcon,
  RxTransparencyGridIcon,
  TbBadge3DIcon,
  TbBellIcon,
  TbBoxAlignBottomRightFilledIcon,
  TbChartScatter3DIcon,
  TbHexagon3DIcon,
  TbLayersLinkedIcon,
  TbLayersOffIcon,
  TbLayersSelectedBottomIcon,
  TbLayersSelectedIcon,
  TbMathXyIcon,
  TbRefreshDotIcon,
  TbScanEyeIcon,
  TbSortAscendingShapesIcon,
  TbVectorBezierIcon,
  TfiSaveIcon,
  TuneIcon,
  VscFeedbackIcon,
  VscGraphLineIcon,
  type ShKitIconProps
} from "./icons";
import { MAIN_STROKE } from "./icons/iconStrokes";
import { MediaIcon } from "@/components/Icon/icons/MediaIcon.tsx";

export type IconName =
  | "align-center"
  | "align-left"
  | "align-right"
  | "appstore"
  | "border"
  | "border-bottom"
  | "border-top"
  | "business"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "clear"
  | "clear-all"
  | "close"
  | "copy"
  | "dashboard"
  | "delete"
  | "draw"
  | "download"
  | "edit"
  | "environment"
  | "expand"
  | "eye-closed"
  | "eye-open"
  | "export"
  | "field-time"
  | "file"
  | "file-done"
  | "filter"
  | "fullscreen"
  | "fullscreen-exit"
  | "folder"
  | "folder-active"
  | "folder-empty"
  | "highlight"
  | "home"
  | "import"
  | "line"
  | "link"
  | "lock"
  | "measure"
  | "measurement-area"
  | "measurement-counter"
  | "measurement-cross-section"
  | "measurement-cut-fill"
  | "measurement-cut-fill-to-design"
  | "measurement-distance-slope"
  | "measurement-elevation"
  | "measurement-pin-coordinates"
  | "measurement-removals"
  | "measurement-stockpiles"
    | "media"
  | "menu"
  | "minus"
  | "menu-analytics"
  | "menu-bim"
  | "menu-compare-surfaces"
  | "menu-exhibits"
  | "menu-files"
  | "menu-markups"
  | "menu-overlays"
  | "menu-panorama"
  | "menu-planning"
  | "menu-print"
  | "menu-road-axis"
  | "menu-scans"
  | "menu-views"
  | "menu-wires"
  | "more"
  | "notes"
  | "pin"
  | "point"
  | "plus"
  | "reset"
  | "rotate-left"
  | "rotate-right"
  | "zoom-in"
  | "zoom-out"
  | "zoom-reset"
  | "screen"
  | "scanner"
  | "search"
  | "settings"
  | "slice-view-bottom"
  | "slice-view-top"
  | "stop"
  | "table"
  | "tag"
  | "tool-capture"
  | "tool-dashboard"
  | "tool-draw"
  | "tool-snip"
  | "tool-tasks"
  | "unpin"
  | "upload"
  | "user"
  | "ai-outline-arrow-up"
  | "ai-outline-block"
  | "ai-outline-border"
  | "ai-outline-font-size"
  | "ai-outline-insert-row-below"
  | "ai-outline-monitor"
  | "ai-outline-rollback"
  | "bi-collapse-vertical"
  | "bi-expand-vertical"
  | "bi-intersect"
  | "bi-network-chart"
  | "bi-objects-horizontal-left"
  | "bi-objects-vertical-bottom"
  | "bi-rename"
  | "bi-solid-color"
  | "bs-border-outer"
  | "bs-fill-folder-symlink-fill"
  | "bs-reverse-list-columns-reverse"
  | "bs-sign-intersection-t"
  | "ci-box-list"
  | "fa-chart-gantt"
  | "fa-cubes"
  | "fa-road"
  | "go-blocked"
  | "go-sidebar-expand"
  | "gr-table-add"
  | "im-cross"
  | "io-bar-chart-outline"
  | "io-ios-arrow-up"
  | "io-layers-outline"
  | "io-timer"
  | "lu-circle-dashed"
  | "lu-table-properties"
  | "md-calendar-today"
  | "md-compress"
  | "md-edit-note"
  | "md-move-to-inbox"
  | "md-outline-drag-indicator"
  | "md-outline-edit-road"
  | "md-outline-sort-by-alpha"
  | "md-playlist-remove"
  | "pi-cube-focus-fill"
  | "pi-projector-screen"
  | "pi-projector-screen-chart"
  | "pi-rectangle-dashed"
  | "pi-selection-bold"
  | "pi-selection-foreground-duotone"
  | "pi-selection-foreground-light"
  | "ri-checkbox-blank-fill"
  | "rx-transparency-grid"
  | "tb-badge3-d"
  | "tb-bell"
  | "tb-box-align-bottom-right-filled"
  | "tb-chart-scatter3-d"
  | "tb-hexagon3-d"
  | "tb-layers-linked"
  | "tb-layers-off"
  | "tb-layers-selected"
  | "tb-layers-selected-bottom"
  | "tb-math-xy"
  | "tb-refresh-dot"
  | "tb-scan-eye"
  | "tb-sort-ascending-shapes"
  | "tb-vector-bezier"
  | "tfi-save"
  | "vsc-feedback"
  | "vsc-graph-line"
  | "chevron-up"
  | "draw-rectangle"
  | "folder-plus"
  | "image"
  | "line-segment"
  | "tune";


export type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  title?: string;
};

const icons: Record<IconName, ComponentType<ShKitIconProps>> = {
  "ai-outline-arrow-up": AiOutlineArrowUpIcon,
  "ai-outline-block": AiOutlineBlockIcon,
  "ai-outline-border": AiOutlineBorderIcon,
  "ai-outline-font-size": AiOutlineFontSizeIcon,
  "ai-outline-insert-row-below": AiOutlineInsertRowBelowIcon,
  "ai-outline-monitor": AiOutlineMonitorIcon,
  "ai-outline-rollback": AiOutlineRollbackIcon,
  "bi-collapse-vertical": BiCollapseVerticalIcon,
  "bi-expand-vertical": BiExpandVerticalIcon,
  "bi-intersect": BiIntersectIcon,
  "bi-network-chart": BiNetworkChartIcon,
  "bi-objects-horizontal-left": BiObjectsHorizontalLeftIcon,
  "bi-objects-vertical-bottom": BiObjectsVerticalBottomIcon,
  "bi-rename": BiRenameIcon,
  "bi-solid-color": BiSolidColorIcon,
  "bs-border-outer": BsBorderOuterIcon,
  "bs-fill-folder-symlink-fill": BsFillFolderSymlinkFillIcon,
  "bs-reverse-list-columns-reverse": BsReverseListColumnsReverseIcon,
  "bs-sign-intersection-t": BsSignIntersectionTIcon,
  "ci-box-list": CiBoxListIcon,
  "fa-chart-gantt": FaChartGanttIcon,
  "fa-cubes": FaCubesIcon,
  "fa-road": FaRoadIcon,
  "go-blocked": GoBlockedIcon,
  "go-sidebar-expand": GoSidebarExpandIcon,
  "gr-table-add": GrTableAddIcon,
  "im-cross": ImCrossIcon,
  "io-bar-chart-outline": IoBarChartOutlineIcon,
  "io-ios-arrow-up": IoIosArrowUpIcon,
  "io-layers-outline": IoLayersOutlineIcon,
  "io-timer": IoTimerIcon,
  "lu-circle-dashed": LuCircleDashedIcon,
  "lu-table-properties": LuTablePropertiesIcon,
  "md-calendar-today": MdCalendarTodayIcon,
  "md-compress": MdCompressIcon,
  "md-edit-note": MdEditNoteIcon,
  "md-move-to-inbox": MdMoveToInboxIcon,
  "md-outline-drag-indicator": MdOutlineDragIndicatorIcon,
  "md-outline-edit-road": MdOutlineEditRoadIcon,
  "md-outline-sort-by-alpha": MdOutlineSortByAlphaIcon,
  "md-playlist-remove": MdPlaylistRemoveIcon,
  "pi-cube-focus-fill": PiCubeFocusFillIcon,
  "pi-projector-screen": PiProjectorScreenIcon,
  "pi-projector-screen-chart": PiProjectorScreenChartIcon,
  "pi-rectangle-dashed": PiRectangleDashedIcon,
  "pi-selection-bold": PiSelectionBoldIcon,
  "pi-selection-foreground-duotone": PiSelectionForegroundDuotoneIcon,
  "pi-selection-foreground-light": PiSelectionForegroundLightIcon,
  "ri-checkbox-blank-fill": RiCheckboxBlankFillIcon,
  "rx-transparency-grid": RxTransparencyGridIcon,
  "tb-badge3-d": TbBadge3DIcon,
  "tb-bell": TbBellIcon,
  "tb-box-align-bottom-right-filled": TbBoxAlignBottomRightFilledIcon,
  "tb-chart-scatter3-d": TbChartScatter3DIcon,
  "tb-hexagon3-d": TbHexagon3DIcon,
  "tb-layers-linked": TbLayersLinkedIcon,
  "tb-layers-off": TbLayersOffIcon,
  "tb-layers-selected": TbLayersSelectedIcon,
  "tb-layers-selected-bottom": TbLayersSelectedBottomIcon,
  "tb-math-xy": TbMathXyIcon,
  "tb-refresh-dot": TbRefreshDotIcon,
  "tb-scan-eye": TbScanEyeIcon,
  "tb-sort-ascending-shapes": TbSortAscendingShapesIcon,
  "tb-vector-bezier": TbVectorBezierIcon,
  "tfi-save": TfiSaveIcon,
  "vsc-feedback": VscFeedbackIcon,
  "vsc-graph-line": VscGraphLineIcon,
  "chevron-up": ChevronUpIcon,
  "draw-rectangle": DrawRectangleIcon,
  "folder-plus": FolderPlusIcon,
  "image": ImageIcon,
  "line-segment": LineSegmentIcon,
  "tune": TuneIcon,
  "align-center": AlignCenterIcon,
  "align-left": AlignLeftIcon,
  "align-right": AlignRightIcon,
  appstore: AppstoreIcon,
  border: BorderIcon,
  "border-bottom": BorderBottomIcon,
  "border-top": BorderTopIcon,
  business: BusinessIcon,
  check: CheckIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  clear: ClearIcon,
  "clear-all": ClearAllIcon,
  close: CloseIcon,
  copy: CopyIcon,
  dashboard: DashboardIcon,
  delete: DeleteIcon,
  draw: DrawIcon,
  download: DownloadIcon,
  edit: EditIcon,
  environment: EnvironmentIcon,
  expand: ExpandIcon,
  "eye-closed": EyeClosedIcon,
  "eye-open": EyeOpenIcon,
  export: ExportIcon,
  "field-time": FieldTimeIcon,
  file: FileIcon,
  "file-done": FileDoneIcon,
  filter: FilterIcon,
  fullscreen: FullscreenIcon,
  "fullscreen-exit": FullscreenExitIcon,
  folder: FolderEmptyIcon,
  "folder-active": FolderActiveIcon,
  "folder-empty": FolderIcon,
  highlight: HighlightIcon,
  home: HomeIcon,
  import: ImportIcon,
  line: LineIcon,
  link: LinkIcon,
  lock: LockIcon,
  measure: MeasureIcon,
  "measurement-area": MeasurementAreaIcon,
  "measurement-counter": MeasurementCounterIcon,
  "measurement-cross-section": MeasurementCrossSectionIcon,
  "measurement-cut-fill": MeasurementCutFillIcon,
  "measurement-cut-fill-to-design": MeasurementCutFillToDesignIcon,
  "measurement-distance-slope": MeasurementDistanceSlopeIcon,
  "measurement-elevation": MeasurementElevationIcon,
  "measurement-pin-coordinates": MeasurementPinCoordinatesIcon,
  "measurement-removals": MeasurementRemovalsIcon,
  "measurement-stockpiles": MeasurementStockpilesIcon,
  media: MediaIcon,
  menu: MenuIcon,
  minus: MinusIcon,
  "menu-analytics": MenuAnalyticsIcon,
  "menu-bim": MenuBimIcon,
  "menu-compare-surfaces": MenuCompareSurfacesIcon,
  "menu-exhibits": MenuExhibitsIcon,
  "menu-files": MenuFilesIcon,
  "menu-markups": MenuMarkupsIcon,
  "menu-overlays": MenuOverlaysIcon,
  "menu-panorama": MenuPanoramaIcon,
  "menu-planning": MenuPlanningIcon,
  "menu-print": MenuPrintIcon,
  "menu-road-axis": MenuRoadAxisIcon,
  "menu-scans": MenuScansIcon,
  "menu-views": MenuViewsIcon,
  "menu-wires": MenuWiresIcon,
  more: MoreIcon,
  notes: NotesIcon,
  pin: PinIcon,
  point: PointIcon,
  plus: PlusIcon,
  reset: ResetIcon,
  "rotate-left": RotateLeftIcon,
  "rotate-right": RotateRightIcon,
  "zoom-in": ZoomInIcon,
  "zoom-out": ZoomOutIcon,
  "zoom-reset": ZoomResetIcon,
  screen: ScreenIcon,
  scanner: ScannerIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  "slice-view-bottom": SliceViewBottomIcon,
  "slice-view-top": SliceViewTopIcon,
  stop: StopIcon,
  table: TableIcon,
  tag: TagIcon,
  "tool-capture": ToolCaptureIcon,
  "tool-dashboard": ToolDashboardIcon,
  "tool-draw": ToolDrawIcon,
  "tool-snip": ToolSnipIcon,
  "tool-tasks": ToolTasksIcon,
  unpin: UnpinIcon,
  upload: UploadIcon,
  user: UserIcon
};

export const Icon = ({ name, size = 20, title, strokeWidth = MAIN_STROKE, ...props }: IconProps) => {
  const IconContent = icons[name];

  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="none"
      height={size}
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {title && <title>{title}</title>}
      <IconContent />
    </svg>
  );
}
