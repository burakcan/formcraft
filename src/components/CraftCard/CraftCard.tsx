import type { Craft } from "@prisma/client";
import Link from "next/link";

interface Props {
  craft: Craft;
}

export function CraftCard(props: Props) {
  const { craft } = props;
  return (
    <Link
      href={`/form/${craft.id}/edit`}
      className="bg-background shadow-sm h-64 p-4 rounded hover:shadow-xl transition duration-500 ease-in-out"
    >
      <h1 className="text-xl font-bold">{craft.title}</h1>
      <p className="text-gray-500">Description of item 1</p>
    </Link>
  );
}
