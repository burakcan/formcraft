import { Yellowtail } from "next/font/google";
import { cn } from "@/lib/utils";

const sarina = Yellowtail({
  weight: "400",
  subsets: ["latin"],
});

export function Logo(props: { size?: "sm" | "md" | "lg" }) {
  const { size = "md" } = props;
  return (
    <div className="flex items-center">
      <span
        className={cn(
          "text-2xl underline-offset-4 underline decoration-emerald-500",
          size === "sm" && "text-base",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl",
          sarina.className
        )}
      >
        Formcraft
      </span>
    </div>
  );
}
