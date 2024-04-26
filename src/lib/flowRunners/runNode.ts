import type { Node } from "reactflow";
import type { BranchingNode } from "./branchingNodeRunner";
import { branchingNodeRunner } from "./branchingNodeRunner";
import type { PageNode } from "./pageNodeRunner";
import { pageNodeRunner } from "./pageNodeRunner";
import type { SetVariableNode } from "./setVariableNode";
import { setVariableNodeRunner } from "./setVariableNode";
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

    case "setVariable":
      setVariableNodeRunner(node as SetVariableNode, input, state, draft);
      break;

    default:
      console.log("Unknown node type", node.type);
      return;
  }
}
