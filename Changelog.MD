# Changelog

ShKit changelog is maintained manually. Update it alongside component changes.

## 0.3.32

### Changed

- Reduced `UploadList` row vertical padding from 10px to 6px when `showDatePicker` is enabled, keeping calendar and delete controls aligned at 32px. Filename readability, preview, removal and apply-to-all behavior are preserved; ordinary lists are unchanged. Added a temporary before/after demo with four fake files per list.

### Added

- `Input` and `NumberInput` support `size="xs"` (26px) and `height` (px number or CSS height), which takes priority over the size height. Wrapper, input and padding stay aligned, including native `type="number"`; existing default sizes are preserved.
- `Modal` supports `size="compact"`: 360px width and 12px header, body and footer padding, constrained to the mobile viewport. Explicit `width` takes priority; default modals are unchanged.

### Fixed

- `Select` reserves space for clear and arrow actions with smaller action spacing. Selected values and placeholders truncate without overlapping the actions, including `size="sm"` at 158px width.

## 0.3.31

### Changed

- Unavailable calendar dates in `DateInput` and `DateRangeInput` now use the danger (red) color without dimming. Added a demo with `min`, `max`, and `disabledDate` restrictions.
- Removed the completed-file check icon and the file icon before filenames in `UploadList`.

### Added

- Added optional controlled `RightPanel.expanded` (default `false`) and `onExpandedChange`. When the callback is provided, the rightmost header button toggles the requested state and switches its fullscreen icon, tooltip and accessible label between “Развернуть” and “Свернуть”. The application controls expanded state and panel dimensions; existing layouts and mobile behavior are preserved.
- Added optional `UploadList.showApplyToAll` (default `false`): a “Применить ко всем файлам” checkbox at the bottom of the calendar, without a date beside it. It stays disabled until the date changes, then calls the existing `onDateChange(item, date)` for every file when checked. Calendars reflect updated `item.date` values. Added `DateInput.footer` and `closeOnSelect` to support the interaction and updated the documentation example.
- Added `UploadList.showDatePicker` (default `false`) to open a calendar from an icon on completed files, `UploadListItem.date` for the selected date, and `onDateChange(item, date)` returning `YYYY-MM-DD` for frontend handling. Updated documentation and interactive examples.
- Added `DateInput.iconOnly` for a compact calendar trigger without a visible text field.

### Fixed

- Aligned `Modal` footer horizontal padding with the header and body at 20 px; vertical footer padding remains 14 px.
- `Popconfirm` default button labels now follow `ShKitProvider.locale` (`ru`, `en`, `zh`) and support custom provider messages. Explicit `confirmText` and `cancelText` still take precedence.

## 0.3.30

### Changed

- Reduced `Table` tree indentation from 18 to 12 px per level and the expand/leaf slot from 22 to 16 px, and tree-cell left padding from 10 to 4 px, preserving alignment between branches and leaves at every level.

### Added

- Added `Table.alwaysHorizontalScroll` (default `false`): an optional bottom sticky horizontal scrollbar synchronized with `stickyHeader.scrollContainer` or the internal table viewport. It updates on column resize, visibility/order changes and container resize, hides when content fits, replaces the original horizontal scrollbar while enabled and preserves `scrollTop`.

- `Table.stickyHeader={{ scrollContainer, offsetTop? }}` now always uses CSS sticky for the toolbar and headers with external scrolling on both axes. The toolbar stays at the visible viewport width and remains fixed horizontally. Requires `hideVerticalScroll`, no `maxHeight`, and `virtualized={false}`; incompatible settings throw an error. The mode option was removed. See [frontend migration](docs/table-sticky-header-migration.md).

- Added optional `Table.nestingColumnKey` to keep tree indentation and expand buttons in a specified column regardless of column order or pinning. When omitted, the tree remains in the first displayed column.

### Fixed

- `Table.hideVerticalScroll` now also hides the vertical scrollbar of `stickyHeader.scrollContainer` without disabling scrolling. Original styling is restored on disable, container replacement or unmount; shared containers remain hidden until the last table releases them.

