import {} from "@/components/ui/dialog";
import { SlashIcon } from "lucide-react";
import { useEffect } from "react";
import type { Node, NodeProps } from "reactflow";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { Badge } from "@/components/ui/badge";
import { ConditionEditor } from "../../ConditionEditor";
import { ConditionItem } from "../../ConditionItem";
import { SingleConnectionHandle } from "../../Handles";
import { NodeRemoveButton } from "../../NodeRemoveButton";

export interface OrNodeData {
  conditions: FormCraft.BranchingCondition[];
}

export function OrNode(props: NodeProps<OrNodeData>) {
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
        | Node<OrNodeData>
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
        | Node<OrNodeData>
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
            <SlashIcon className="size-4" />
          </div>
          <div className="flex-auto flex flex-col">
            <div className="text-sm">
              <span>OR</span>
            </div>
            <span className="text-xs text-gray-500">
              Check if any condition is met
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {conditions.map((condition) => (
            <ConditionItem
              noHandle
              noMove
              key={condition.id}
              condition={condition}
              onRemove={handleRemoveCondition}
              onChange={handleConditionChange}
            />
          ))}
          <ConditionEditor onConfirm={handleAddCondition} />
          <div className="flex justify-end relative">
            <Badge className="bg-emerald-500">True</Badge>
            <SingleConnectionHandle
              type="source"
              id="true"
              position={Position.Right}
              style={{
                top: "50%",
                right: -15,
                width: "10px",
                height: "10px",
              }}
            />
          </div>
          <div className="flex justify-end relative">
            <Badge className="bg-rose-500">False</Badge>
            <SingleConnectionHandle
              type="source"
              id="false"
              position={Position.Right}
              style={{
                top: "50%",
                right: -15,
                width: "10px",
                height: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
