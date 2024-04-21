import { RemovableEdge } from "./RemovableEdge";

export const edgeTypes = {
  removable: RemovableEdge,
};

export type EdgeType = keyof typeof edgeTypes;
