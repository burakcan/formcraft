import type { Node } from "reactflow";
import { checkCondition } from "./checkCondition";
import { runNode } from "./runNode";
import type { BranchingNodeData } from "@/components/FlowEditor/Nodes/BranchingNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type BranchingNode = Node<BranchingNodeData, "branching">;

export function branchingNodeRunner(
  node: BranchingNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;
  const { variables } = draftState;

  let metCondition: FormCraft.BranchingCondition | undefined;

  for (let condition of conditions) {
    if (condition.source === "input") {
      if (checkCondition(input, condition.value, condition.condition)) {
        metCondition = condition;
        break;
      }
    } else if (condition.source === "variable") {
      const variableValue = variables[condition.variableName];

      if (checkCondition(variableValue, condition.value, condition.condition)) {
        metCondition = condition;
        break;
      }
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
