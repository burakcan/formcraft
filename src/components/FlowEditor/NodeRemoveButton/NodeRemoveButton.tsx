import { TrashIcon } from "lucide-react";
import type { Node, ReactFlowInstance } from "reactflow";
import { Button } from "@/components/ui/button";

interface Props {
  node: Partial<Node> & { id: string };
  flow: ReactFlowInstance;
}

export function NodeRemoveButton(props: Props) {
  const { node, flow } = props;

  const handleRemoveNode = () => {
    flow.deleteElements({
      nodes: [node],
      edges: flow
        .getEdges()
        .filter((edge) => edge.source === node.id || edge.target === node.id),
    });
  };

  return (
    <Button
      onClick={handleRemoveNode}
      variant="destructive"
      size="icon"
      className="size-8 absolute -top-4 -left-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <TrashIcon className="size-4" />
    </Button>
  );
}
