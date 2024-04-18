import { Position } from "reactflow";
import { SingleConnectionHandle } from "../../Handles";
import { Badge } from "@/components/ui/badge";

interface Props {
  index: number;
  condition: FormCraft.BranchingCondition;
}

const TOP_SPACE = 64;

export function ConditionItem(props: Props) {
  const { index, condition } = props;

  return (
    <div className="text-xs border h-8 rounded-md text-gray-500 flex items-center justify-end">
      {condition.source === "default" ? (
        <div className="px-2">Default path</div>
      ) : (
        <div className="px-1">
          <Badge variant="secondary">{condition.source}</Badge>
          <div className="px-2 inline-block">{condition.condition}</div>
          <Badge variant="secondary">{condition.value}</Badge>
        </div>
      )}

      <SingleConnectionHandle
        type="source"
        id={condition.id}
        position={Position.Right}
        style={{
          top: `${TOP_SPACE + index * 40}px`,
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
}
