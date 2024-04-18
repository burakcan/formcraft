import type { HandleProps } from "reactflow";
import {
  Handle,
  getConnectedEdges,
  useEdges,
  useNodeId,
  useReactFlow,
} from "reactflow";

export function SingleConnectionHandle(
  props: HandleProps & {
    style: React.CSSProperties;
  }
) {
  const flow = useReactFlow();
  const edges = useEdges();
  const nodeId = useNodeId();
  const node = flow.getNode(nodeId!);
  const connectedEdges = getConnectedEdges(node ? [node] : [], edges);

  const connected = connectedEdges.some(
    (edge) => edge.source === nodeId && edge.sourceHandle === props.id
  );

  return <Handle {...props} isConnectable={!connected} />;
}
