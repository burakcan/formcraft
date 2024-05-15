import type { Node } from "reactflow";
import type { AndNodeData } from "@/components/FlowEditor/Nodes/AndNode/AndNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { checkCondition } from "./checkCondition";
import { runNode } from "./runNode";

export type AndNode = Node<AndNodeData, "and">;

export function andNodeRunner(
  node: AndNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const { data } = node;
  const { conditions = [] } = data;
  const { variables } = draftState;

  let allConditionsMet = true;

  for (let condition of conditions) {
    if (condition.source === "input") {
      if (!checkCondition(input, condition.value, condition.condition)) {
        allConditionsMet = false;
        break;
      }
    } else if (condition.source === "variable") {
      const variableValue = variables[condition.variableName];

      if (
        !checkCondition(variableValue, condition.value, condition.condition)
      ) {
        allConditionsMet = false;
        break;
      }
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
