import { XIcon } from "lucide-react";
import type { EdgeProps } from "reactflow";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from "reactflow";
import { Button } from "@/components/ui/button";

export function RemovableEdge(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath] = getSmoothStepPath({
    ...props,
    borderRadius: 8,
    offset: 32,
  });

  const handleRemove = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  };

  return (
    <>
      <BaseEdge
        markerEnd="arrowclosed"
        path={edgePath}
        style={{
          ...props.style,
          stroke: "#000000",
        }}
      />
      <EdgeLabelRenderer>
        <Button
          variant="outline"
          className="size-7 absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full text-xs pointer-events-auto nopan"
          style={{
            top: props.sourceY,
            left: props.sourceX + 15,
          }}
          onClick={handleRemove}
        >
          <XIcon className="size-4" />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
}
