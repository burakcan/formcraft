import type { Node } from "reactflow";
import type { PageNodeData } from "@/components/FlowEditor/Nodes/PageNode";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export type PageNode = Node<PageNodeData, "page">;

export function pageNodeRunner(
  node: PageNode,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draftState: ViewCraftStoreState
) {
  draftState.currentNodeId = node.id;
  draftState.currentPageId = node.data.pageId;
}
