import { AndNode } from "./AndNode/AndNode";
import { AndV2Node } from "./AndV2Node";
import { BranchingNode } from "./BranchingNode";
import { BranchingV2Node } from "./BranchingV2Node";
import { EndPageNode } from "./EndPageNode";
import { OrNode } from "./OrNode/OrNode";
import { OrV2Node } from "./OrV2Node";
import { PageNode } from "./PageNode";
import { SetVariableNode } from "./SetVariableNode";

export const nodeTypes = {
  page: PageNode,
  endPage: EndPageNode,
  branching: BranchingNode,
  branchingV2: BranchingV2Node,
  and: AndNode,
  andV2: AndV2Node,
  or: OrNode,
  orV2: OrV2Node,
  setVariable: SetVariableNode,
};

export type NodeType = keyof typeof nodeTypes;
