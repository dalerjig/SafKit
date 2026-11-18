import { Button } from "../../components";
import type { ComponentDoc, ComponentDocPreviewContext } from "../../componentDocs";

export const getTableStateDoc = ({ styles }: ComponentDocPreviewContext): ComponentDoc  => {
  return {
    id: "table-state",
    name: "TableState",
    importCode: 'import { TableState, createMemoryTableStateStorage } from "@ShKit";',
    description:
      "Совместимая модель состояния таблицы. Хранит ширины, порядок, скрытие колонок, filters и pinnedColumnId без зависимости от zustand или front services.",    props: [
      { name: "constructor", type: "(tableId: string, columns: TableColumn[])", description: "Создает runtime state по колонкам." },
      { name: "serializeTableState", type: "() => TableSerializedState", description: "Возвращает совместимый объект для сохранения." },
      { name: "deserializeTableState", type: "(state: TableSerializedState) => void", description: "Восстанавливает состояние из старого или нового storage." },
      { name: "setColumnWidth", type: "(columnId: string, width: number) => void", description: "Меняет ширину колонки." },
      { name: "setColumnHidden", type: "(columnId: string, hidden: boolean) => void", description: "Скрывает или показывает колонку." },
      { name: "setPinnedColumnId", type: "(columnId: string | null) => void", description: "Фиксирует колонку слева." }
    ],    usageCode: `const tableState = new TableState("analytics", columns);
tableState.deserializeTableState(savedState);
tableState.setColumnWidth("area", 160);

await storage.save("analytics", tableState.serializeTableState());`,
    preview: (
      <div className={styles.tableStatePreview}>
        <div>
          <strong>analytics</strong>
          <span>pinnedColumnId: name</span>
        </div>
        <div className={styles.stateColumns}>
          <span style={{ width: 120 }}>name</span>
          <span style={{ width: 84 }}>area</span>
          <span style={{ width: 104 }}>volume</span>
        </div>
        <Button size="sm" variant="secondary">serialize</Button>
      </div>
    )
  };
}
