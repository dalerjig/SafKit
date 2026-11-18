import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { media, style } from "typestyle";
import type { ComponentDoc } from "../componentDocs";
import type { ComponentCard } from "../designSystemData";
import { color, radius, scrollbar, shadow, space, zIndex } from "../tokens";
import { Button, Card, Collapse, Flow, Input, Tag } from "../components";

export type DocsNavigationProps = {
  docs: ComponentDoc[];
  componentCards: ComponentCard[];
};

const primaryLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#live-layout", label: "Live layout" },
  { href: "#docs", label: "Docs" },
  { href: "#components", label: "Components" },
  { href: "#table-state", label: "TableState" }
];

const docGroups = [
  { title: "Foundation", ids: ["provider", "responsive", "layout-primitives", "icon", "icons", "button"] },
  { title: "Road signs", ids: ["road-icon"] },
  { title: "Inputs & Forms", ids: ["fields", "filters", "date-input", "form", "checkbox", "switch", "radio-group", "segmented-control", "slider", "range-slider", "color-picker", "upload"] },
  { title: "Feedback", ids: ["alert", "error-display", "toast", "spinner", "skeleton", "empty", "result"] },
  { title: "Overlays", ids: ["tooltip", "dropdown-menu", "popover", "modal", "popconfirm"] },
  { title: "Data Display", ids: ["card", "description", "badge", "tag", "collapse", "tabs", "image-preview", "table", "table-state"] },
  { title: "Navigation & Shell", ids: ["breadcrumbs", "element-group", "layout", "right-panel", "header", "sidebar", "file-folder"] }
] as const;

const cardGroups = [
  {
    title: "Overlays",
    names: ["Nested Menu"]
  },
  {
    title: "Data & Files",
    names: ["Upload Transport Adapter"]
  },
  {
    title: "Research",
    names: ["Gantt"]
  }
] as const;

