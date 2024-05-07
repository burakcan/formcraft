import { builtinThemes } from "@/lib/themes";
import { Providers } from "./providers";
import { CraftViewer } from "@/components/CraftViewer";
import db from "@/services/db";
import {
  createSubmission,
  getCraftWithLiveVersion,
} from "@/services/db/submission";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function FormPage(props: Props) {
  const { form_id } = props.params;

  const [craft, version, submission] = await db.$transaction(async (tx) => {
    const craft = await getCraftWithLiveVersion(form_id, tx);
    const version = craft?.craftVersions[0];

    if (!version || !craft) {
      throw new Error("Form not found");
    }

    const submission = await createSubmission(form_id, version.id, tx);

    return [craft, version, submission];
  });

  if (!version || !craft) {
    return <div>Form not found</div>;
  }

  // react-flow nodes and edges
  const nodes = version.data.flow.nodes;
  const edges = version.data.flow.edges;

  const rootNode = nodes.find((node) => {
    const isPage = node.type === "page";
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const outgoingEdges = edges.filter((edge) => edge.source === node.id);

    return isPage && incomingEdges.length === 0 && outgoingEdges.length > 0;
  });

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
      submission={submission}
      rootNodeId={rootNode.id}
      rootPageId={rootNode.data.pageId}
    >
      <CraftViewer />
    </Providers>
  );
}
