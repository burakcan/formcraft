import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { PageMedia } from "../craftPageConfig/basePage";
import { ImageLibrary } from "@/components/CraftBuilder/ImageLibrary/ImageLibrary";
import { Button } from "@/components/ui/button";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

const Component = () => {
  const { editPage, selectedPage } = useEditCraftStore((s) => {
    const selectedPage = s.editingVersion.data.pages.find(
      (p) => p.id === s.selectedPageId
    );
    return {
      selectedPage,
      editPage: s.editPage,
    };
  });

  const [prevValue, setPrevValue] = useState(selectedPage?.media);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleSave = (value: PageMedia) => {
    if (!selectedPage) return;

    editPage(selectedPage.id, {
      ...selectedPage,
      media: {
        type: "image",
        ...value,
      },
    });
  };

  const handleCancel = () => {
    setShowMediaLibrary(false);

    if (prevValue) {
      handleSave(prevValue);
    }
  };

  console.log("selectedPage", selectedPage);

  return (
    <NodeViewWrapper
      className="media-node flex mb-2"
      style={{
        textAlign: "var(--craft-text-align)",
      }}
    >
      <div className="w-full">
        <div className="flex gap-2">
          {!selectedPage?.media?.url && (
            <Button
              size="sm"
              variant="outline"
              className="border-dashed text-craft-description border-craft-description bg-transparent rounded-full h-6 px-1 text-xs opacity-50 hover:opacity-100 hover:bg-transparent hover:text-craft-description"
              onClick={() => setShowMediaLibrary(true)}
            >
              <PlusCircle className="size-4 mr-1" />
              Image
            </Button>
          )}

          {!selectedPage?.media?.url && (
            <Button
              size="sm"
              variant="outline"
              className="border-dashed text-craft-description border-craft-description bg-transparent rounded-full h-6 px-1 text-xs opacity-50 hover:opacity-100 hover:bg-transparent hover:text-craft-description"
              onClick={() => setShowMediaLibrary(true)}
            >
              <PlusCircle className="size-4 mr-1" />
              Youtube
            </Button>
          )}
        </div>

        {selectedPage?.media?.type === "image" && (
          <Image
            src={selectedPage.media.url}
            alt="Media Image"
            width={800}
            height={400}
            className="object-cover rounded-lg max-h-[30vh] w-auto not-prose inline-block m-0"
          />
        )}
      </div>
      <ImageLibrary
        open={showMediaLibrary}
        currentValue={
          selectedPage?.media?.type === "image" ? selectedPage.media : undefined
        }
        onOpenChange={setShowMediaLibrary}
        onImageSelect={handleSave}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </NodeViewWrapper>
  );
};

export const Media = Node.create({
  name: "media",
  group: "media",
  atom: true,
  parseHTML() {
    return [
      {
        tag: "div[data-type='media']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "media",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
