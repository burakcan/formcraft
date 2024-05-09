import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  label?: ReactNode;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  name: string;
  placeholder?: string;
  type?: HTMLInputElement["type"];
  max?: number;
  min?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField(props: Props) {
  const { label, placeholder, value, name, onChange, type } = props;

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        type={type}
        className="h-8 mt-1"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
