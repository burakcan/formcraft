import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  label?: ReactNode;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  name: string;
  placeholder?: string;
  type?: HTMLInputElement["type"];
  max?: number;
  min?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperClassName?: string;
  inputClassName?: string;
}

export function InputField(props: Props) {
  const {
    label,
    placeholder,
    value,
    name,
    onChange,
    type,
    wrapperClassName,
    inputClassName,
  } = props;

  return (
    <div className={wrapperClassName}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        type={type}
        className={cn("h-8 mt-1", inputClassName)}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
