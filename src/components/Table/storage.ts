import type { TableSerializedState } from "./types";

export type TableStateStorage = {
  load(tableId: string): TableSerializedState | undefined | Promise<TableSerializedState | undefined>;
  save(tableId: string, state: TableSerializedState): void | Promise<void>;
  reset?(tableId: string): void | Promise<void>;
};

export const createMemoryTableStateStorage = (initialState: TableSerializedState = {}): TableStateStorage  => {
  let state = initialState;

  return {
    load(tableId) {
      return state[tableId] ? { [tableId]: state[tableId] } : undefined;
    },
    save(_tableId, nextState) {
      state = {
        ...state,
        ...nextState
      };
    },
    reset(tableId) {
      const { [tableId]: _removed, ...rest } = state;
      state = rest;
    }
  };
}

export const createLocalTableStateStorage = (storageKey = "shkit:table-state", initialState: TableSerializedState = {}): TableStateStorage  => {
  const getStorage = () => (typeof window === "undefined" ? undefined : window.localStorage);

  const readState = (): TableSerializedState => {
    const storage = getStorage();
    if (!storage) return initialState;

    const rawValue = storage.getItem(storageKey);
    if (!rawValue) return initialState;

    try {
      return JSON.parse(rawValue) as TableSerializedState;
    } catch {
      return initialState;
    }
  };

  const writeState = (state: TableSerializedState) => {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(storageKey, JSON.stringify(state));
  };

  if (getStorage() && !getStorage()?.getItem(storageKey) && Object.keys(initialState).length > 0) {
    writeState(initialState);
  }

  return {
    load(tableId) {
      const state = readState();
      return state[tableId] ? { [tableId]: state[tableId] } : undefined;
    },
    save(_tableId, nextState) {
      writeState({
        ...readState(),
        ...nextState
      });
    },
    reset(tableId) {
      const { [tableId]: _removed, ...rest } = readState();
      writeState(rest);
    }
  };
}
