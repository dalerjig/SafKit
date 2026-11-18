import { type ReactNode, useState } from "react";
import { Dropdown } from "../Dropdown";

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const Popover = ({ trigger, children, open, onOpenChange, className }: PopoverProps) => {
  const [innerOpen, setInnerOpen] = useState(false);
  const isOpen = open ?? innerOpen;

  const setOpen = (nextOpen: boolean) => {
    setInnerOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <Dropdown trigger={trigger} open={isOpen} onOpenChange={setOpen} className={className}>
      {children}
    </Dropdown>
  );
}
