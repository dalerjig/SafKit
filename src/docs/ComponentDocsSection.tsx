import { useEffect, useState } from "react";
import { style } from "typestyle";
import type { ComponentDoc, PropDoc } from "../componentDocs";
import { color, palette, radius, space } from "../tokens";
import { Button, Card, Flow, Table, Tag } from "../components";
import type { TableColumn, TableRowBase } from "../components";

export type ComponentDocsSectionProps = {
  docs: ComponentDoc[];
};

export const ComponentDocsSection = ({ docs }: ComponentDocsSectionProps) => {
  const getHashOpenId = () => {
    if (typeof window === "undefined") {
      return docs[0]?.id ?? "";
    }

    const hash = window.location.hash.replace("#doc-", "");
    return docs.some(doc => doc.id === hash) ? hash : docs[0]?.id ?? "";
  };
  const [openId, setOpenId] = useState(getHashOpenId);

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#doc-", "");
      if (docs.some(doc => doc.id === hash)) {
        setOpenId(hash);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [docs]);

  return (
    <div className={styles.root}>
      {docs.map(doc => {
        const isOpen = doc.id === openId;

        return (
          <Card key={doc.id} id={`doc-${doc.id}`} as="article" padding="none" variant="elevated" className={styles.item}>
            <button type="button" className={styles.trigger} onClick={() => setOpenId(isOpen ? "" : doc.id)}>
              <span>
                <code>{doc.importCode}</code>
                <strong>{doc.name}</strong>
              </span>
              <span className={styles.triggerRight}>
                <Tag tone={isOpen ? "success" : "info"} size="sm">{doc.props.length} props</Tag>
                <span>{isOpen ? "-" : "+"}</span>
              </span>
            </button>

            {isOpen && (
              <Flow className={styles.content} gap={20}>
                <p className={styles.description}>{doc.description}</p>

                <div className={styles.sectionHeader}>
                  <h4>Preview</h4>
                </div>
                <div className={styles.preview}>{doc.preview}</div>

                <div className={styles.sectionHeader}>
                  <h4>Props</h4>
                  <Tag tone="info" size="sm">{doc.props.length} props</Tag>
                </div>
                <PropsTable docId={doc.id} props={doc.props} />

                <div className={styles.sectionHeader}>
                  <h4>Code</h4>
                  <Button size="sm" variant="secondary">Copy</Button>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{`${doc.importCode}\n\n${doc.usageCode}`}</code>
                </pre>
              </Flow>
            )}
          </Card>
        );
      })}
    </div>
  );
}

type PropTableRow = TableRowBase & {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
  group?: boolean;
};

const propColumns: Array<TableColumn<PropTableRow>> = [
  {
    key: "prop",
    name: "Prop",
    initialWidth: 230,
    minResizeWidth: 160,
    render: ({ data }) => <code className={data.group ? styles.propGroupCode : undefined}>{data.prop}</code>
  },
  {
    key: "type",
    name: "Type",
    initialWidth: 260,
    minResizeWidth: 180,
    render: ({ value }) => <code>{String(value)}</code>
  },
  {
    key: "defaultValue",
    name: "Default",
    initialWidth: 130,
    minResizeWidth: 90,
    render: ({ value }) => <code>{String(value)}</code>
  },
  {
    key: "description",
    name: "Description",
    initialWidth: 430,
    minResizeWidth: 240
  }
];

const PropsTable = ({ docId, props }: { docId: string; props: PropDoc[] }) => {
  return (
    <Table
      id={`docs-props-${docId}`}
      className={styles.propsTable}
      columns={propColumns}
      data={buildPropRows(props)}
      defaultTreeExpanded
      exportEnabled={false}
      filterEnabled={false}
      maxHeight={420}
      nesting
      rowHeight={42}
      toolbar={false}
      virtualized={false}
    />
  );
}

const buildPropRows = (props: PropDoc[]): PropTableRow[]  => {
  const rows: PropTableRow[] = [];
  const groups = new Set<string>();

  for (const prop of props) {
    const [groupName, childName] = prop.name.split(".", 2);
    if (childName) {
      const groupId = `group:${groupName}`;
      if (!groups.has(groupId)) {
        rows.push({
          id: groupId,
          prop: groupName,
          type: "object",
          defaultValue: "-",
          description: `${groupName} nested props.`,
          group: true
        });
        groups.add(groupId);
      }

      rows.push({
        id: prop.name,
        parentId: groupId,
        prop: childName,
        type: prop.type,
        defaultValue: prop.defaultValue ?? "-",
        description: prop.description
      });
    } else {
      rows.push({
        id: prop.name,
        prop: prop.name,
        type: prop.type,
        defaultValue: prop.defaultValue ?? "-",
        description: prop.description
      });
    }
  }

  return rows;
}

const styles = {
  root: style({
    display: "grid",
    gap: space[12]
  }),
  item: style({
    overflow: "hidden"
  }),
  trigger: style({
    alignItems: "center",
    background: color.surface,
    border: 0,
    color: color.text,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    padding: `${space[18]}px ${space[22]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "& code": {
        color: color.primary,
        display: "block",
        fontWeight: 800,
        marginBottom: space[6]
      },
      "& strong": {
        display: "block",
        fontSize: 28,
        lineHeight: 1.1
      },
      "&:hover": {
        background: color.surfaceMuted
      }
    }
  }),
  triggerRight: style({
    alignItems: "center",
    color: color.textMuted,
    display: "flex",
    fontWeight: 800,
    gap: space[14]
  }),
  content: style({
    borderTop: `1px solid ${color.border}`,
    padding: space[22]
  }),
  preview: style({
    alignItems: "center",
    background: color.surfaceMuted,
    borderRadius: radius.md,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    minHeight: 220,
    overflow: "auto",
    padding: space[22],
    width: "100%"
  }),
  propsTable: style({
    borderRadius: radius.md,
    overflow: "hidden"
  }),
  propGroupCode: style({
    fontWeight: 900
  }),
  description: style({
    color: color.textMuted,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.5,
    margin: 0,
    overflowWrap: "anywhere"
  }),
  sectionHeader: style({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginTop: space[4],
    $nest: {
      "& h4": {
        fontSize: 16,
        margin: 0
      }
    }
  }),
  codeBlock: style({
    background: palette.black,
    borderRadius: radius.md,
    color: color.surface,
    margin: `${space[10]}px 0 0`,
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