- `Table` row drag labels now show the row's `name` when it is a non-empty string, falling back to the row ID for missing, non-string or whitespace-only names. The row drag rectangle has a fixed width of 100 px; labels stay on one line and clip overflowing text without an ellipsis.

## 0.3.29

### Added

- Added three `RoadIcon` signs: road narrowing on the right (`road-narrows-right`, 1.20.2), three lanes allowing straight-ahead travel only (`lanes-three-straight`, 5.15.1), and a U-turn location (`u-turn-place`, 6.3.1). All three are available in the catalogue, search and category filters.

## 0.3.28

### Added

- Imported 12 markup signs and graphic variants into `RoadIcon` (115 entries total), including the 20 km/h speed limit and mirrored pedestrian crossing. Added `MarkupIcon` with nine semantic types and their original Marker/Pin variants, active states, contours and SVG proportions; added a catalogue demo. Clip paths use unique per-instance IDs.
- Added five `RoadIcon` plates, bringing the catalogue to 103: action directions (`action-directions`, 8.3.3), 70 m and 100 m zones of action (`zone-70` and `zone-100`, 8.2.1), operating hours 8.00–19.00 (`time-of-operation`, 8.5.4) and paid services (`paid-services`, 8.8).

### Changed

- MarkupIcon is implemented in one file with shared symbol and envelope data. Marker/Pin variants, contours and active rings are composed programmatically through the single component; separate variant components and exports were removed.

- `Table.stickyHeader` now keeps the toolbar, including filter buttons, above the column headers during external vertical scrolling. The toolbar height is accounted for without changing external `scrollTop` or content height.
- Road signs demo now opens the full collection by default; removed the New tab and New labels. All added signs remain available in the collection, search and category filters.
- Redrew `bus-road` with a left arrow at the upper left, the front of a bus in profile with one wheel at the upper right, and a right arrow below, all in white on blue.

### Fixed

- Simplified the action-directions plate to a horizontal double-headed arrow.
- Aligned all operating-hours digits to the same size and baseline.
- Redrew `keep-either-side` (4.2.3) with two diagonal lines starting at the centre of the blue circle and smaller triangular arrowheads.

## 0.3.27

### Added

- Added 23 `RoadIcon` signs and graphic variants, bringing the catalogue to 98: speed limits of 40 and 50 km/h, a 5 m height limit, left/right lane endings, two- and three-lane direction diagrams, tram stop, bus lane and bus-lane road, a 70 m upward zone-of-action plate, left/right one-way-road exit signs, blind pedestrians and paid parking.
- Added white-background lane diagrams and square/round car-wash variants. Nonstandard graphic variants are labelled separately and have no traffic-sign number.
- Added a review selection and New labels in the Road signs demo, plus additional-information and graphic-variant filters.

### Fixed

- Separated arrowheads and branches in lane-ending and lane-direction signs to prevent overlap.
- Removed arrowheads from both dangerous-bend signs and replaced the thick symbols with thinner curved lines.

## 0.3.26

### Added

- Added `RoadIcon` with 75 SVG road signs based on Russian traffic signs, including priority, warning, prohibition, mandatory, information and service signs. Supports `name`, `size`, `title` and standard SVG props; sign colours and vector lettering do not depend on the UI theme or fonts.
- Added public `RoadIconName`, `RoadIconProps` and `roadIconNames` exports.
- Added a separate Road signs demo with all 75 signs, search by name or traffic-sign number, category filters, a New 25 tab, sizes from 20 to 96 px, light/dark backgrounds and source links.
- Added `Table.stickyHeader={{ scrollContainer, offsetTop }}` for sticky column headers with external vertical scrolling (`hideVerticalScroll=true`, no `maxHeight`, `virtualized=false`). The original headers retain column widths, drag and resize; external `scrollTop` is unchanged. Added an external-scroll documentation example.

### Fixed

- Keep the pinned Table column at the left edge during horizontal scrolling.

## 0.3.25

### Added