export const DocsNavigation = ({ docs, componentCards }: DocsNavigationProps) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const normalizedQuery = normalizeSearch(query);
  const isSearching = normalizedQuery.length > 0;
  const filteredDocs = useMemo(
    () => (isSearching ? docs.filter(doc => matchesDoc(doc, normalizedQuery)) : docs),
    [docs, isSearching, normalizedQuery]
  );
  const filteredCards = useMemo(
    () => (isSearching ? componentCards.filter(card => matchesCard(card, normalizedQuery)) : componentCards),
    [componentCards, isSearching, normalizedQuery]
  );
  const resultCount = filteredDocs.length + filteredCards.length;

  useEffect(() => {
    if (!searchOpen) return undefined;

    searchInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <aside className={styles.root} aria-label="ShKit documentation navigation">
      <a className={styles.logo} href="#overview">Sh</a>

      <nav className={styles.nav}>
        <div className={styles.searchRoot}>
          <Button className={styles.searchButton} size="sm" variant="outline" onClick={() => setSearchOpen(true)}>
            <span>Search</span>
            <kbd>/</kbd>
          </Button>

          {searchOpen && (
            <Card className={styles.searchPopup} role="dialog" aria-label="Search documentation" variant="elevated" padding="sm">
              <Flow className={styles.searchPopupContent} gap={10}>
                <Flow mode="horizontal" gap={8}>
                  <Input
                    ref={searchInputRef}
                    aria-label="Search documentation"
                    placeholder="Search components, props..."
                    value={query}
                    size="sm"
                    onChange={event => setQuery(event.currentTarget.value)}
                  />
                  <Button size="sm" variant="secondary" onClick={() => setSearchOpen(false)}>Close</Button>
                </Flow>
                <div className={styles.searchMeta}>
                  {isSearching ? <Tag size="sm" tone="info">{resultCount} results</Tag> : "Type to search docs and component cards"}
                </div>
                <div className={styles.searchResults}>
                  <SearchResultGroup title="Docs" emptyText="No component docs found">
                    {(isSearching ? filteredDocs : docs.slice(0, 8)).map(doc => (
                      <a key={doc.id} href={`#doc-${doc.id}`} onClick={() => setSearchOpen(false)}>
                        <strong>{doc.name}</strong>
                        <span>{doc.importCode}</span>
                        <small>{doc.description}</small>
                      </a>
                    ))}
                  </SearchResultGroup>
                  <SearchResultGroup title="Cards" emptyText="No component cards found">
                    {(isSearching ? filteredCards : componentCards.slice(0, 8)).map(component => (
                      <a key={component.name} href={`#${getComponentCardAnchorId(component.name)}`} onClick={() => setSearchOpen(false)}>
                        <strong>{component.name}</strong>
                        <span>{component.futureImport}</span>
                        <small>{component.summary}</small>
                      </a>
                    ))}
                  </SearchResultGroup>
                </div>
              </Flow>
            </Card>
          )}
        </div>

        <NavGroup title="Sections" defaultOpen>
          {primaryLinks.map(link => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </NavGroup>

        <NavGroup title="Component Docs" defaultOpen>
          {groupDocs(docs).map(group => (
              <NavGroup key={group.title} title={group.title} nested defaultOpen={group.defaultOpen}>
                {group.items.map(doc => (
                  <a key={doc.id} href={`#doc-${doc.id}`}>
                    <span>{doc.name}</span>
                    <small>{getDocMeta(doc)}</small>
                  </a>
                ))}
              </NavGroup>
            ))}
        </NavGroup>

        <NavGroup title="Cards" defaultOpen={false}>
          {groupCards(componentCards).map(group => (
              <NavGroup key={group.title} title={group.title} nested>
                {group.items.map(component => (
                  <a key={component.name} href={`#${getComponentCardAnchorId(component.name)}`}>
                    <span>{component.name}</span>
                    <small>{component.status}</small>
                  </a>
                ))}
              </NavGroup>
            ))}
        </NavGroup>
      </nav>
    </aside>
  );
}

export const getComponentCardAnchorId = (name: string) => {
  return `component-${name.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
}

const NavGroup = ({
  title,
  children,
  defaultOpen = false,
  forceOpen,
  nested
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  nested?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const visible = forceOpen ?? open;

  return (
    <Collapse
      className={nested ? styles.nestedCollapse : styles.navCollapse}
      activeIds={visible ? [title] : []}
      onChange={ids => setOpen(ids.includes(title))}
      items={[
        {
          id: title,
          title,
          content: <div className={styles.links}>{children}</div>
        }
      ]}
    />
  );
}

const SearchResultGroup = ({ title, children, emptyText }: { title: string; children: ReactNode; emptyText: string }) => {
  const hasResults = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className={styles.searchResultGroup}>
      <h3>{title}</h3>
      <div>{hasResults ? children : <span className={styles.emptySearch}>{emptyText}</span>}</div>
    </section>
  );
}

const normalizeSearch = (value: string) => {
  return value.trim().toLowerCase();
}

const matchesDoc = (doc: ComponentDoc, query: string) => {
  return normalizeSearch([
    doc.name,
    doc.id,
    doc.importCode,
    doc.description,
    doc.props.map(prop => `${prop.name} ${prop.type} ${prop.description}`).join(" ")
  ].join(" ")).includes(query);
}

const matchesCard = (card: ComponentCard, query: string) => {
  return normalizeSearch([
    card.name,
    card.futureImport,
    card.source,
    card.status,
    card.summary,
    card.responsibilities.join(" "),
    card.apiNotes.join(" ")
  ].join(" ")).includes(query);
}

const groupDocs = (docs: ComponentDoc[]) => {
  const byId = new Map(docs.map(doc => [doc.id, doc]));
  const usedIds = new Set<string>();
  const groups = docGroups
    .map((group, index) => {
      const items = group.ids.flatMap(id => {
        const doc = byId.get(id);
        if (!doc) return [];
        usedIds.add(id);
        return [doc];
      });

      return {
        title: group.title,
        items,
        defaultOpen: index === 0
      };
    })
    .filter(group => group.items.length > 0);
  const ungrouped = docs.filter(doc => !usedIds.has(doc.id));

  return ungrouped.length > 0
    ? [...groups, { title: "Other", items: ungrouped, defaultOpen: false }]
    : groups;
}

const groupCards = (cards: ComponentCard[]) => {
  const byName = new Map(cards.map(card => [card.name, card]));
  const usedNames = new Set<string>();
  const groups = cardGroups
    .map(group => {
      const items = group.names.flatMap(name => {
        const card = byName.get(name);
        if (!card) return [];
        usedNames.add(name);
        return [card];
      });

      return {
        title: group.title,
        items
      };
    })
    .filter(group => group.items.length > 0);
  const ungrouped = cards.filter(card => !usedNames.has(card.name));

  return ungrouped.length > 0 ? [...groups, { title: "Other", items: ungrouped }] : groups;
}

const getDocMeta = (doc: ComponentDoc) => {
  if (doc.props.length === 1) return "1 prop";
  return `${doc.props.length} props`;
}

const styles = {
  root: style({
    alignSelf: "start",
    background: color.primary,
    borderRight: `1px solid ${color.primaryHover}`,
    boxSizing: "border-box",
    boxShadow: shadow.card,
    color: color.surface,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: "100vh",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "auto",
    padding: `${space[16]}px ${space[12]}px`,
    position: "sticky",
    scrollbarColor: "rgba(255,255,255,0.42) transparent",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    top: 0,
    $nest: {
      ...scrollbar,
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255,255,255,0.42)",
        backgroundClip: "padding-box",
        borderLeft: "4px solid transparent"
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255,255,255,0.68)"
      },
      "@supports (height: 100dvh)": {
        height: "100dvh",
        maxHeight: "100dvh"
      }
    }
  }),
  logo: style({
    alignItems: "center",
    background: color.surface,
    borderRadius: radius.sm,
    color: color.primary,
    display: "flex",
    fontSize: 20,
    fontWeight: 900,
    height: 48,
    justifyContent: "center",
    marginBottom: space[18],
    textDecoration: "none",
    width: 48
  }),
  nav: style({
    gap: space[18],
    alignContent: "start",
    display: "grid",
    flex: "0 0 auto",
    height: "auto",
    maxHeight: "none",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "visible",
    paddingRight: space[4],
    "-webkit-overflow-scrolling": "touch"
  }),
  group: style({
    display: "grid",
    gap: space[8]
  }),
  navCollapse: style({
    background: "transparent",
    border: 0,
    borderRadius: 0,
    color: color.surface,
    $nest: {
      "& section": {
        background: "transparent"
      },
      "& section + section": {
        borderTop: 0
      },
      "& button": {
        color: "rgba(255,255,255,0.64)",
        fontSize: 11,
        minHeight: 28,
        padding: `${space[4]}px ${space[6]}px`,
        textTransform: "uppercase"
      },
      "& button:hover:not(:disabled)": {
        background: "rgba(255,255,255,0.08)",
        color: color.surface
      },
      "& div[id^='shkit-collapse-panel'] > div": {
        borderTop: 0,
        padding: 0
      }
    }
  }),
  nestedCollapse: style({
    background: "transparent",
    border: 0,
    borderRadius: 0,
    color: color.surface,
    paddingLeft: space[6],
    $nest: {
      "& section": {
        background: "transparent"
      },
      "& section + section": {
        borderTop: 0
      },
      "& button": {
        color: "rgba(255,255,255,0.62)",
        fontSize: 11,
        minHeight: 26,
        padding: `${space[4]}px ${space[6]}px`,
        textTransform: "uppercase"
      },
      "& button:hover:not(:disabled)": {
        background: "rgba(255,255,255,0.08)",
        color: color.surface
      },
      "& div[id^='shkit-collapse-panel'] > div": {
        borderTop: 0,
        padding: 0
      }
    }
  }),
  searchRoot: style({
    position: "relative"
  }),
  searchButton: style({
    background: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.22)",
    color: color.surface,
    width: "100%",
    $nest: {
      "&:hover": {
        background: "rgba(255,255,255,0.16)",
        borderColor: "rgba(255,255,255,0.34)"
      },
      "& kbd": {
        background: "rgba(255,255,255,0.14)",
        border: `1px solid rgba(255,255,255,0.2)`,
        borderRadius: radius.xs,
        color: "rgba(255,255,255,0.72)",
        fontSize: 11,
        fontWeight: 900,
        minWidth: 22,
        padding: "2px 6px",
        textAlign: "center"
      }
    }
  }),
  searchPopup: style({
    height: "min(680px, calc(100vh - 32px))",
    left: 272,
    minWidth: 540,
    overflow: "hidden",
    position: "fixed",
    top: 16,
    width: "min(620px, calc(100vw - 296px))",
    zIndex: zIndex.docsPopup,
    $nest: {
      "& > div": {
        height: "100%",
        minHeight: 0
      }
    }
  }),
  searchPopupContent: style({
    display: "grid",
    gridTemplateRows: "auto auto minmax(0, 1fr)",
    height: "100%",
    minHeight: 0
  }),
  searchMeta: style({
    color: color.textSubtle,
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase"
  }),
  searchResults: style({
    display: "grid",
    gap: space[12],
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "auto",
    paddingRight: space[4],
    $nest: scrollbar
  }),
  searchResultGroup: style({
    display: "grid",
    gap: space[6],
    $nest: {
      "& h3": {
        color: color.primary,
        fontSize: 12,
        fontWeight: 900,
        margin: 0,
        textTransform: "uppercase"
      },
      "& > div": {
        display: "grid",
        gap: space[4]
      },
      "& a": {
        border: `1px solid ${color.border}`,
        borderRadius: radius.sm,
        color: color.text,
        display: "grid",
        gap: space[4],
        padding: space[10],
        textDecoration: "none"
      },
      "& a:hover": {
        background: color.surfaceMuted,
        borderColor: color.borderStrong
      },
      "& strong": {
        color: color.primary,
        fontSize: 14,
        fontWeight: 900,
        lineHeight: 1.2
      },
      "& span": {
        color: color.textMuted,
        fontFamily: "monospace",
        fontSize: 12,
        fontWeight: 800,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.35,
        overflowWrap: "anywhere"
      }
    }
  }),
  links: style({
    display: "grid",
    gap: 2,
    $nest: {
      "& a": {
        borderRadius: radius.xs,
        color: color.surface,
        display: "grid",
        fontSize: 13,
        fontWeight: 800,
        gap: 2,
        lineHeight: 1.25,
        opacity: 0.78,
        overflow: "hidden",
        padding: `${space[6]}px ${space[8]}px`,
        textDecoration: "none",
        whiteSpace: "nowrap"
      },
      "& a span": {
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      "& a small": {
        color: "rgba(255,255,255,0.5)",
        fontSize: 10,
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        textTransform: "uppercase"
      },
      "& a:hover": {
        background: "rgba(255,255,255,0.12)",
        opacity: 1
      },
      "& a:hover small": {
        color: "rgba(255,255,255,0.72)"
      }
    }
  }),
  emptySearch: style({
    color: color.textSubtle,
    fontSize: 12,
    fontWeight: 800,
    padding: `${space[6]}px ${space[8]}px`
  })
};

style(
  media(
    { maxWidth: 760 },
    {
      [`.${styles.root}`]: {
        height: "auto",
        maxHeight: "min(420px, calc(100dvh - 24px))",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative"
      },
      [`.${styles.nav}`]: {
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        height: "auto",
        maxHeight: "none"
      },
      [`.${styles.searchPopup}`]: {
        height: "calc(100vh - 24px)",
        left: 12,
        minWidth: 0,
        right: 12,
        top: 12,
        width: "auto"
      }
    }
  )
);
