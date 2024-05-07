import type { Node } from "reactflow";
import type { EndPageNodeData } from "@/components/FlowEditor/Nodes/EndPageNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type EndPageNode = Node<EndPageNodeData, "endPage">;

export function endPageNodeRunner(
  node: EndPageNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  draftState.currentNodeId = node.id;
  draftState.currentPageId = node.data.pageId;
}
