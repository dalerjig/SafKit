import { type ReactNode, useState } from "react";
import { style } from "typestyle";
import { color, radius, shadow, space } from "../../tokens";
import { useShKitLocale } from "../../provider";
import { Button } from "../Button";
import { Popover } from "../Popover";

export type PopconfirmProps = {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
};

export const Popconfirm = ({
  trigger,
  title,
  description,
  confirmText,
  cancelText,
  danger,
  disabled,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  className
}: PopconfirmProps) => {
  const { messages } = useShKitLocale();
  const [innerOpen, setInnerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isOpen = open ?? innerOpen;

  const setOpen = (nextOpen: boolean) => {
    if (disabled) return;
    setInnerOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const cancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const confirm = () => {
    const result = onConfirm?.();
    if (result && typeof result.then === "function") {
      setLoading(true);
      void result.finally(() => {
        setLoading(false);
        setOpen(false);
      });
      return;
    }

    setOpen(false);
  };

  return (
    <Popover trigger={trigger} open={isOpen} onOpenChange={setOpen} className={className}>
      <div className={popconfirmStyles.panel} role="alertdialog" aria-modal="false">
        <div className={popconfirmStyles.title}>{title}</div>
        {description && <div className={popconfirmStyles.description}>{description}</div>}
        <div className={popconfirmStyles.actions}>
          <Button size="sm" variant="secondary" onClick={cancel} disabled={loading}>
            {cancelText === undefined ? messages.popconfirm.cancel : cancelText}
          </Button>
          <Button size="sm" variant={danger ? "danger" : "primary"} onClick={confirm} loading={loading}>
            {confirmText === undefined ? messages.popconfirm.confirm : confirmText}
          </Button>
        </div>
      </div>
    </Popover>
  );
}

const popconfirmStyles = {
  panel: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    boxSizing: "border-box",
    color: color.text,
    display: "grid",
    gap: space[10],
    maxWidth: "min(320px, calc(100vw - 24px))",
    padding: space[12],
    width: 280
  }),
  title: style({
    color: color.primary,
    fontSize: 15,
    fontWeight: 900,
    lineHeight: 1.25
  }),
  description: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.35
  }),
  actions: style({
    display: "flex",
    gap: space[8],
    justifyContent: "flex-end"
  })
};
