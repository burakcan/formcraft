import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";

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
      Connect
    </LayoutWithTopbar>
  );
}