- Added `Table.filtersOffsetX` to shift the filters panel left or right in px relative to the filter button, so it does not cover the table while working with it. Positive values move the panel right, negative values move it left.

## 0.3.24

### Added

- Added `RangeSlider`, a slider with bar-shaped handles instead of round thumbs. It is vertical by default, so one bar sits on top and the other on the bottom with the selected range highlighted between them; both bars are draggable and respond to arrow keys.
- Added `RangeSlider.mode="single"` for a single bar with the same look as the range bars, filled from the start of the track. In this mode `value`, `defaultValue`, and `onChange` work with a number instead of a `[min, max]` pair.
- Added `RangeSlider.minDistance` to keep a minimal gap between both bars, and `RangeSlider.barLength` to set the bar length across the track.
- Added `RangeSlider` support for `marks`, `marksOffset`, `dots`, `step={null}` mark snapping, `vertical={false}` for bars on the left and right, `height`, `formatValue`, and `error`/`hint` captions, matching `Slider`.
- Added `RangeSlider` documentation with vertical, single-bar, `minDistance`, and horizontal examples.

### Fixed

- Fixed the `Slider` header so the current value no longer changes the control width while dragging. Room is reserved for the widest value the range can produce and digits render with `tabular-nums`, so a growing value no longer shifts the label or the elements around a horizontal slider.

## 0.3.23

### Added

- Added `Badge.fontWeight` to customize font weight while preserving the previous default of 900.
- Added a Badge documentation example comparing font weights 900 and 500.

### Changed

- `FileItem` labels now use `Badge` with a lighter font weight of 500.

## 0.3.22

### Added

- Added `zoom-in`, `zoom-out`, and `zoom-reset` icons.
- Added `slice-view-top` and `slice-view-bottom` icons.

### Changed

- Simplified `rotate-left` and `rotate-right` to the rounded arrows only, without the center mark.
- Redrew `fullscreen-exit` as four inward corner arrows without the overlapping extra paths.

### Fixed

- Fixed `LayoutFitContent` so right/left/top/bottom layout obstacles are still subtracted when `getBoundingClientRect()` edges differ by a subpixel (Windows DPI / WSL / zoom).

## 0.3.21

### Added

- Added `ToastProvider.width` and `ToastOptions.width` to set toast width in px. If omitted, toasts stay at the previous default of 420.

## 0.3.20

### Changed

- `FileItem icon={null}` hides the icon slot so the title starts immediately, without the empty 28px gap. Omitting `icon` still shows the default file icon.
- `FileItem` and `FolderItem` selected state now use the hover highlight background in addition to the left inset strip.

## 0.3.19

### Added

- Added `SegmemtedControl.equalItemWidth` to make big size controls more accurate.

## 0.3.18

### Changed

- Shifted `Sidebar` panel titles slightly to the right.

### Fixed

- Restored bubble-phase outside-click for `Select`, so neighboring controls can still use `stopPropagation` without forcing the popup closed.
- Fixed `Select` with `renderTag`: the control root is a `div` instead of `label`, so a click on the chevron no longer activates the tag close button.
- Fixed searchable `Select` chevron to toggle the popup closed instead of only opening it.

## 0.3.17

### Added

- Added `RightPanel.onWidthChange` to observe resize-handle width changes with the active tab context.
- Added new icons.
- Added `transparent` to `BadgeTone`.

## 0.3.16

### Added

- Added `ShortCard`, a compact compound card for measurement tool windows and metric panels.
- Added `ShortCard.Body` with `surface` and `muted` variants for bordered metric panels.
- Added `ShortCard.Row`, `ShortCard.Value`, `ShortCard.Divider`, `ShortCard.Coords`, and `ShortCard.Content` subcomponents for labeled rows, read-only values, dividers, coordinate inputs, and nested sections.
- Added `ShortCard` props `title`, `icon`, and `titleIcon` for compact headers with measurement icons.
- Added `ShortCard` documentation with cross-section and read-only metric examples.
- Added `ColorPicker.counterMode` for a compact 36×36 badge trigger with `children` rendered inside on top of the current color.
- Added `ColorPicker.onBlur` callback, fired when the picker popup closes.

