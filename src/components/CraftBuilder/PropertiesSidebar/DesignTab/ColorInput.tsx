import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput(props: Props) {
  const { label, value, onChange } = props;

  return (
    <div className="flex justify-between items-center">
      <Label className="font-normal">{label}</Label>
      <input
        type="color"
        value={value}
        className="size-8 bg-transparent"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
