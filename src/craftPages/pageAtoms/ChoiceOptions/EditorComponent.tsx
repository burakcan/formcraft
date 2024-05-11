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
import { ImageIcon, PlusIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { ChoiceLetter } from "./ChoiceLetter";
import { ImageLibrary } from "@/components/CraftBuilder/ImageLibrary/ImageLibrary";
import { ThemeImage } from "@/components/CraftBuilder/PageRenderer/ThemeImage";
import { Button } from "@/components/ui/button";
import type { ThemeImageType } from "@/craftPages/schemas/theming";
import type { PageWithOptions } from "@/hooks/useChoiceOptionEditor";
import { useChoiceOptionEditor } from "@/hooks/useChoiceOptionEditor";

interface Props<T> {
  page: T;
  onChange: (pageId: string, page: T) => void;
}

interface ItemProps<T> {
  option: {
    label: string;
    id: string;
    image: ThemeImageType | null;
  };
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
              event.nativeEvent.target.classList.contains(
                "choiceOptionImage"
              ) ||
              event.nativeEvent.target.nodeName === "BUTTON"))
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function ChoiceOptionItem<
  T extends PageWithOptions & {
    imageChoices: boolean;
  }
>(props: ItemProps<T>) {
  const { option, page, onChange, index } = props;
  const [prevImage, setPrevImage] = useState(option.image);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
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

  const handleImageReplace = () => {
    setPrevImage(option.image);
    setShowImageLibrary(true);
  };

  const handleImageCancel = () => {
    onChange(page.id, {
      ...page,
      options: page.options.map((o) =>
        o.id === option.id ? { ...o, image: prevImage } : o
      ),
    });
    setShowImageLibrary(false);
  };

  const handleImageSave = () => {
    setPrevImage(option.image);
    onChange(page.id, {
      ...page,
      options: page.options.map((o) =>
        o.id === option.id ? { ...o, image: option.image } : o
      ),
    });
    setShowImageLibrary(false);
  };

  const handleImageChange = (image?: ThemeImageType) => {
    if (image) {
      onChange(page.id, {
        ...page,
        options: page.options.map((o) =>
          o.id === option.id ? { ...o, image } : o
        ),
      });
    } else {
      onChange(page.id, {
        ...page,
        options: page.options.map((o) =>
          o.id === option.id ? { ...o, image: prevImage } : o
        ),
      });
    }
  };

  return (
    <>
      <Button
        variant="choiceOption"
        size="choiceOption"
        className={cn("cursor-move relative group choiceOptionItem", {
          "items-start pt-2": page.imageChoices,
        })}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        asChild
      >
        <div>
          {page.imageChoices && (
            <ImageLibrary
              open={showImageLibrary}
              onOpenChange={setShowImageLibrary}
              currentValue={option.image}
              onImageSelect={handleImageChange}
              onCancel={handleImageCancel}
              onSave={handleImageSave}
            />
          )}
          <ChoiceLetter index={index} />
          <div className="flex-auto flex flex-col">
            {page.imageChoices && (
              <div
                className={cn(
                  "choiceOptionImage relative flex-auto h-36 mx-2 mb-1 flex items-center justify-center cursor-pointer overflow-hidden rounded",
                  {
                    "bg-craft-answers/20 border border-craft-answers/30":
                      !option.image,
                  }
                )}
                onClick={handleImageReplace}
              >
                {option.image && (
                  <div className="blur-md size-full">
                    <ThemeImage
                      imageObject={option.image}
                      objectFit="cover"
                      noAttribution
                      noLoading
                    />
                  </div>
                )}
                {!option.image ? (
                  <ImageIcon className="size-8 text-craft-answers/50" />
                ) : (
                  <ThemeImage
                    imageObject={option.image}
                    objectFit="contain"
                    noAttribution
                    noLoading
                  />
                )}
              </div>
            )}
            <EditorContent
              editor={editor}
              className="break-all cursor-text choiceOptionEditor"
            />
          </div>
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
    </>
  );
}

export function ChoiceOptionsEditor<
  T extends PageWithOptions & {
    orientation: "vertical" | "horizontal";
    imageChoices: boolean;
  }
>(props: Props<T>) {
  const { page, onChange } = props;
  const { options, orientation } = page;

  const sensors = useSensors(
    useSensor(EditorPointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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
          "grid grid-cols-3": orientation === "horizontal" || page.imageChoices,
        }
      )}
    >
      <DndContext
        id="choiceOptions"
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
          className="bg-primary/5 text-primary border-primary/30 hover:bg-primary/10 h-10"
          onClick={() => {
            onChange(page.id, {
              ...page,
              options: [
                ...options,
                {
                  label: `Option ${options.length + 1}`,
                  id: nanoid(3),
                  image: null,
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
