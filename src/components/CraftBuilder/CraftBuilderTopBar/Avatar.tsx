"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import Image from "next/image";

export function Avatar() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  const avatar = organization?.imageUrl || user?.imageUrl;

  return (
    <div className="border p-1 rounded-lg">
      <div
        className="size-8 relative rounded-md"
        style={{
          background: "rgba(0, 0, 0, 0.24)",
        }}
        suppressHydrationWarning
      >
        {orgLoaded && userLoaded && (
          <Image
            src={avatar!}
            alt="avatar"
            className="rounded-md"
            unoptimized
            style={{
              objectFit: "cover",
            }}
            fill
          />
        )}
      </div>
    </div>
  );
}
