import { Label } from "@/components/ui/label";
import { HSLToHex, hexToHSL } from "@/lib/color";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput(props: Props) {
  const { label, value, onChange } = props;

  return (
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
      <input
        type="color"
        value={HSLToHex(value)}
        className="size-8 bg-transparent"
        onChange={(e) => onChange(hexToHSL(e.target.value))}
      />
    </div>
  );
}
