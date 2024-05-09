import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { SmallSwitch } from "@/components/ui/small-switch";

interface Props {
  label: ReactNode;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SwitchField(props: Props) {
  const { label, name, checked, onCheckedChange } = props;

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={name}>{label}</Label>
      <SmallSwitch
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
