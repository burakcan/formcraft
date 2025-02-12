import { LayoutWithSidebar } from "@/components/AppChrome";
import {
  ContentSidebar,
  CraftBuilder,
  CraftBuilderTopBar,
  PropertiesSidebar,
} from "@/components/CraftBuilder";

interface Props {
  params: Promise<{
    form_id: string;
  }>;
}

export default async function EditCraftPage(props: Props) {
  const { form_id } = (await props.params);

  return (
    <LayoutWithSidebar
      left={<ContentSidebar />}
      leftClassName="w-64"
      right={<PropertiesSidebar />}
      topBar={<CraftBuilderTopBar craft_id={form_id} activeTab="create" />}
    >
      <CraftBuilder />
    </LayoutWithSidebar>
  );
}
