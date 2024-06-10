import type { Node } from "reactflow";
import { useReactFlow } from "reactflow";

interface BranchingV2NodeData {
  conditions: Condition.ConditionItem[];
}

export function useConditionEditLogic(
  conditions: Condition.ConditionItem[],
  nodeID: string,
  setShowConditionEditor: (show: boolean) => void
) {
  const flow = useReactFlow();

  const handleAddCondition = (condition: Condition.ConditionItem) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === nodeID);

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: [...(node.data.conditions || []), condition],
        };

        return [
          ...nodes.filter((node) => node.id !== nodeID),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });

    setShowConditionEditor(false);
  };

  const handleRemoveCondition = (conditionId: string) => {
    flow.deleteElements({
      edges: flow
        .getEdges()
        .filter((edge) => edge.sourceHandle === conditionId),
    });

    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === nodeID) as
        | Node<BranchingV2NodeData>
        | undefined;

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.filter(
            (condition) => condition.id !== conditionId
          ),
        };

        return [
          ...nodes.filter((node) => node.id !== nodeID),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  const handleMoveCondition = (
    conditionId: string,
    direction: "up" | "down"
  ) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === nodeID) as
        | Node<BranchingV2NodeData>
        | undefined;

      if (node) {
        const conditions = node.data.conditions;
        const index = conditions.findIndex((c) => c.id === conditionId);

        if (index === -1) {
          return nodes;
        }

        const newIndex = direction === "up" ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= conditions.length) {
          return nodes;
        }

        const newConditions = [...conditions];
        newConditions[index] = conditions[newIndex];
        newConditions[newIndex] = conditions[index];

        const updatedData = {
          ...node.data,
          conditions: newConditions,
        };

        return [
          ...nodes.filter((node) => node.id !== nodeID),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  const handleConditionChange = (conditionId: string, values: any) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === nodeID) as
        | Node<BranchingV2NodeData>
        | undefined;

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((condition) =>
            condition.id === conditionId
              ? { ...condition, ...values }
              : condition
          ),
        };

        return [
          ...nodes.filter((node) => node.id !== nodeID),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  return {
    handleAddCondition,
    handleRemoveCondition,
    handleMoveCondition,
    handleConditionChange,
  };
}
