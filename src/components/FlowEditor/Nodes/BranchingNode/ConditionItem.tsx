import { EditIcon, TrashIcon, VariableIcon } from "lucide-react";
import { Position } from "reactflow";
import { SingleConnectionHandle } from "../../Handles";
import { ConditionEditor } from "./ConditionEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  condition: FormCraft.BranchingCondition;
  onRemove?: (conditionId: string) => void;
  onChange?: (
    conditionId: string,
    condition: FormCraft.BranchingCondition
  ) => void;
}

export function ConditionItem(props: Props) {
  const { condition, onRemove, onChange } = props;

  return (
    <div className="text-xs border rounded-md text-gray-500 flex items-center relative leading-7 group nodrag">
      {condition.source === "default" ? (
        <div className="px-2">Default path</div>
      ) : (
        <div className="px-1 overflow-hidden relative w-full">
          <Badge variant="secondary" className="whitespace-nowrap">
            {condition.source === "input" && <span>Input</span>}
            {condition.source === "variable" && (
              <span>
                <VariableIcon className="size-3 inline-block" />
                {condition.variableName}
              </span>
            )}
          </Badge>
          <div className="px-2 inline-block">{condition.condition}</div>
          <Badge variant="secondary" className="whitespace-nowrap">
            <span>{condition.value}</span>
          </Badge>

          <div className="absolute top-0 left-0 w-full h-full hidden bg-background/90 rounded-md group-hover:flex gap-2 items-center justify-center">
            <ConditionEditor
              trigger={
                <Button size="icon" className="size-5 nodrag">
                  <EditIcon className="size-3" />
                </Button>
              }
              condition={condition}
              onConfirm={(values) => onChange && onChange(condition.id, values)}
            />
            <Button size="icon" variant="destructive" className="size-5">
              <TrashIcon
                onClick={() => onRemove && onRemove(condition.id)}
                className="size-3"
              />
            </Button>
          </div>
        </div>
      )}

      <SingleConnectionHandle
        type="source"
        id={condition.id}
        position={Position.Right}
        style={{
          // top: `${TOP_SPACE + index * 40}px`,
          top: "50%",
          right: -15,
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
}
