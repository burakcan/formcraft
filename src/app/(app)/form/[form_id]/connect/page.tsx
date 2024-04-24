import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { CraftConnections } from "@/components/CraftConnections";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function CraftConnectPage(props: Props) {
  const { form_id } = props.params;

  return (
    <LayoutWithTopbar
      topBar={<CraftBuilderTopBar craft_id={form_id} activeTab="connect" />}
    >
      <CraftConnections />
    </LayoutWithTopbar>
  );
}
