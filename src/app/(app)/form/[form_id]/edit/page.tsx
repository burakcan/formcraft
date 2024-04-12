import { auth, currentUser } from "@clerk/nextjs/server";
import { Providers } from "./providers";
import { LayoutWithSidebar } from "@/components/AppChrome";
import {
  ContentSidebar,
  CraftBuilder,
  CraftBuilderTopBar,
  PropertiesSidebar,
} from "@/components/CraftBuilder";
import db from "@/services/db";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function EditCraftPage(props: Props) {
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
    include: {
      liveCraftVersion: true,
      craftVersions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  const editingVersion = craft.craftVersions[0];

  if (!editingVersion) {
    return null;
  }

  return (
    <Providers craft={craft} editingVersion={editingVersion}>
      <LayoutWithSidebar
        left={<ContentSidebar />}
        right={<PropertiesSidebar />}
        topBar={
          <CraftBuilderTopBar
            craft={craft}
            user={user}
            orgName={sessionClaims?.org_name as string}
            activeTab="create"
          />
        }
      >
        <CraftBuilder />
      </LayoutWithSidebar>
    </Providers>
  );
}
