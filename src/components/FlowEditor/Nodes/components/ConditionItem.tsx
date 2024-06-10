import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Position } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { ConditionEditor } from "../../ConditionEditor";
import { SingleConnectionHandle } from "../../Handles";
import { craftPageDefinitions } from "@/craftPages";

interface Props {
  noHandle?: boolean;
  noMove?: boolean;
  condition: Condition.ConditionItem;
  onMoveUp?: (conditionId: string) => void;
  onMoveDown?: (conditionId: string) => void;
  onRemove?: (conditionId: string) => void;
  onChange?: (conditionId: string, condition: Condition.ConditionItem) => void;
}

export function ConditionItem(props: Props) {
  const {
    condition,
    onRemove,
    onChange,
    onMoveDown,
    onMoveUp,
    noHandle,
    noMove,
  } = props;

  const [showConditionEditor, setShowConditionEditor] = useState(false);

  return (
    <div className="text-xs border rounded-md text-gray-500 flex items-center relative leading-7 group/item">
      <div className="px-1 overflow-hidden relative w-full">
        {condition.sourceType === "page" && (
          <PageConditionContent
            condition={
              condition as typeof condition & {
                sourceType: "page";
              }
            }
          />
        )}

        <div className="absolute top-0 left-0 w-full h-full hidden bg-background/90 rounded-md group-hover/item:flex gap-2 items-center justify-center nodrag">
          {!noMove && (
            <>
              <Button
                size="icon"
                className="size-5 nodrag"
                disabled={!onMoveUp}
                onClick={() => onMoveUp && onMoveUp(condition.id)}
              >
                <ChevronUpIcon className="size-3" />
              </Button>
              <Button
                size="icon"
                className="size-5 nodrag"
                disabled={!onMoveDown}
                onClick={() => onMoveDown && onMoveDown(condition.id)}
              >
                <ChevronDownIcon className="size-3" />
              </Button>
            </>
          )}
          <Button
            onClick={() => setShowConditionEditor(true)}
            size="icon"
            className="size-5 nodrag"
          >
            <EditIcon className="size-3" />
          </Button>
          <Button size="icon" variant="destructive" className="size-5">
            <TrashIcon
              onClick={() => onRemove && onRemove(condition.id)}
              className="size-3"
            />
          </Button>
        </div>
      </div>

      {!noHandle && (
        <SingleConnectionHandle
          type="source"
          id={condition.id}
          position={Position.Right}
          style={{
            top: "50%",
            right: -15,
            width: "10px",
            height: "10px",
          }}
        />
      )}

      {showConditionEditor && (
        <ConditionEditor
          condition={condition}
          open={showConditionEditor}
          onOpenChange={setShowConditionEditor}
          onConfirm={(values) => {
            onChange && onChange(condition.id, values);
            setShowConditionEditor(false);
          }}
        />
      )}
    </div>
  );
}

function PageConditionContent(props: {
  condition: Condition.ConditionItem & { sourceType: "page" };
}) {
  const { condition } = props;
  const { page, pageIndex } = useEditCraftStore((s) => {
    const pageIndex = s.editingVersion.data.pages.findIndex(
      (p) => p.id === condition.sourceId
    );

    return {
      page: s.editingVersion.data.pages[pageIndex],
      pageIndex,
    };
  });

  if (!page) {
    return <div>Missing page!</div>;
  }

  const pageDefinition = craftPageDefinitions[page.type];
  const Icon = pageDefinition.icon;

  const comparison = pageDefinition.comparisons.find(
    (c) => c.id === condition.comparisonId
  );

  if (!comparison) {
    return null;
  }

  const isMultiple =
    "getIsMultiple" in comparison && comparison.getIsMultiple(page as any);

  const options =
    ("getOptions" in comparison && comparison.getOptions(page as any)) || [];

  const comparisonLabel =
    typeof comparison.label === "string"
      ? comparison.label
      : comparison.label[isMultiple ? "multiple" : "single"];

  const valueItems = (
    Array.isArray(condition.comparisonValue)
      ? condition.comparisonValue
      : [condition.comparisonValue]
  ).map((v) => {
    const option = options.find((o) => o.id === v);
    return option ? option.label : v;
  });

  return (
    <div className="flex flex-wrap gap-1 py-1 items-center">
      <div
        className={cn("p-2 rounded inline-block", pageDefinition.iconClassName)}
      >
        <Icon className={cn("size-4", pageDefinition.iconClassName)} />
      </div>
      <span className="font-medium text-xs text-muted-foreground">
        {pageIndex + 1}.
      </span>
      <Badge className="ml-1 whitespace-nowrap" variant="outline">
        {comparisonLabel}
      </Badge>
      <div className="ml-1 leading-4 flex gap-1 flex-wrap">
        {valueItems.map((value, index) =>
          Array.isArray(condition.comparisonValue) ? (
            <Badge key={index}>{value}</Badge>
          ) : (
            <span key={index} className="text-xs">
              {value}
            </span>
          )
        )}
      </div>
    </div>
  );
}