### Changed

- Reworked searchable `Select` so the search field renders in the control instead of the dropdown popup; the list now shows filtered options only.
- Updated searchable `Select` to use **Поиск** as the default placeholder instead of **Выберите** (custom `placeholder` is still respected).
- Updated `Select` fields documentation with a searchable control example.
- Updated `ColorPicker` documentation with a `counterMode` example.

## 0.3.15

### Changed

- Updated `TimePicker` default label to use ShKitProvider localization messages.

## 0.3.14

### Added

- Added the `media` icon and included it in the icons documentation catalog.

## 0.3.13

### Added

- Added `Tooltip.className` and `Tooltip.popupClassName` for trigger wrapper and portal bubble styling.
- Added `Button.tooltipClassName` and `Button.tooltipTriggerClassName` for the built-in tooltip on buttons.
- Added `download` and `scanner` icons to `IconName`.

### Changed

- Updated Tooltip and Button documentation for the new className props.

## 0.3.12

### Added

- Added `ColorPicker.rgb` to emit and edit colors as `rgb()` / `rgba()`; in `fullMode`, channel fields show **R**, **G**, and **B** labels with numeric inputs in one row.
- Added `ColorPicker.showValueLabel` to show the current color string above the trigger swatch.
- Added `ColorPicker.labelPlacement` (`top` | `right` | `bottom` | `left`) and exported `ColorPickerLabelPlacement`.

### Changed

- Updated `ColorPicker` to parse HEX and RGB/RGBA for display, custom input validation, palette selection, and `onChange` normalization (existing integrations without new props keep HEX behavior).
- Updated `ColorPicker` documentation props and usage examples for `rgb`, `showValueLabel`, and `labelPlacement`.
- Added `Input.weight` for field text weight (default `400` / body); use `700` to match the previous bold look.
- Updated `NumberInput` documentation for numeric input behavior.

### Fixed

- Fixed `NumberInput` to reject letters and stray symbols while typing, normalize `,` to `.`, and sanitize the value again on blur before commit.

## 0.3.11

### Changed

- Added default vertical spacing to `Form` with a configurable `gap` prop so simple forms no longer need a wrapper `Flow`.
- Added `Form.footerSticky` for long forms that need actions pinned to the bottom of the scroll area.
- Made `Button` default to `type="button"` while keeping `SubmitButton` explicitly submit-only.
- Updated `Table` toolbar actions to use the built-in `Button.tooltip` API instead of external tooltip wrappers.

### Fixed

- Added explicit `type="button"` to `Table` and `Filters` action buttons so they do not accidentally submit parent forms.

## 0.3.10

### Added

- Added `ColorPicker.fullMode`, a graphical picker with saturation/value area, hue slider, alpha slider, HEX input, and live preview.
- Added shared color parsing/conversion utilities for HEX, HEX with alpha, RGB/RGBA, HSV conversion, and CSS color output.

### Changed

- Reworked `ColorPicker` so compact mode still supports palette/custom HEX input while full mode uses the new graphical picker.
- Reworked `FileItem` and `FolderItem` loading states with animated skeleton rows and disabled interaction while loading.
- Reworked `Sidebar` navigation item hover states with a darker rail treatment, accent marker, sweep highlight, icon motion, and stronger active state.
- Reworked `Sidebar` panel mount/unmount behavior with smoother pinned and floating panel animations, including delayed unmount for exit transitions.
- Simplified component documentation by removing historical `anatomy` and migration sections from the docs model and all component docs.
- Reworked component docs layout so descriptions sit above a full-width preview, followed by props and code.
- Updated documentation navigation search to focus on component names, descriptions, props, and backlog cards after removing anatomy and migration text.
- Updated the landing documentation copy and component cards to remove migration-plan wording now that migration is complete.

### Fixed

- Fixed editable `Table` cell controls so inputs/selects/checkboxes fit dense row heights without stretching or showing duplicate helper text.
- Fixed `FileItem` and `FolderItem` loading rows so they are marked busy, removed from tab order, and do not trigger row actions while loading.

