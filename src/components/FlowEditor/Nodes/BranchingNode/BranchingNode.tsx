import { GitBranchIcon } from "lucide-react";
import { useEffect } from "react";
import type { Node, NodeProps } from "reactflow";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { ConditionEditor } from "../../_ConditionEditor";
import { ConditionItem } from "../../_ConditionItem";
import { NodeRemoveButton } from "../../NodeRemoveButton";

export interface BranchingNodeData {
  conditions: FormCraft.BranchingCondition[];
}

export function BranchingNode(props: NodeProps<BranchingNodeData>) {
  const { data, id } = props;
  const { conditions = [] } = data;
  const updateNodeInternals = useUpdateNodeInternals();
  const flow = useReactFlow();

  useEffect(() => {
    updateNodeInternals(id);
  }, [conditions, id, updateNodeInternals]);

  const handleAddCondition = (condition: FormCraft.BranchingCondition) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === props.id);

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: [...(node.data.conditions || []), condition],
        };

        return [
          ...nodes.filter((node) => node.id !== props.id),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  const handleRemoveCondition = (conditionId: string) => {
    flow.deleteElements({
      edges: flow
        .getEdges()
        .filter((edge) => edge.sourceHandle === conditionId),
    });

    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === props.id) as
        | Node<BranchingNodeData>
        | undefined;

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.filter(
            (condition) => condition.id !== conditionId
          ),
        };

        return [
          ...nodes.filter((node) => node.id !== props.id),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  const handleConditionChange = (
    conditionId: string,
    condition: FormCraft.BranchingCondition
  ) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === props.id) as
        | Node<BranchingNodeData>
        | undefined;

      if (node) {
        const updatedData = {
          ...node.data,
          conditions: node.data.conditions.map((c) =>
            c.id === conditionId ? condition : c
          ),
        };

        return [
          ...nodes.filter((node) => node.id !== props.id),
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
      const node = nodes.find((node) => node.id === props.id) as
        | Node<BranchingNodeData>
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
          ...nodes.filter((node) => node.id !== props.id),
          {
            ...node,
            data: updatedData,
          },
        ];
      }

      return nodes;
    });
  };

  return (
    <>
      <Handle
        type="target"
        id="input"
        position={Position.Left}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
      <div className="w-64 bg-background shadow-md rounded-md p-2 flex flex-col gap-2 group">
        <NodeRemoveButton flow={flow} node={props} />
        <div className="flex gap-2 items-center">
          <div className="size-8 flex-none rounded flex items-center justify-center bg-black text-white">
            <GitBranchIcon className="size-4" />
          </div>
          <div className="flex-auto flex flex-col">
            <div className="text-sm">
              <span>Branching</span>
            </div>
            <span className="text-xs text-gray-500">Execute first match</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {conditions.map((condition, index) => (
            <ConditionItem
              key={condition.id}
              condition={condition}
              onRemove={handleRemoveCondition}
              onChange={handleConditionChange}
              onMoveUp={
                index > 0
                  ? (conditionId) => handleMoveCondition(conditionId, "up")
                  : undefined
              }
              onMoveDown={
                index < conditions.length - 1
                  ? (conditionId) => handleMoveCondition(conditionId, "down")
                  : undefined
              }
            />
          ))}
          <ConditionItem condition={{ source: "default", id: "default" }} />
          <ConditionEditor onConfirm={handleAddCondition} />
        </div>
      </div>
    </>
  );
}
