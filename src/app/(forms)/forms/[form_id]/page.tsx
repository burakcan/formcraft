import { builtinThemes } from "@/lib/themes";
import { CraftViewer } from "@/components/CraftViewer";
import db from "@/services/db";

interface Props {
  params: {
    form_id: string;
  };
}

export default async function FormPage(props: Props) {
  const { form_id } = props.params;

  const version = await db.craftVersion.findFirst({
    orderBy: {
      publishedAt: "desc",
    },
    where: {
      craftId: form_id,
      publishedAt: {
        not: null,
      },
    },
  });

  if (!version) {
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
    version.data.pages.map((page) => page.baseThemeId)
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
    <CraftViewer version={version} rootNodeId={rootNode.id} themes={themes} />
  );
}
