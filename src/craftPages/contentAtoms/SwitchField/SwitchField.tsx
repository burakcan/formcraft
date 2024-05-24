import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { SmallSwitch } from "@/components/ui/small-switch";

interface Props {
  label: ReactNode;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SwitchField(props: Props) {
  const { label, name, checked, onCheckedChange, disabled } = props;

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={name}>{label}</Label>
      <SmallSwitch
        name={name}
        disabled={disabled}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
