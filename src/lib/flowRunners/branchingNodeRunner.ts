import type { Node } from "reactflow";
import { runNode } from "./runNode";
import type { BranchingNodeData } from "@/components/FlowEditor/Nodes/BranchingNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type BranchingNode = Node<BranchingNodeData, "branching">;

function checkCondition(
  a: FormCraft.CraftAnswer,
  b: string,
  operator: FormCraft.BranchingConditionType
) {
  switch (operator) {
    case "eq":
      return String(a).toLowerCase() === String(b).toLowerCase();
    case "neq":
      return String(a).toLowerCase() !== String(b).toLowerCase();
    case "gt":
      return Number(a) > Number(b);
    case "lt":
      return Number(a) < Number(b);
    case "gte":
      return Number(a) >= Number(b);
    case "lte":
      return Number(a) <= Number(b);
    case "contains":
      return String(a).toLowerCase().includes(String(b).toLowerCase());
    case "not_contains":
      return !String(a).toLowerCase().includes(String(b).toLowerCase());
    case "starts_with":
      return String(a).toLowerCase().startsWith(String(b).toLowerCase());
    case "ends_with":
      return String(a).toLowerCase().endsWith(String(b).toLowerCase());

    default:
      return false;
  }
}

export function branchingNodeRunner(
  node: BranchingNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions } = data;
  // const { answers, variables } = draftState;

  let metCondition: FormCraft.BranchingCondition | undefined;

  for (let condition of conditions) {
    if (condition.source === "input") {
      if (checkCondition(input, condition.value, condition.condition)) {
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
