import { CraftViewer } from "@/components/CraftViewer";
import db from "@/services/db";
import {
  createSubmission,
  getCraftWithLiveVersion,
} from "@/services/db/submission";
import { findRootNode } from "@/lib/findRootNode";
import { builtinThemes } from "@/lib/themes";
import { Providers } from "./providers";

interface Props {
  params: Promise<{
    form_id: string;
  }>;
}

export default async function FormPage(props: Props) {
  const { form_id } = (await props.params);

  const craft = await getCraftWithLiveVersion(form_id);
  const version = craft?.craftVersions[0];

  if (!version || !craft) {
    throw new Error("Form not found");
  }

  const submission = await createSubmission(form_id, version.id);

  // const submission = null;

  if (!version || !craft) {
    return <div>Form not found</div>;
  }

  // react-flow nodes and edges
  const nodes = version.data.flow.nodes;
  const edges = version.data.flow.edges;
  const rootNode = findRootNode(nodes, edges);

  if (!rootNode) {
    return <div>Form is not valid</div>;
  }

  const themesInUse = new Set(
    [...version.data.pages, ...version.data.end_pages].map(
      (page) => page.baseThemeId
    )
  );

  const customThemes = (
    await db.customTheme.findMany({
      select: {
        data: true,
      },
      where: {
        id: {
          in: Array.from(themesInUse),
        },
      },
    })
  ).map((theme) => theme.data);

  const themes = {
    ...builtinThemes,
    ...Object.fromEntries(customThemes.map((theme) => [theme.id, theme])),
  };

  return (
    <Providers
      craft={craft}
      version={version}
      themes={themes}
      submissionId={submission.id}
      rootNodeId={rootNode.id}
      rootPageId={rootNode.data.pageId}
    >
      <CraftViewer />
    </Providers>
  );
}
