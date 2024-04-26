import { AndNode } from "./AndNode/AndNode";
import { BranchingNode } from "./BranchingNode";
import { OrNode } from "./OrNode/OrNode";
import { PageNode } from "./PageNode";
import { SetVariableNode } from "./SetVariableNode";

export const nodeTypes = {
  page: PageNode,
  branching: BranchingNode,
  and: AndNode,
  or: OrNode,
  setVariable: SetVariableNode,
};

export type NodeType = keyof typeof nodeTypes;
