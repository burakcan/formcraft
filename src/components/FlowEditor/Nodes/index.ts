import { AndNode } from "./AndNode/AndNode";
import { BranchingNode } from "./BranchingNode";
import { OrNode } from "./OrNode/OrNode";
import { PageNode } from "./PageNode";

export const nodeTypes = {
  page: PageNode,
  branching: BranchingNode,
  and: AndNode,
  or: OrNode,
};

export type NodeType = keyof typeof nodeTypes;
