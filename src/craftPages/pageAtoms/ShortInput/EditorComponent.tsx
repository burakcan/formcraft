import { Input } from "@/components/ui/input";

interface Props {
  placeholder?: string;
}

export function ShortInputEditor(props: Props) {
  const { placeholder } = props;

  return (
    <div className="w-full px-2 pt-2">
      <Input
        className="text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers"
        placeholder={placeholder || "Type your answer here..."}
        value=""
        readOnly
      />
    </div>
  );
}