## 0.3.9

### Added

- Added `Dropdown.align`, `Dropdown.offsetX`, and `Dropdown.offsetY` to control floating panel alignment and offsets.
- Added `ToastProvider.offset` to configure toast viewport distance from the screen edge.
- Added `Upload.titlePlacement` with `beside` and `below` layouts for dropzone title and action placement.
- Added the `settings` icon and included it in the icons documentation catalog.

### Changed

- Reworked `NumberInput` to preserve intermediate numeric text such as empty input, sign-only values, and trailing decimal points without pushing invalid draft values to the controlled store.
- Reworked the `menu-markups` icon into a clearer attached-note symbol.
- Updated dropdown, fields, toast, upload, and icons documentation for the new APIs.

## 0.3.8

### Added

- Added the `point` icon and included it in the icons documentation catalog.

### Changed

- Updated the LiveDemo customer site dropdown to use the new filled `point` icon for site options.
- Reworked the `menu-road-axis` icon with a perspective road-axis shape.
- Replaced the `menu-wires` icon with a power line tower symbol.

## 0.3.6 - 0.3.7

### Added

- Added a `dark` ShKit theme preset and provider documentation preview.
- Added separate light and neutral dark OSM Liberty PMTiles map styles for LiveDemo.

### Changed

- Refined the `dark` theme preset into a quieter VS Code-inspired graphite palette with green ShKit accents.
- Added dedicated sidebar rail color tokens so the dark theme can keep the left rail dark while preserving primary action colors.
- Added theme-aware sidebar logo color tokens for light and dark mode.
- Centered custom sidebar logo image and SVG content inside the logo button.
- Lightened LiveDemo sidebar file-list surfaces in dark mode with a more neutral grey layer.
- Added a stronger `Modal` dialog border so overlays remain visible on dark backgrounds.
- Reduced inactive `RightPanel` tab contrast in dark theme while keeping active tabs lime.
- Updated LiveDemo fullscreen controls with a compact two-row toolbar and `Dark` theme option.
- Reduced default `SegmentedControl` height and horizontal padding for a denser toolbar layout.
- Tightened mobile `SegmentedControl` sizing further for compact toolbar controls.
- Updated LiveDemo maps to switch between light and neutral dark map styles with the selected theme.

## 0.3.5

### Added

- Added `Badge.size` with `sm`, `md`, and `lg` variants for text badges and status dots.
- Added `FileItem.labelSize` to control the size of file label badges.
- Added `Sidebar.panelMobileHeight` so the left submenu panel can render as a configurable mobile bottom sheet, defaulting to `50dvh`.

### Changed

- Moved `FileItem.label` rendering into the secondary meta row so long badges no longer take space from the file title.
- Updated `FileItem` and `FolderItem` actions to render as hover overlays instead of reserving layout space in each row.
- Made `SegmentedControl` much more compact on small mobile screens.
- Expanded `Badge`, `FileItem`, and `Sidebar` docs with size, long-label, active-content, and mobile panel examples.

### Fixed

- Fixed transparent hover action buttons in `FileItem` and `FolderItem` overlays by giving the action buttons their own surface background.
- Fixed long `FileItem` label badges stretching file rows by constraining badge overflow with ellipsis.

## 0.3.3 - 0.3.4

### Added

- Added palette-based `Badge` tones: `neutral`, `grey`, `dark`, `green`, `lime`, `orange`, `red`, `beige`, `white`, and `black`.
- Added `FileItem.labelTone` so file labels use the shared `Badge` palette instead of custom inline badge markup.
- Added a ShKit portal host in `ShKitProvider` so portal-based overlays can inherit provider font and theme context.

### Changed

