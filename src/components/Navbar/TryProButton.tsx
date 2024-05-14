"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BadgeCheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePaddle } from "@/hooks/usePaddle";
import { usePaddleIdsQuery } from "@/hooks/usePaddleIdsQuery";

export function TryProButton() {
  const { organization, isLoaded: isOrganizationLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const paddle = usePaddle();
  const { data: paddleIds } = usePaddleIdsQuery(
    user?.id || "",
    organization?.id
  );

  const handleClick = () => {
    if (!paddle || !user || !paddleIds) {
      return;
    }

    const customer =
      paddleIds.organizationCustomerId && paddleIds.organizationBusinessId
        ? {
            id: paddleIds.organizationCustomerId,
            business: {
              id: paddleIds.organizationBusinessId,
            },
          }
        : {
            id: paddleIds.userCustomerId!,
          };

    paddle.Checkout.open({
      customer,
      settings: {
        displayMode: "overlay",
        showAddTaxId: organization ? true : false,
        allowLogout: false,
        locale: "en",
      },
      items: [
        {
          priceId: organization
            ? "pri_01hxtw73cys5ggcy1psx0csbc7"
            : "pri_01hxtw3cn3hy1qkmtmwnb80h1y",
        },
      ],
    });
  };

  if (!paddle || !isOrganizationLoaded || !isUserLoaded) {
    return null;
  }

  return (
    <Button
      className="bg-yellow-300 text-black border border-black hover:bg-black hover:text-yellow-300"
      onClick={handleClick}
    >
      <BadgeCheckIcon className="size-4 mr-2" />
      Try Pro for free
    </Button>
  );
}
