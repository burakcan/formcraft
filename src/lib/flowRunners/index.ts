import { getOutgoers } from "reactflow";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { runNode } from "./runNode";

export function runFlow(
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draft: ViewCraftStoreState
) {
  const { nodes, edges } = state.version.data.flow;
  const currentNode = nodes.find((node) => node.id === state.currentNodeId);

  if (!currentNode) {
    return;
  }

  const nextNode = getOutgoers(currentNode, nodes, edges)[0];

  if (!nextNode || !nextNode.type) {
    return;
  }

  runNode(nextNode, input, state, draft);
}
