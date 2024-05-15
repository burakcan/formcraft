import { VariableIcon } from "lucide-react";
import type { NodeProps } from "reactflow";
import { Handle, Position, useReactFlow } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SingleConnectionHandle } from "../../Handles";
import { NodeRemoveButton } from "../../NodeRemoveButton";

export interface SetVariableNodeData {
  variableName: string;
}

export function SetVariableNode(props: NodeProps<SetVariableNodeData>) {
  const { data, id } = props;
  const flow = useReactFlow();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    flow.setNodes((nodes) => {
      const node = nodes.find((node) => node.id === id);

      if (node) {
        const updatedData = {
          ...node.data,
          variableName: e.target.value,
        };

        return [
          ...nodes.filter((node) => node.id !== id),
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
      <SingleConnectionHandle
        type="source"
        id="output"
        position={Position.Right}
        style={{
          width: "10px",
          height: "10px",
        }}
      />
      <div className="w-64 bg-background shadow-md rounded-md p-2 flex flex-col gap-2 group">
        <NodeRemoveButton flow={flow} node={props} />
        <div className="flex gap-2 items-center">
          <div className="size-8 flex-none rounded flex items-center justify-center bg-black text-white">
            <VariableIcon className="size-4" />
          </div>
          <div className="flex-auto flex flex-col">
            <div className="text-sm">
              <span>Set Variable</span>
            </div>
            <span className="text-xs text-gray-500">
              Save a value to a variable
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Label className="text-xs">Variable name</Label>
          <Input
            className="h-8 text-xs"
            value={data.variableName || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
