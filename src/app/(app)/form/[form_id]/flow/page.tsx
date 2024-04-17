import { LayoutWithSidebar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { FlowEditor } from "@/components/FlowEditor";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function EditCraftFlowPage(props: Props) {
  const { form_id } = props.params;

  return (
    <LayoutWithSidebar
      left={<div />}
      leftClassName="w-64"
      topBar={<CraftBuilderTopBar craft_id={form_id} activeTab="flow" />}
    >
      <FlowEditor />
    </LayoutWithSidebar>
  );
}
