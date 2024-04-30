import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { CraftShare } from "@/components/CraftShare";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function CraftSharePage(props: Props) {
  const { form_id } = props.params;

  return (
    <LayoutWithTopbar
      topBar={
        <CraftBuilderTopBar
          hideUndoRedo
          hideSave
          craft_id={form_id}
          activeTab="share"
        />
      }
    >
      <CraftShare />
    </LayoutWithTopbar>
  );
}
