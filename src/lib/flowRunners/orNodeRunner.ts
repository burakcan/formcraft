import type { Node } from "reactflow";
import { checkCondition } from "./checkCondition";
import { runNode } from "./runNode";
import type { OrNodeData } from "@/components/FlowEditor/Nodes/OrNode/OrNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type OrNode = Node<OrNodeData, "and">;

export function orNodeRunner(
  node: OrNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;
  const { variables } = draftState;

  let someConditionsMet = false;

  for (let condition of conditions) {
    if (condition.source === "input") {
      if (checkCondition(input, condition.value, condition.condition)) {
        someConditionsMet = true;
        break;
      }
    } else if (condition.source === "variable") {
      const variableValue = variables[condition.variableName];

      if (checkCondition(variableValue, condition.value, condition.condition)) {
        someConditionsMet = true;
        break;
      }
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
