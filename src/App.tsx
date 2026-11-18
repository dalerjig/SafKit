import { type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { classes, media, style } from "typestyle";
import {
  Button,
  Icon,
  RESPONSIVE_BREAKPOINTS,
  SegmentedControl,
  ShKitProvider,
  Tooltip,
  color,
  palette,
  radius,
  shadow,
  space,
  typography,
  zIndexVar,
  type ShKitLocale
} from ".";
import { ComponentDocsSection } from "./docs/ComponentDocsSection";
import { DocsNavigation, getComponentCardAnchorId } from "./docs/DocsNavigation";
import {
  getAlertDoc,
  getBadgeDoc,
  getButtonDoc,
  getBreadcrumbsDoc,
  getCardDoc,
  getShortCardDoc,
  getCarouselDoc,
  getCheckboxDoc,
  getCollapseDoc,
  getColorPickerDoc,
  getDateInputDoc,
  getDescriptionDoc,
  getDropdownMenuDoc,
  getElementGroupDoc,
  getEmptyDoc,
  getErrorDisplayDoc,
  getFileFolderDoc,
  getFieldsDoc,
  getFiltersDoc,
  getFormDoc,
  getHeaderDoc,
  getIconDoc,
  getRoadIconDoc,
  getMarkupIconDoc,
  getIconsDoc,
  getImagePreviewDoc,
  getLayoutDoc,
  getLayoutPrimitivesDoc,
  getModalDoc,
  getPopoverDoc,
  getPopconfirmDoc,
  getProviderDoc,
  getRadioGroupDoc,
  getRangeSliderDoc,
  getResponsiveDoc,
  getResultDoc,
  getRightPanelDoc,
  getSegmentedControlDoc,
  getSidebarDoc,
  getSkeletonDoc,
  getSliderDoc,
  getSpinnerDoc,
  getSplitterDoc,
  getSwitchDoc,
  getTagDoc,
  getTabsDoc,
  getTableDoc,
  getTableStateDoc,
  getTimePickerDoc,
  getToastDoc,
  getTooltipDoc,
  getUploadDoc
} from "./docs/components";
import { LiveDemo } from "./LiveDemo";
import { componentCards, statusLabels, tableStateContract, type ComponentStatus } from "./designSystemData";

const statusClass: Record<ComponentStatus, string> = {
  foundation: style({ background: palette.black, color: palette.white }),
  "ready-to-port": style({ background: palette.babyGreen, color: palette.darkGreen }),
  planned: style({ background: palette.beige, color: palette.darkGreen }),
  research: style({ background: palette.orange, color: palette.white })
};

const paletteRows = [
  ["Off white", palette.offWhite],
  ["Grey light", palette.greyLight],
  ["Iron grey", palette.ironGrey],
  ["Black", palette.black],
  ["Dark green", palette.darkGreen],
  ["Green", palette.green],
  ["Baby green", palette.babyGreen],
  ["Orange", palette.orange]
];

const customDemoTheme = {
  color: {
    primary: "#243C7A",
    primaryHover: "#1B2D5C",
    accent: "#FFB703",
    surfaceSecondary: "#E7F0FF",
    textMuted: "#34506B",
    borderStrong: "#8BA4C4"
  },
  zIndex: {
    modal: 1300,
    toast: 13000,
    liveDemoToolbar: 1400
  }
};

const App = () => {
  const [docSegment, setDocSegment] = useState<"public" | "private">("public");
  const [locale, setLocale] = useState<ShKitLocale>("ru");
  const [themeMode, setThemeMode] = useState<"default" | "custom" | "dark">("default");
  const [livePage, setLivePage] = useState(() => window.location.hash === "#live-demo-fullscreen");
  const [liveControlsOpen, setLiveControlsOpen] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 12, y: 12 });
  const controlsDragMovedRef = useRef(false);
  const providerThemePreset = themeMode === "dark" ? "dark" : "shtab";
  const providerTheme = themeMode === "custom" ? customDemoTheme : undefined;
  const liveDemoMapTheme = themeMode === "dark" ? "dark" : "light";

  useEffect(() => {
    const handleHashChange = () => setLivePage(window.location.hash === "#live-demo-fullscreen");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const componentDocs = [
    getButtonDoc({ docSegment, setDocSegment, styles }),
    getBreadcrumbsDoc({ docSegment, setDocSegment, styles }),
    getCheckboxDoc({ docSegment, setDocSegment, styles }),
    getDropdownMenuDoc({ docSegment, setDocSegment, styles }),
    getElementGroupDoc({ docSegment, setDocSegment, styles }),
    getCardDoc({ docSegment, setDocSegment, styles }),
    getShortCardDoc({ docSegment, setDocSegment, styles }),
    getCarouselDoc({ docSegment, setDocSegment, styles }),
    getAlertDoc({ docSegment, setDocSegment, styles }),
    getErrorDisplayDoc({ docSegment, setDocSegment, styles }),
    getToastDoc({ docSegment, setDocSegment, styles }),
    getFieldsDoc({ docSegment, setDocSegment, styles }),
    getFiltersDoc({ docSegment, setDocSegment, styles }),
    getDateInputDoc({ docSegment, setDocSegment, styles }),
    getTimePickerDoc({ docSegment, setDocSegment, styles }),
    getFormDoc({ docSegment, setDocSegment, styles }),
    getProviderDoc({ docSegment, setDocSegment, styles }),
    getResponsiveDoc({ docSegment, setDocSegment, styles }),
    getSwitchDoc({ docSegment, setDocSegment, styles }),
    getRadioGroupDoc({ docSegment, setDocSegment, styles }),
    getPopoverDoc({ docSegment, setDocSegment, styles }),
    getModalDoc({ docSegment, setDocSegment, styles }),
    getPopconfirmDoc({ docSegment, setDocSegment, styles }),
    getSegmentedControlDoc({ docSegment, setDocSegment, styles }),
    getSliderDoc({ docSegment, setDocSegment, styles }),
    getRangeSliderDoc({ docSegment, setDocSegment, styles }),
    getSpinnerDoc({ docSegment, setDocSegment, styles }),
    getSplitterDoc({ docSegment, setDocSegment, styles }),
    getSkeletonDoc({ docSegment, setDocSegment, styles }),
    getEmptyDoc({ docSegment, setDocSegment, styles }),
    getResultDoc({ docSegment, setDocSegment, styles }),
    getBadgeDoc({ docSegment, setDocSegment, styles }),
    getTagDoc({ docSegment, setDocSegment, styles }),
    getCollapseDoc({ docSegment, setDocSegment, styles }),
    getTabsDoc({ docSegment, setDocSegment, styles }),
    getImagePreviewDoc({ docSegment, setDocSegment, styles }),
    getColorPickerDoc({ docSegment, setDocSegment, styles }),
    getDescriptionDoc({ docSegment, setDocSegment, styles }),
    getLayoutPrimitivesDoc({ docSegment, setDocSegment, styles }),
    getLayoutDoc({ docSegment, setDocSegment, styles }),
    getRightPanelDoc({ docSegment, setDocSegment, styles }),
    getHeaderDoc({ docSegment, setDocSegment, styles }),
    getIconDoc({ docSegment, setDocSegment, styles }),
    getRoadIconDoc({ docSegment, setDocSegment, styles }),
    getMarkupIconDoc({ docSegment, setDocSegment, styles }),
    getIconsDoc({ docSegment, setDocSegment, styles }),
    getSidebarDoc({ docSegment, setDocSegment, styles }),
    getFileFolderDoc({ docSegment, setDocSegment, styles }),
    getTableDoc({ docSegment, setDocSegment, styles }),
    getTableStateDoc({ docSegment, setDocSegment, styles }),
    getTooltipDoc({ docSegment, setDocSegment, styles }),
    getUploadDoc({ docSegment, setDocSegment, styles })
  ];

  const startLiveControlsDrag = (event: ReactPointerEvent<HTMLElement>, ignoreInteractive = false) => {
    const target = event.target;
    if (
      ignoreInteractive &&
      target instanceof Element &&
      target.closest("button, input, textarea, select, [role='button']")
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const startX = event.clientX;
    const startY = event.clientY;
    controlsDragMovedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent: PointerEvent) => {
      const moved = Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3;
      if (moved) controlsDragMovedRef.current = true;
      setToolbarPosition({
        x: Math.max(8, Math.min(window.innerWidth - rect.width - 8, moveEvent.clientX - offsetX)),
        y: Math.max(8, Math.min(window.innerHeight - rect.height - 8, moveEvent.clientY - offsetY))
      });
    };
    const handleUp = () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
  };

  const openLiveControls = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (controlsDragMovedRef.current) {
      event.preventDefault();
      controlsDragMovedRef.current = false;
      return;
    }
    setLiveControlsOpen(true);
  };

  if (livePage) {
    return (
      <ShKitProvider locale={locale} theme={providerTheme} themePreset={providerThemePreset}>
        <main className={styles.livePage}>
          {liveControlsOpen ? (
            <div
              className={styles.livePageToolbar}
              style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
              onPointerDown={event => startLiveControlsDrag(event, true)}
            >
              <div className={styles.livePageToolbarTop}>
                <Button variant="secondary" onClick={() => { window.location.hash = ""; }}>Назад к документации</Button>
                <Tooltip content="Свернуть панель" placement="bottom">
                  <Button
                    aria-label="Свернуть панель"
                    icon={<Icon name="close" />}
                    onClick={() => setLiveControlsOpen(false)}
                    size="sm"
                    square
                    variant="ghost"
                  />
                </Tooltip>
              </div>
              <div className={styles.livePageToolbarBottom}>
                <SegmentedControl
                  fullWidth
                  value={locale}
                  onChange={setLocale}
                  options={[
                    { label: "RU", value: "ru" },
                    { label: "EN", value: "en" },
                    { label: "中文", value: "zh" }
                  ]}
                />
                <SegmentedControl
                  fullWidth
                  value={themeMode}
                  onChange={setThemeMode}
                  options={[
                    { label: "Default", value: "default" },
                    { label: "Dark", value: "dark" },
                    { label: "Custom", value: "custom" }
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className={styles.livePageControlsDock} style={{ left: toolbarPosition.x, top: toolbarPosition.y }}>
              <Tooltip content="Открыть настройки демо" placement="right">
                <Button
                  aria-label="Открыть настройки демо"
                  icon={<Icon name="menu" />}
                  onClick={openLiveControls}
                  onPointerDown={event => startLiveControlsDrag(event)}
                  size="sm"
                  square
                  variant="primary"
                />
              </Tooltip>
            </div>
          )}
          <LiveDemo locale={locale} mapTheme={liveDemoMapTheme} onLocaleChange={setLocale} fullscreen />
        </main>
      </ShKitProvider>
    );
  }

  return (
    <ShKitProvider locale={locale} theme={providerTheme} themePreset={providerThemePreset}>
      <main className={styles.page}>
        <DocsNavigation docs={componentDocs} componentCards={componentCards} />

        <div className={styles.content}>
        <section id="overview" className={styles.hero}>
          <div className={styles.kicker}>ShKit design system</div>
          <h1>Компонентная система для карты, аналитики и строительных сценариев.</h1>
          <p>
            ShKit наследует подход текущих Sh-компонентов из front, но наружу экспортирует чистые имена:
            <code> Button</code>, <code>Table</code>, <code>FileItem</code>, <code>FolderItem</code>, <code>Sidebar</code>. Компоненты
            уже собраны в единый UI-слой для продуктовых сценариев.
          </p>
          <div className={styles.heroActions}>
            <Button variant="primary" size="lg">Начать с primitives</Button>
            <SegmentedControl
              value={locale}
              onChange={setLocale}
              options={[
                { label: "RU", value: "ru" },
                { label: "EN", value: "en" },
                { label: "中文", value: "zh" }
              ]}
            />
          </div>
        </section>

        <section className={styles.foundation}>
          <DocPanel title="Tokens" meta="colors, type, radius, shadow">
            <div className={styles.paletteGrid}>
              {paletteRows.map(([name, value]) => (
                <div key={name} className={styles.swatch(value)}>
                  <span>{name}</span>
                  <code>{value}</code>
                </div>
              ))}
            </div>
          </DocPanel>

          <DocPanel title="Principles" meta="component rules">
            <ol className={styles.stepList}>
              <li>Компоненты экспортируются под чистыми именами без привязки к внешним UI-kit API.</li>
              <li>Общие primitives остаются компактными, а продуктовая логика живет уровнем выше.</li>
              <li>Документация показывает поведение, API и рабочие примеры без исторических переходных заметок.</li>
            </ol>
          </DocPanel>
        </section>

        <section id="live-layout" className={styles.section}>
          <SectionHeader
            title="Live Layout"
            text="Ниже не картинка, а рабочий стенд ShKit: Sidebar, Header left/center/right slots, панели, файлы, формы и таблица в одном layout."
          />
          <div className={styles.liveActions}>
            <Button variant="primary" onClick={() => { window.location.hash = "live-demo-fullscreen"; }}>Открыть на отдельной странице</Button>
          </div>

          <LiveDemo locale={locale} mapTheme={liveDemoMapTheme} onLocaleChange={setLocale} />
        </section>

        <section id="docs" className={styles.section}>
          <SectionHeader
            title="Component Docs"
            text="Детальная документация по уже живым компонентам: поведение, API и пример кода."
          />
          <ComponentDocsSection docs={componentDocs} />
        </section>

        <section id="components" className={styles.section}>
          <SectionHeader
            title="Component Cards"
            text="Backlog-карточки для того, что еще не реализовано: открытые решения, будущий импорт и notes для переноса."
          />

          <div className={styles.cardsGrid}>
            {componentCards.map(component => (
              <article key={component.name} id={getComponentCardAnchorId(component.name)} className={styles.componentCard}>
                <div className={styles.cardTopline}>
                  <span className={classes(styles.status, statusClass[component.status])}>
                    {statusLabels[component.status]}
                  </span>
                  <code>{component.futureImport}</code>
                </div>
                <h3>{component.name}</h3>
                <p className={styles.source}>{component.source}</p>
                <p className={styles.summary}>{component.summary}</p>
                <div className={styles.cardColumns}>
                  <ListBlock title="Отвечает за" items={component.responsibilities} />
                  <ListBlock title="API" items={component.apiNotes} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="table-state" className={styles.section}>
          <div className={styles.contract}>
            <div>
              <div className={styles.kickerLight}>Compatibility anchor</div>
              <h2>TableState Contract</h2>
              <p>
                Storage можно сделать своим и без zustand. Но serialized state сохраняем совместимым, чтобы front мог
                читать старые настройки таблиц.
              </p>
            </div>
            <ol>
              {tableStateContract.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>
        </div>
      </main>
    </ShKitProvider>
  );
}

const SectionHeader = ({ title, text }: { title: string; text: string }) => {
  return (
    <header className={styles.sectionHeader}>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}

const DocPanel = ({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) => {
  return (
    <section className={styles.docPanel}>
      <div className={styles.docPanelHeader}>
        <h2>{title}</h2>
        <code>{meta}</code>
      </div>
      {children}
    </section>
  );
}

const ListBlock = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className={styles.listBlock}>
      <h4>{title}</h4>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  page: style({
    background: color.surfaceMuted,
    color: color.text,
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    minHeight: "100vh"
  }),
  content: style({
    minWidth: 0,
    padding: space[48]
  }),
  hero: style({
    margin: "0 auto 32px",
    maxWidth: 1240,
    padding: `${space[40]}px 0 ${space[24]}px`,
    $nest: {
      "& h1": {
        fontSize: 60,
        fontWeight: typography.titleWeight,
        letterSpacing: 0,
        lineHeight: 1.02,
        margin: 0,
        maxWidth: 1040
      },
      "& p": {
        color: color.textMuted,
        fontSize: 20,
        lineHeight: 1.55,
        margin: `${space[24]}px 0 0`,
        maxWidth: 860
      }
    }
  }),
  kicker: style({
    color: color.primary,
    fontSize: 15,
    fontWeight: 900,
    marginBottom: space[16],
    textTransform: "uppercase"
  }),
  kickerLight: style({
    color: palette.babyGreen,
    fontSize: 13,
    fontWeight: 900,
    marginBottom: space[12],
    textTransform: "uppercase"
  }),
  heroActions: style({
    display: "flex",
    flexWrap: "wrap",
    gap: space[12],
    marginTop: space[32]
  }),
  foundation: style({
    display: "grid",
    gap: space[16],
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(340px, 0.75fr)",
    margin: "0 auto 40px",
    maxWidth: 1240
  }),
  docPanel: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.card,
    padding: space[24]
  }),
  docPanelHeader: style({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: space[16],
    $nest: {
      "& h2": {
        fontSize: 28,
        margin: 0
      },
      "& code": {
        color: color.textSubtle
      }
    }
  }),
  paletteGrid: style({
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
  }),
  swatch: (background: string) =>
    style({
      background,
      borderRadius: radius.md,
      color: readableColor(background),
      display: "flex",
      flexDirection: "column",
      fontWeight: 800,
      justifyContent: "space-between",
      minHeight: 112,
      padding: space[14] ?? 14
    }),
  stepList: style({
    margin: 0,
    paddingLeft: 22,
    $nest: {
      "& li": {
        lineHeight: 1.45,
        marginBottom: space[12]
      }
    }
  }),
  section: style({
    margin: "0 auto 40px",
    maxWidth: 1240
  }),
  sectionHeader: style({
    marginBottom: space[18] ?? 18,
    $nest: {
      "& h2": {
        fontSize: 34,
        lineHeight: 1.1,
        margin: 0
      },
      "& p": {
        color: color.textMuted,
        fontSize: 16,
        lineHeight: 1.5,
        margin: `${space[8]}px 0 0`,
        maxWidth: 760
      }
    }
  }),
  liveActions: style({
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: space[12]
  }),
  livePage: style({
    background: color.surface,
    boxSizing: "border-box",
    height: "100vh",
    position: "relative"
  }),
  livePageToolbar: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    boxSizing: "border-box",
    cursor: "grab",
    display: "grid",
    gap: space[8],
    maxWidth: "calc(100vw - 24px)",
    minWidth: 340,
    padding: space[8],
    position: "absolute",
    width: 420,
    zIndex: zIndexVar("liveDemoToolbar", 800),
    $nest: {
      "&:active": {
        cursor: "grabbing"
      },
      "& button": {
        cursor: "pointer"
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        minWidth: 0,
        width: "calc(100vw - 24px)"
      }
    }
  }),
  livePageToolbarTop: style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto"
  }),
  livePageToolbarBottom: style({
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    minWidth: 0,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        gridTemplateColumns: "minmax(0, 1fr)"
      }
    }
  }),
  livePageControlsDock: style({
    left: space[12],
    position: "absolute",
    top: space[12],
    zIndex: zIndexVar("liveDemoToolbar", 800)
  }),
  cardsGrid: style({
    display: "grid",
    gap: space[16],
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
  }),
  componentCard: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.card,
    padding: space[22] ?? 22,
    $nest: {
      "& h3": {
        fontSize: 28,
        lineHeight: 1.15,
        margin: 0
      }
    }
  }),
  cardTopline: style({
    alignItems: "center",
    display: "flex",
    gap: space[12],
    justifyContent: "space-between",
    marginBottom: space[14] ?? 14,
    $nest: {
      "& code": {
        color: color.textMuted,
        fontSize: 12,
        textAlign: "right"
      }
    }
  }),
  status: style({
    borderRadius: radius.sm,
    fontSize: 12,
    fontWeight: 900,
    padding: `${space[6]}px ${space[10]}px`
  }),
  source: style({
    color: color.textSubtle,
    fontSize: 13,
    margin: `${space[8]}px 0 0`
  }),
  summary: style({
    fontSize: 16,
    lineHeight: 1.5,
    margin: `${space[16]}px 0`
  }),
  cardColumns: style({
    display: "grid",
    gap: space[12],
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
  }),
  listBlock: style({
    background: color.surfaceMuted,
    borderRadius: radius.md,
    padding: space[14] ?? 14,
    $nest: {
      "& h4": {
        color: color.primary,
        fontSize: 14,
        margin: `0 0 ${space[10]}px`
      },
      "& ul": {
        margin: 0,
        paddingLeft: 18
      },
      "& li": {
        fontSize: 13,
        lineHeight: 1.35,
        marginBottom: 7
      }
    }
  }),
  contract: style({
    background: color.primary,
    borderRadius: radius.md,
    boxShadow: shadow.card,
    color: color.surface,
    display: "grid",
    gap: space[28] ?? 28,
    gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
    padding: space[28] ?? 28,
    $nest: {
      "& h2": {
        fontSize: 34,
        margin: 0
      },
      "& p": {
        color: color.surfaceMuted,
        lineHeight: 1.5
      },
      "& ol": {
        margin: 0,
        paddingLeft: 24
      },
      "& li": {
        fontSize: 16,
        lineHeight: 1.45,
        marginBottom: 12
      }
    }
  })
  ,
  docsGrid: style({
    display: "grid",
    gap: space[20]
  }),
  docCard: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.card,
    padding: space[24]
  }),
  docIntro: style({
    display: "grid",
    gap: space[24],
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.78fr)",
    marginBottom: space[20],
    $nest: {
      "& h3": {
        fontSize: 34,
        lineHeight: 1.1,
        margin: `${space[10]}px 0 ${space[10]}px`
      },
      "& p": {
        color: color.textMuted,
        fontSize: 16,
        lineHeight: 1.5,
        margin: 0
      }
    }
  }),
  importLine: style({
    color: color.primary,
    fontWeight: 800
  }),
  docPreview: style({
    alignItems: "center",
    background: color.surfaceMuted,
    borderRadius: radius.md,
    display: "flex",
    justifyContent: "center",
    minHeight: 190,
    padding: space[18]
  }),
  previewStack: style({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space[10],
    justifyContent: "center"
  }),
  previewNarrow: style({
    width: "100%",
    maxWidth: 360
  }),
  docPanelPreview: style({
    width: "100%",
    maxWidth: 340,
    boxShadow: "0 12px 28px rgba(25, 25, 25, 0.12)"
  }),
  scanPreviewItem: style({
    display: "grid",
    gap: space[8],
    marginBottom: space[14],
    $nest: {
      "& strong": {
        fontSize: 20
      },
      "& div": {
        background: "linear-gradient(135deg, #c79b72, #e7d1ad 45%, #8aac80)",
        borderRadius: radius.sm,
        height: 82
      }
    }
  }),
  tableStatePreview: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 12px 28px rgba(25, 25, 25, 0.08)",
    display: "grid",
    gap: space[12],
    maxWidth: 420,
    padding: space[16],
    width: "100%",
    $nest: {
      "& > div:first-child": {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between"
      },
      "& strong": {
        color: color.primary,
        fontSize: 18
      },
      "& span": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 700
      }
    }
  }),
  stateColumns: style({
    display: "flex",
    gap: 4,
    overflow: "hidden",
    $nest: {
      "& span": {
        background: color.primary,
        borderRadius: radius.xs,
        color: color.surface,
        flexShrink: 0,
        padding: `${space[8]}px ${space[10]}px`
      }
    }
  }),
  docDetails: style({
    display: "grid",
    gap: space[12],
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    marginBottom: space[18]
  }),
  docBlock: style({
    background: color.surfaceMuted,
    borderRadius: radius.md,
    padding: space[16],
    $nest: {
      "& h4": {
        color: color.primary,
        fontSize: 15,
        margin: `0 0 ${space[10]}px`
      },
      "& ul": {
        margin: 0,
        paddingLeft: 18
      },
      "& li": {
        fontSize: 14,
        lineHeight: 1.45,
        marginBottom: 6
      }
    }
  }),
  propsTable: style({
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    overflow: "hidden"
  }),
  propsHead: style({
    background: color.primary,
    color: color.surface,
    display: "grid",
    fontSize: 13,
    fontWeight: 900,
    gridTemplateColumns: "0.7fr 1.35fr 0.65fr 1.6fr",
    $nest: {
      "& span": {
        padding: `${space[10]}px ${space[12]}px`
      }
    }
  }),
  propsRow: style({
    borderTop: `1px solid ${color.border}`,
    display: "grid",
    gridTemplateColumns: "0.7fr 1.35fr 0.65fr 1.6fr",
    $nest: {
      "& > *": {
        padding: `${space[10]}px ${space[12]}px`,
        fontSize: 13,
        lineHeight: 1.35
      },
      "& code": {
        color: color.primary
      }
    }
  }),
  codeBlock: style({
    background: palette.black,
    borderRadius: radius.md,
    color: color.surface,
    margin: `${space[16]}px 0 0`,
    overflow: "auto",
    padding: space[16],
    $nest: {
      "& code": {
        fontSize: 13,
        lineHeight: 1.55
      }
    }
  })
};

style(
  media(
    { maxWidth: 1050 },
    {
      [`.${styles.foundation}`]: {
        gridTemplateColumns: "1fr"
      },
      [`.${styles.cardsGrid}`]: {
        gridTemplateColumns: "1fr"
      },
      [`.${styles.cardColumns}`]: {
        gridTemplateColumns: "1fr"
      },
      [`.${styles.contract}`]: {
        gridTemplateColumns: "1fr"
      },
      [`.${styles.page}`]: {
        gridTemplateColumns: "220px minmax(0, 1fr)"
      },
      [`.${styles.content}`]: {
        padding: space[28]
      }
    }
  )
);

style(
  media(
    { maxWidth: 760 },
    {
      [`.${styles.page}`]: {
        gridTemplateColumns: "1fr"
      },
      [`.${styles.content}`]: {
        padding: space[18]
      }
    }
  )
);

const readableColor = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? palette.black : palette.white;
}

export default App;
