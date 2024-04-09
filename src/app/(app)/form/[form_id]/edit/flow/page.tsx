import { auth, currentUser } from "@clerk/nextjs/server";
import { LayoutWithSidebar } from "@/components/AppChrome";
import { ContentSidebar } from "@/components/CraftBuilder/ContentSidebar";
import { CraftBuilderTopBar } from "@/components/CraftBuilder/CraftBuilderTopBar";
import { PropertiesSidebar } from "@/components/CraftBuilder/PropertiesSidebar";
import db from "@/services/db";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function CraftFlowPage(props: Props) {
  const { userId, orgId, sessionClaims } = auth();
  const user = await currentUser();
  const { form_id } = props.params;

  if (!userId || !user) {
    return null;
  }

  const craft = await db.craft.findFirstOrThrow({
    where: {
      id: form_id,
      organizationId: orgId || undefined,
      userId: !orgId ? userId : undefined,
    },
  });

  return (
    <LayoutWithSidebar
      left={<ContentSidebar />}
      right={<PropertiesSidebar />}
      topBar={
        <CraftBuilderTopBar
          craft={craft}
          user={user}
          orgName={sessionClaims?.org_name as string}
          activeTab="flow"
        />
      }
    >
      Flow
    </LayoutWithSidebar>
  );
}