- Updated `FileItem.label` rendering to use the shared `Badge` component.
- Kept legacy `Badge` tones (`default`, `success`, `warning`, `danger`, `info`) as compatibility aliases while documenting the palette tones as the primary API.
- Moved `ShKitProvider` runtime ownership beyond i18n responsibilities by centralizing font scope, theme variables, z-index variables, locale/messages, and portal hosting.
- Updated `Modal`, `Dropdown`, `Select`, `Tooltip`, `DateInput`, `DateRangeInput`, and `Mentions` portals to render into the provider portal host with `document.body` fallback.
- Removed repeated Rubik `fontFamily` declarations from individual components; font inheritance now comes from `ShKitProvider`.
- Updated LiveDemo to showcase current `0.3.2+` components, including `Carousel`, `Splitter`, `Slider` marks, new icons, `FileItem.preview`, and palette-based `Badge` labels.
- Expanded `Badge`, `FileItem`, `Modal`, and `ShKitProvider` documentation for palette tones, badge labels, modal extension hooks, font scope, and portal host behavior.

### Fixed

- Fixed ShKit portal overlays losing the Rubik font when rendered outside the provider DOM subtree.
- Fixed `Modal` grid row sizing so header, body, and footer keep predictable heights in tall dialogs.

## 0.3.2

### Added

- Added `Carousel` with controlled/uncontrolled active slide state, dots, infinite mode, and imperative `goTo`, `next`, and `prev` API.
- Added `Splitter` with horizontal/vertical layouts, resizable panels, `Splitter.Panel`, `defaultSize`, `min`, `max`, and resize callbacks.
- Added a large set of product UI icons for alignment, actions, file states, measurements, menu sections, tools, fullscreen, upload, visibility, and related workflows.
- Added `Slider` marks, step dots, `step={null}` mark snapping, vertical mode, custom value formatting, and configurable mark label offset.
- Added `FileItem.preview` for image thumbnails with `ImagePreview` viewer support.

### Changed

- Extended `Card` with `titleIcon`, `titleSize`, `headerDivider`, `hoverable`, improved header/actions layout, and footer support.
- Updated `ImagePreview` fullscreen viewer to use `Modal` instead of a separate internal overlay.
- Extended `Modal` with `headerActions`, `className`, `overlayClassName`, and `bodyClassName` hooks for composed components.
- Updated `Modal` layout so header/body/footer rows size predictably and the header does not stretch in tall dialogs.
- Added compact layout mode to `Filters` for narrower panels.
- Removed the per-rule enabled switch from `Filters`/table filter adapters; active rules are now determined by value/operator.
- Updated component docs and LiveDemo examples for Carousel, Splitter, Slider, Card, Icons, Filters, FileItem previews, and Modal extension props.

### Fixed

- Fixed `FileItem` keyboard handling so nested preview controls do not accidentally trigger row selection.
- Fixed `ImagePreview` inside documentation/examples by rendering through `Modal` portal behavior instead of staying constrained by the preview container.

## 0.3.1

### Added

- Added public `Filters` and `FilterPanel` components with neutral `FilterField`/`FilterRule` APIs for lists, catalogs, and table-like views.
- Added shared filter helpers and types, including `applyFilters`, `FilterOperator`, `FilterValue`, and `FilterOperatorLabels`.
- Added `Filters` documentation with a live list example covering string, select, number, date, and boolean fields.

### Changed

- Reworked `Table` filtering to use the public `Filters` layer through an adapter while preserving `TableFilterRule.columnKey` and serialized `_filters` compatibility.

### Fixed

- Fixed `DateInput` and `DateRangeInput` placeholder rendering so the visual placeholder is not duplicated by the native input placeholder.
- Fixed `DateInput` and `DateRangeInput` popup behavior inside `Dropdown`/table filters by marking calendar portals as ShKit portals and stopping inner pointer events, matching `Select` popup behavior.

## 0.3.0

### Added

- Added `Mentions`, a plain-text textarea control with trigger-based suggestions, keyboard navigation, async search support, custom option rendering, and insertion by `Enter`/`Tab`.
- Added advanced `DateInput` and `DateRangeInput` capabilities on the existing components: `disabledDate`, `presets`, controlled `open/onOpenChange`, keyboard calendar navigation, single-calendar range selection, and optional `showTime` support.
- Added dedicated `DateInput` documentation, splitting date controls out of the broader `Fields` page.

