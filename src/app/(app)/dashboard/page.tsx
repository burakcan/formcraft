import { auth } from "@clerk/nextjs";
import { LayoutWithSidebar } from "@/components/AppChrome";
import { CraftListing } from "@/components/CraftListing";
import { ListingSidebar } from "@/components/ListingSidebar";
import { Navbar } from "@/components/Navbar";
import db from "@/services/db";

export default async function Dashboard() {
  const { userId, orgId } = auth();

  if (!userId) {
    return null;
  }

  const crafts = await db.craft.findMany({
    where: orgId ? { organizationId: orgId } : { userId, organizationId: null },
  });

  return (
    <LayoutWithSidebar topBar={<Navbar />} left={<ListingSidebar />}>
      <CraftListing crafts={crafts} />
    </LayoutWithSidebar>
  );
}
