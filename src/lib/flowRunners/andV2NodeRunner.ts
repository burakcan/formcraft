import type { Node } from "reactflow";
import type { AndV2NodeData } from "@/components/FlowEditor/Nodes/AndV2Node";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { checkConditionV2 } from "./checkConditionV2";
import { runNode } from "./runNode";

export type AndV2Node = Node<AndV2NodeData, "andV2">;

export function andV2NodeRunner(
  node: AndV2Node,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;

  let allConditionsMet = true;

  for (let condition of conditions) {
    if (condition.sourceType === "variable") {
      return;
    }

    if (!checkConditionV2(draftState, condition)) {
      allConditionsMet = false;
      break;
    }
  }

  const matchedHandle = allConditionsMet ? "true" : "false";

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