### Changed

- Updated `Fields` documentation to focus on text, number, select, textarea, mentions, and checkbox controls after moving date controls to their own page.
- Updated `Component Cards` to track only unresolved planned or research items instead of duplicating completed component docs.
- Removed planned backlog entries for `Mentions`, advanced date picker work, notifications, drawer, and explorer container after either implementing them or deciding they should not be tracked as ShKit backlog.
- Replaced sensitive or personal demo data in Select, breadcrumbs, header, and LiveDemo examples with neutral demo values.
- Standardized source declarations on arrow functions and fixed z-index helper initialization order after that conversion.

### Fixed

- Fixed `Modal` close button alignment when the modal has no title.
- Fixed `zIndexVar` runtime initialization by declaring arrow-function helpers before the derived `zIndex` object.

## 0.2.6

### Added

- Added `Select.allowClear` and `Select.onClear` for antd-compatible clear behavior in single and multi-select modes.
- Added `Select.renderTag` documentation and examples for custom selected tag rendering.
- Added `Sidebar.logoHeight` to configure the logo panel height without CSS overrides.
- Added `rotate-left` and `rotate-right` icons for image viewer controls.
- Added shared typestyle keyframes exports for ShKit runtime animations.

### Changed

- Removed `Sidebar.panelWidth`; panel width is now owned by the panel content, keeping `Sidebar` focused on shell behavior.
- Updated `Sidebar`, `Layout`, and LiveDemo examples to set submenu panel width inside the provided panel content.
- Reworked `ImagePreview` fullscreen viewer with an `80dvw` by `80dvh` modal, natural-size fit-to-view, mouse wheel zoom, rotate-left/rotate-right controls, reset, and Escape close.
- Kept `Select` multiselect and tags popup open after selecting options or adding custom tags.
- Updated `Input` field docs to point antd `addonBefore`/`addonAfter` migrations to existing `prefix`/`suffix`.
- Updated `Header` to use the shared `HEADER_HEIGHT` token.
- Updated `task package:publish` so prerelease versions publish with the `dev` dist-tag by default, while allowing `NPM_TAG` overrides.

### Fixed

- Fixed ShKit component animations in external projects by moving spinner, skeleton, collapse, modal, and image preview keyframes into the JS/typestyle bundle instead of requiring `src/index.css`.
- Fixed `DocsNavigation` scrolling by making the nav list the dedicated scroll container inside a `100dvh` sticky sidebar.
- Fixed `Select` popup interaction so pointer events inside the portal are not treated as outside clicks.

## 0.2.5

### Changed

- Reworked mobile `Layout` grid so the sidebar toggle keeps its own header cell while page content still spans the full width below the header.
- Kept the mobile `Sidebar` shell and toggle in normal layout flow instead of positioning the whole sidebar absolutely.
- Aligned `Layout`, `Sidebar`, and `RightPanel` mobile breakpoints on `RESPONSIVE_BREAKPOINTS.M`.

### Fixed

- Fixed mobile header overlap with the sidebar toggle.
- Fixed the empty left stripe that appeared below the mobile header.
- Fixed mobile sidebar opening after returning the toggle to normal flow.

## 0.2.4

### Added

- Added the `Divider` layout primitive.
- Added a localized ShKit-styled calendar popup to `DateInput` and `DateRangeInput`.
- Added fast month and year picker views to the date calendar.

### Changed

- Replaced the native browser date picker with a design-system calendar while keeping the existing `YYYY-MM-DD` API.
- Split `DateInput` calendar logic and styles into separate files.
- Updated `Form` and `Modal` docs to use `useFormAction`, `Form`, `Field`, and `SubmitButton` patterns.
- Updated layout primitive docs and navigation data to cover `Divider` without exposing the removed `Flex` component.

### Fixed

