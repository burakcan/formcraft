import "./style.css";
import { cn } from "@/lib/utils";

export function BarLoader(props: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("barloader", props.className)} style={props.style} />
  );
}
