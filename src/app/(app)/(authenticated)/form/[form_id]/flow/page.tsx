import { LayoutWithSidebar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { FlowEditor } from "@/components/FlowEditor";
import { NodeLibrary } from "@/components/FlowEditor/NodeLibrary";

interface Props {
  params: Promise<{
    form_id: string;
  }>;
}

export default async function EditCraftFlowPage(props: Props) {
  const { form_id } = (await props.params);

  return (
    <LayoutWithSidebar
      left={<NodeLibrary />}
      leftClassName="w-64"
      topBar={<CraftBuilderTopBar craft_id={form_id} activeTab="flow" />}
    >
      <FlowEditor />
    </LayoutWithSidebar>
  );
}
