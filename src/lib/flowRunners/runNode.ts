import type { Node } from "reactflow";
import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import type { AndNode } from "./andNodeRunner";
import { andNodeRunner } from "./andNodeRunner";
import type { AndV2Node } from "./andV2NodeRunner";
import { andV2NodeRunner } from "./andV2NodeRunner";
import type { BranchingNode } from "./branchingNodeRunner";
import { branchingNodeRunner } from "./branchingNodeRunner";
import type { BranchingV2Node } from "./branchingV2NodeRunner";
import { branchingV2NodeRunner } from "./branchingV2NodeRunner";
import type { EndPageNode } from "./endPageNodeRunner";
import { endPageNodeRunner } from "./endPageNodeRunner";
import type { OrNode } from "./orNodeRunner";
import { orNodeRunner } from "./orNodeRunner";
import type { OrV2Node } from "./orV2NodeRunner";
import { orV2NodeRunner } from "./orV2NodeRunner";
import type { PageNode } from "./pageNodeRunner";
import { pageNodeRunner } from "./pageNodeRunner";
import type { SetVariableNode } from "./setVariableNode";
import { setVariableNodeRunner } from "./setVariableNode";

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

    case "endPage":
      endPageNodeRunner(node as EndPageNode, input, state, draft);
      break;

    case "branching":
      branchingNodeRunner(node as BranchingNode, input, state, draft);
      break;

    case "branchingV2":
      branchingV2NodeRunner(node as BranchingV2Node, input, state, draft);
      break;

    case "setVariable":
      setVariableNodeRunner(node as SetVariableNode, input, state, draft);
      break;

    case "and":
      andNodeRunner(node as AndNode, input, state, draft);
      break;

    case "andV2":
      andV2NodeRunner(node as AndV2Node, input, state, draft);
      break;

    case "or":
      orNodeRunner(node as OrNode, input, state, draft);
      break;

    case "orV2":
      orV2NodeRunner(node as OrV2Node, input, state, draft);
      break;

    default:
      console.log("Unknown node type", node.type);
      return;
  }
}