- Fixed `Field` required marker and error coloring so optional labels stay neutral.
- Fixed `DateInput` popup behavior so it closes after selecting a date and no longer steals focus back open.
- Fixed `Sidebar` mobile positioning, hidden state, and tab selection behavior in LiveDemo.
- Fixed sidebar layering so left panel content stays behind the sidebar.
- Fixed nested button markup in `FileItem` and `FolderItem`.

## 0.2.3

### Added

- Added `Card.titleAlign` with `"start"` and `"center"` modes.
- Added configurable `Modal.width` with `number | string` support.
- Added a richer `Modal` docs example with a form, required-field validation, field errors, and save/cancel actions.

### Changed

- Updated `Card` header layout so title/subtitle take the full width when no `actions` are provided.
- Reworked the z-index scale with larger gaps between layers, making product-specific overlay ordering easier to extend.
- Raised overlay ordering so `Modal` appears above app shell controls, while `Dropdown`, `Select`, and `Tooltip` can still appear above modal content.
- Updated demo z-index theme/fallback values to match the expanded z-index scale.

### Fixed

- Fixed `Modal` focus handling so controlled inputs keep focus while typing.
- Fixed `Select` dropdown visibility when opened from inside `Modal` by relying on the corrected global z-index order.

## 0.2.0

Work focused on making ShKit broad enough to replace local Sh components and antd usage in `front`.

### Added

- `Flow` as the shared layout primitive for vertical, horizontal, and grid composition.
- `Form`, `Field`, `SubmitButton`, and `useFormAction` on top of React 19 form primitives.
- `Card`.
- `Alert`.
- `ErrorDisplay`.
- `Spinner`.
- `Skeleton`.
- `Empty`.
- `Result`.
- `Badge`.
- `Tag`.
- `Collapse`.
- `Tabs`.
- `ImagePreview`.
- `ColorPicker`.
- `ToastProvider`, `ToastViewport`, and `useToast`.
- `Description`.
- `Upload` and `UploadList`.
- Named z-index scale: `zIndexValues`, `zIndex`, `zIndexVar`, `createZIndexScale`, and `theme.zIndex` support in `ShKitProvider`.
- Searchable `Icons` documentation page for the built-in `IconName` set.

### Changed

- Updated the project to React 19.
- Expanded `Table` toward old `ShTable` behavior: state storage, column visibility/order/resize, pinned column, editable cells, tree rows, drag interactions, filtering, localization, export, loading and empty states, and scrollable examples.
- Split `Popover`, `Modal`, and `Popconfirm` into separate docs and demos.
- Polished overlay animation behavior for a more production-grade feel.
- Updated `SegmentedControl` behavior for constrained widths and scrollable demos.
- Updated `LiveDemo` to use newer ShKit components, added Form and state examples, and added default/custom theme switching.
- Reworked component docs props tables to use ShKit `Table` with nested rows for item props.
- Reworked `DocsNavigation` to use ShKit `Button`, `Input`, `Card`, `Flow`, `Tag`, and `Collapse`.
- Added `toolbar` control to `Table` for compact embedded documentation tables.
- Moved ShKit runtime z-index usage from raw numbers to named z-index tokens.
- Split roadmap/docs cards so planned data display, loading, feedback, and upload components are tracked as separate items.
- Included `src/docs/components` and `Changelog.MD` in the published package files.

## 0.1.0

Initial ShKit foundation and first reusable components.

### Added

- Design tokens, themes, and `ShKitProvider` with locale support.
- `Button`.
- `Icon`.
- Field controls: `Input`, `NumberInput`, `Textarea`, `Select`, `Checkbox`, `Switch`, `DateInput`, and `DateRangeInput`.
- Choice and range controls: `RadioGroup`, `SegmentedControl`, and `Slider`.
- Layout and app shell components: `Layout`, `Header`, `Sidebar`, `RightPanel`, and `ElementGroup`.
- Navigation and file UI: `Breadcrumbs`, `FileItem`, and `FolderItem`.
- Overlay/menu primitives: `Dropdown`, `Menu`, `Tooltip`, `Popover`, `Modal`, and `Popconfirm`.
- Baseline `Table` and `TableState`.
