import {} from "@/components/ui/dialog";
import { GitBranchIcon } from "lucide-react";
import { useEffect } from "react";
import type { NodeProps } from "reactflow";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { ConditionEditor } from "./ConditionEditor";
import { ConditionItem } from "./ConditionItem";

interface Data {
  conditions: FormCraft.BranchingCondition[];
}

export function BranchingNode(props: NodeProps<Data>) {
  const { data, id } = props;
  const { conditions = [] } = data;
  const updateNodeInternals = useUpdateNodeInternals();
  const flow = useReactFlow();

  useEffect(() => {
    updateNodeInternals(id);
  }, [conditions, id, updateNodeInternals]);

  const onAddCondition = (condition: FormCraft.BranchingCondition) => {
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

  return (
    <>
      <Handle type="target" id="input" position={Position.Left} />
      <div className="w-64 bg-background shadow-md rounded-md p-2 flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="size-8 flex-none rounded flex items-center justify-center bg-black text-white">
            <GitBranchIcon className="size-4" />
          </div>
          <div className="overflow-hidden text-ellipsis flex-auto">
            <div className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              <span>Branching</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {conditions.map((condition, index) => (
            <ConditionItem
              key={condition.id}
              index={index}
              condition={condition}
            />
          ))}
          <ConditionItem
            index={conditions.length}
            condition={{ source: "default", id: "default" }}
          />
          <ConditionEditor onConfirm={onAddCondition} />
        </div>
      </div>
    </>
  );
}
