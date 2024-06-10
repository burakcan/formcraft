import type { Node } from "reactflow";
import type { OrV2NodeData } from "@/components/FlowEditor/Nodes/OrV2Node";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { checkConditionV2 } from "./checkConditionV2";
import { runNode } from "./runNode";

export type OrV2Node = Node<OrV2NodeData, "orV2">;

export function orV2NodeRunner(
  node: OrV2Node,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;

  let someConditionsMet = false;

  for (let condition of conditions) {
    if (condition.sourceType === "variable") {
      return;
    }

    if (checkConditionV2(draftState, condition)) {
      someConditionsMet = true;
      break;
    }
  }

  const matchedHandle = someConditionsMet ? "true" : "false";

  const matchingEdge = edges.find(
    (edge) => edge.source === node.id && edge.sourceHandle === matchedHandle
  );

  if (!matchingEdge) {
    return;
  }

  const nextNode = nodes.find((node) => node.id === matchingEdge.target);

  if (!nextNode) {
    return;
  }

  runNode(nextNode, input, state, draftState);
}
