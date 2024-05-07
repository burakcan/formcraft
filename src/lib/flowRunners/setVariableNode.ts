import { getOutgoers, type Node } from "reactflow";
import { runNode } from "./runNode";
import type { SetVariableNodeData } from "@/components/FlowEditor/Nodes/SetVariableNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type SetVariableNode = Node<SetVariableNodeData, "setVariable">;

export function setVariableNodeRunner(
  node: SetVariableNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  const { edges, nodes } = state.version.data.flow;
  const variableName = node.data.variableName;
  const value = input;

  draftState.variables[variableName] = value;

  const nextNode = getOutgoers(node, nodes, edges)[0];

  if (!nextNode || !nextNode.type) {
    return;
  }

  runNode(nextNode, input, state, draftState);
}
