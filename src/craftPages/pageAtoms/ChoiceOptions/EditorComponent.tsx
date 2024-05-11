import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorContent } from "@tiptap/react";
import { PlusIcon, XIcon } from "lucide-react";
import type { PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { ChoiceLetter } from "./ChoiceLetter";
import { Button } from "@/components/ui/button";
import type { PageWithOptions } from "@/hooks/useChoiceOptionEditor";
import { useChoiceOptionEditor } from "@/hooks/useChoiceOptionEditor";

interface Props<T> {
  page: T;
  onChange: (pageId: string, page: T) => void;
}

interface ItemProps<T> {
  option: { label: string; id: string };
  page: T;
  onChange: (pageId: string, page: T) => void;
  index: number;
}

class EditorPointerSensor extends PointerSensor {
  static activators: (typeof PointerSensor)["activators"] = [
    {
      eventName: "onPointerDown",
      handler: (event: PointerEvent<Element>) => {
        if (
          !event.nativeEvent.isPrimary ||
          event.nativeEvent.button !== 0 ||
          (event.nativeEvent.target instanceof HTMLElement &&
            (event.nativeEvent.target.classList.contains("tiptap") ||
              event.nativeEvent.target.nodeName === "BUTTON"))
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function ChoiceOptionItem<T extends PageWithOptions>(props: ItemProps<T>) {
  const { option, page, onChange, index } = props;
  const editor = useChoiceOptionEditor(page, option, onChange);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: option.id,
    disabled: editor?.isFocused,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Button
      variant="choiceOption"
      size="choiceOption"
      className="cursor-move relative group choiceOptionItem"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      asChild
    >
      <div>
        <ChoiceLetter index={index} />
        <EditorContent
          editor={editor}
          className="flex-auto break-all cursor-text choiceOptionEditor"
        />
        <div
          className={cn(
            "absolute -right-3 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity",
            {
              "opacity-100": editor?.isFocused,
              "group-hover:opacity-100": !isDragging && !isOver,
            }
          )}
        >
          <Button
            className={cn("size-5 p-0 rounded-full", {
              hidden: page.options.length === 1,
            })}
            variant="destructive"
            onClick={() => {
              onChange(page.id, {
                ...page,
                options: page.options.filter((o) => o.id !== option.id),
              });
            }}
          >
            <XIcon className="size-3 pointer-events-none" />
          </Button>
        </div>
      </div>
    </Button>
  );
}

export function ChoiceOptionsEditor<
  T extends PageWithOptions & {
    orientation: "vertical" | "horizontal";
  }
>(props: Props<T>) {
  const { page, onChange } = props;
  const { options, orientation } = page;

  const sensors = useSensors(useSensor(EditorPointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = options.findIndex((option) => option.id === active.id);
      const newIndex = options.findIndex((option) => option.id === over?.id);

      onChange(page.id, {
        ...page,
        options: arrayMove(options, oldIndex, newIndex),
      });
    }
  }

  return (
    <div
      className={cn(
        "px-2 pt-2 inline-flex min-w-56 max-w-full flex-col flex-wrap gap-3",
        {
          "grid grid-cols-3": orientation === "horizontal",
        }
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={options}>
          {options.map((option, index) => (
            <ChoiceOptionItem
              key={option.id}
              option={option}
              page={page}
              onChange={onChange}
              index={index}
            />
          ))}
        </SortableContext>
        <Button
          variant="choiceOption"
          size="choiceOption"
          className="bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 h-10"
          onClick={() => {
            onChange(page.id, {
              ...page,
              options: [
                ...options,
                {
                  label: `Option ${options.length + 1}`,
                  id: `option-${options.length + 1}`,
                },
              ],
            });
          }}
        >
          <span className="flex-none text-[10px] size-6 bg-background ml-2 flex items-center justify-center rounded">
            <PlusIcon className="size-4" />
          </span>
          <span className="ml-4">Add choice</span>
        </Button>
      </DndContext>
    </div>
  );
}
