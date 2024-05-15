import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props<T> {
  label?: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  selectClassName?: string;
}

export function SelectField<T extends string>(props: Props<T>) {
  const { label, name, value, options, onChange, className, selectClassName } =
    props;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("h-8", selectClassName)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
