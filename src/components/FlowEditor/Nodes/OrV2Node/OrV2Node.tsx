import { SlashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { NodeProps } from "reactflow";
import {
  Handle,
  Position,
  getIncomers,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { ConditionEditor } from "../../ConditionEditor";
import { SingleConnectionHandle } from "../../Handles";
import { NodeRemoveButton } from "../../NodeRemoveButton";
import { ConditionItem } from "../components/ConditionItem";
import { useConditionEditLogic } from "../utils/useConditionEditLogic";

export interface OrV2NodeData {
  conditions: Condition.ConditionItem[];
}

export function OrV2Node(props: NodeProps<OrV2NodeData>) {
  const [showConditionEditor, setShowConditionEditor] = useState(false);
  const { data, id } = props;
  const updateNodeInternals = useUpdateNodeInternals();
  const { edges, nodes, node } = useEditCraftStore((s) => {
    return {
      edges: s.editingVersion.data.flow.edges,
      nodes: s.editingVersion.data.flow.nodes,
      node: s.editingVersion.data.flow.nodes.find((node) => node.id === id),
    };
  });

  const flow = useReactFlow();
  const incomers = node && getIncomers(node, nodes, edges);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, incomers, updateNodeInternals]);

  const {
    handleAddCondition,
    handleRemoveCondition,
    handleMoveCondition,
    handleConditionChange,
  } = useConditionEditLogic(data.conditions, id, setShowConditionEditor);

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

      <div className="w-64 bg-background shadow-md rounded-md flex flex-col gap-2 group">
        <NodeRemoveButton flow={flow} node={props} />
        <div className="flex gap-2 items-center p-2">
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
        <div className="flex flex-col gap-2 px-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8"
            onClick={() => setShowConditionEditor(true)}
          >
            Add condition
          </Button>
          {data.conditions?.map((condition, index) => (
            <ConditionItem
              noHandle
              key={condition.id}
              onRemove={handleRemoveCondition}
              onMoveUp={
                index > 0
                  ? (conditionId) => handleMoveCondition(conditionId, "up")
                  : undefined
              }
              onMoveDown={
                index < data.conditions.length - 1
                  ? (conditionId) => handleMoveCondition(conditionId, "down")
                  : undefined
              }
              onChange={handleConditionChange}
              condition={condition}
            />
          ))}
        </div>
        <div>
          <div className="items-center relative border-t bg-secondary p-2 text-xs text-right rounded-b-md">
            <Badge
              className="bg-emerald-500 text-white pointer-events-none"
              variant="secondary"
            >
              True
            </Badge>
            <SingleConnectionHandle
              type="source"
              id="true"
              position={Position.Right}
              style={{
                top: "50%",
                right: -5,
                width: "10px",
                height: "10px",
              }}
            />
          </div>
          <div className="items-center relative border-t bg-secondary p-2 text-xs text-right rounded-b-md">
            <Badge
              className="bg-red-500 text-white pointer-events-none"
              variant="secondary"
            >
              False
            </Badge>
            <SingleConnectionHandle
              type="source"
              id="false"
              position={Position.Right}
              style={{
                top: "50%",
                right: -5,
                width: "10px",
                height: "10px",
              }}
            />
          </div>
        </div>
      </div>
      <ConditionEditor
        open={showConditionEditor}
        onOpenChange={setShowConditionEditor}
        onConfirm={handleAddCondition}
      />
    </>
  );
}
