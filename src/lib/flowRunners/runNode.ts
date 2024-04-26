import type { Node } from "reactflow";
import type { BranchingNode } from "./branchingNodeRunner";
import { branchingNodeRunner } from "./branchingNodeRunner";
import type { PageNode } from "./pageNodeRunner";
import { pageNodeRunner } from "./pageNodeRunner";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";

export function runNode<T>(
  node: Node<T>,
  input: FormCraft.CraftAnswer,
  state: ViewCraftStoreState,
  draft: ViewCraftStoreState
) {
  switch (node.type) {
    case "page":
      pageNodeRunner(node as PageNode, input, state, draft);
      break;

    case "branching":
      branchingNodeRunner(node as BranchingNode, input, state, draft);
      break;

    default:
      return;
  }
}
