import type { Node } from "reactflow";
import type { BranchingV2NodeData } from "@/components/FlowEditor/Nodes/BranchingV2Node";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { checkConditionV2 } from "./checkConditionV2";
import { runNode } from "./runNode";

export type BranchingV2Node = Node<BranchingV2NodeData, "branchingV2">;

export function branchingV2NodeRunner(
  node: BranchingV2Node,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;

  let metCondition: Condition.ConditionItem | undefined;

  for (let condition of conditions) {
    if (condition.sourceType === "variable") {
      return;
    }

    if (checkConditionV2(draftState, condition)) {
      metCondition = condition;
      break;
    }
  }

  const matchingEdge = metCondition
    ? edges.find((edge) => edge.sourceHandle === metCondition.id)
    : edges.find(
        (edge) => edge.source === node.id && edge.sourceHandle === "default"
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
