import { Suspense } from "react";
import { LayoutWithTopbar } from "@/components/AppChrome";
import { CraftBuilderTopBar } from "@/components/CraftBuilder";
import { CraftResultsTable } from "@/components/CraftResults";
import {
  getVersionsFromSubmissionsList,
  listSubmissions,
} from "@/services/db/submission";

interface Props {
  params: Promise<{
    form_id: string;
  }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    partial?: string;
  }>;
}

async function TableWrapper(props: Props) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    partial = "false",
  } = await props.searchParams;
  const { form_id } = await props.params;

  const data = await listSubmissions(
    form_id,
    Math.abs(Number(page)) || 1,
    Math.min(100, Math.max(0, Number(pageSize))),
    search,
    partial === "true"
  );

  const versions = await getVersionsFromSubmissionsList(data.data);

  return <CraftResultsTable data={data} versions={versions} />;
}

export default async function CraftResultsPage(props: Props) {
  const { form_id } = await props.params;

  return (
    <LayoutWithTopbar
      topBar={
        <CraftBuilderTopBar
          hideUndoRedo
          hideAutoSave
          craft_id={form_id}
          activeTab="results"
        />
      }
    >
      <Suspense fallback={<div>Loading table...</div>}>
        <TableWrapper /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
          {...props}
        />
      </Suspense>
    </LayoutWithTopbar>
  );
}
