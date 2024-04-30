import { Yellowtail } from "next/font/google";
import { cn } from "@/lib/utils";

const sarina = Yellowtail({
  weight: "400",
  subsets: ["latin"],
});

export function Logo() {
  return (
    <div className="flex items-center">
      <span
        className={cn(
          "text-2xl underline-offset-4 underline decoration-emerald-500",
          sarina.className
        )}
      >
        Formcraft
      </span>
    </div>
  );
}
