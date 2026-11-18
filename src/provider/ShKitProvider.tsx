import { createContext, type CSSProperties, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { style } from "typestyle";
import { messages } from "../i18n/messages";
import type { ShKitLocale, ShKitMessages } from "../i18n/types";
import { typography } from "../tokens";
import { themes, type ShKitTheme, type ShKitThemePreset } from "../tokens/colors";
import { createZIndexVars, type ShKitZIndexTheme } from "../tokens/zIndex";

export type ShKitProviderTheme = ShKitTheme & {
  zIndex?: ShKitZIndexTheme;
};

export type ShKitProviderProps = {
  locale?: ShKitLocale;
  messages?: Partial<ShKitMessages>;
  theme?: ShKitProviderTheme;
  themePreset?: ShKitThemePreset;
  children: ReactNode;
};

const ShKitLocaleContext = createContext<{ locale: ShKitLocale; messages: ShKitMessages }>({
  locale: "ru",
  messages: messages.ru
});

const ShKitPortalContext = createContext<HTMLElement | null>(null);

export const ShKitProvider = ({ locale = "ru", messages: customMessages, theme, themePreset = "shtab", children }: ShKitProviderProps) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const value = useMemo(
    () => ({
      locale,
      messages: mergeMessages(messages[locale], customMessages)
    }),
    [customMessages, locale]
  );
  const themeStyle = useMemo(
    () => ({
      ...createThemeVars({ ...themes[themePreset].color, ...theme?.color }),
      ...createZIndexVars(theme?.zIndex)
    }),
    [theme, themePreset]
  );
  const setPortalHost = useCallback((node: HTMLDivElement | null) => {
    setPortalTarget(node);
  }, []);

  return (
    <ShKitLocaleContext.Provider value={value}>
      <ShKitPortalContext.Provider value={portalTarget}>
        <div className={providerStyles.root} style={themeStyle}>
          {children}
          <div ref={setPortalHost} className={providerStyles.portalHost} />
        </div>
      </ShKitPortalContext.Provider>
    </ShKitLocaleContext.Provider>
  );
}

export const useShKitLocale = () => {
  return useContext(ShKitLocaleContext);
}

export const useShKitPortalTarget = () => {
  return useContext(ShKitPortalContext);
}

const createThemeVars = (themeColor: Record<string, string>) => {
  return Object.fromEntries(
    Object.entries(themeColor).map(([key, value]) => [
      `--shkit-color-${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`,
      value
    ])
  ) as CSSProperties;
}

const mergeMessages = (base: ShKitMessages, overrides?: Partial<ShKitMessages>): ShKitMessages  => {
  if (!overrides) return base;

  return {
    popconfirm: {
      ...base.popconfirm,
      ...overrides.popconfirm
    },
    table: {
      ...base.table,
      ...overrides.table
    },
    actions: {
      ...base.actions,
      ...overrides.actions
    },
    dateInput: {
      ...base.dateInput,
      ...overrides.dateInput
    },
    timePicker: {
      ...base.timePicker,
      ...overrides.timePicker
    }
  };
}

const providerStyles = {
  root: style({
    fontFamily: typography.fontFamily,
    $nest: {
      "& button, & input, & select, & textarea": {
        font: "inherit"
      }
    }
  }),
  portalHost: style({
    fontFamily: "inherit"
  })
};
