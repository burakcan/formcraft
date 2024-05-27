import type { NodeViewRendererProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";

interface Props extends NodeViewRendererProps {}

export function RecallToken(props: { pageId: string; label: string }) {
  const { pageId, label } = props;

  const { page, pageIndex } = useEditCraftStore((state) => ({
    page: state.editingVersion.data.pages.find((p) => p.id === pageId),
    pageIndex: state.editingVersion.data.pages.findIndex(
      (p) => p.id === pageId
    ),
  }));

  if (!page) return <NodeViewWrapper as="span">Not found</NodeViewWrapper>;

  const pageDefinition = craftPageDefinitions[page.type];

  const Icon = pageDefinition.icon;

  return (
    <span
      className={cn(
        "inline-flex p-0.5 border text-xs rounded border-black align-middle gap-0.5 max-w-48 select-none selection:bg-slate-300",
        pageDefinition.iconClassName
      )}
    >
      <Icon
        className={cn(
          "size-4 inline-block flex-none",
          pageDefinition.iconClassName
        )}
      />
      <strong>{pageIndex + 1}.</strong>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        <span>{page.title}</span>
      </span>
      <span className="opacity-50">({label})</span>
    </span>
  );
}

export function RecallTokenNode(props: Props) {
  const pageId = props.node.attrs.pageId;
  const label = props.node.attrs.label;

  return (
    <NodeViewWrapper as="span">
      <RecallToken pageId={pageId} label={label} />
    </NodeViewWrapper>
  );
}
