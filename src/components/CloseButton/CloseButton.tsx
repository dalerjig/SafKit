import { type ButtonHTMLAttributes } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";

export type CloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label?: string;
};

export const CloseButton = ({ label = "Закрыть", ...props }: CloseButtonProps) => {
  return <Button square size="sm" variant="ghost" aria-label={label} icon={<Icon name="close" size={18} />} {...props} />;
}
