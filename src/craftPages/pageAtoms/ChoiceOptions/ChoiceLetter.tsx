import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  active?: boolean;
}

export function ChoiceLetter(props: Props) {
  const { index, active } = props;

  const letter = useMemo(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let a = index; a >= 0; a = Math.floor(a / 26) - 1) {
      result = alphabet[a % 26] + result;
    }

    return result;
  }, [index]);

  return (
    <span
      className={cn(
        "flex-none text-[10px] size-6 bg-background ml-2 flex items-center justify-center rounded",
        {
          "bg-craft-answers text-background": active,
        }
      )}
    >
      {letter}
    </span>
  );
}
