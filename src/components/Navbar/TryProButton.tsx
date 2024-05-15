import { useAuth } from "@clerk/nextjs";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function TryProButton() {
  const authData = useAuth();
  const forWhom = authData.orgId ? "o" : "u";

  return (
    <Button
      className="bg-yellow-300 text-black border border-black hover:bg-black hover:text-yellow-300"
      asChild
    >
      <Link prefetch={false} href={`/checkout?f=${forWhom}`}>
        <BadgeCheckIcon className="size-4 mr-2" />
        Try Pro for free
      </Link>
    </Button>
  );
}
