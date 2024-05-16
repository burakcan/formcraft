"use client";

import {
  OrganizationProfile,
  OrganizationSwitcher,
  UserButton,
  UserProfile,
  useAuth,
} from "@clerk/nextjs";
import { ReceiptTextIcon } from "lucide-react";
import { TopBar } from "../AppChrome";
import Billing from "../Billing/Billing";
import { Logo } from "../Logo";
import { TryProButton } from "../TryProButton";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  const authData = useAuth();

  return (
    <TopBar className="items-center gap-4 px-4">
      <Logo />
      <OrganizationSwitcher
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
        appearance={{
          layout: {
            shimmer: false,
          },
          elements: {
            rootBox:
              "border rounded-lg py-1 px-0 flex items-center hover:bg-accent",
            organizationSwitcherTrigger: "hover:bg-transparent focus:ring-0",
          },
          variables: {},
        }}
      >
        <OrganizationProfile.Page
          label="Billing"
          url="/billing"
          labelIcon={<ReceiptTextIcon className="cl-navbarButtonIcon size-4" />}
        >
          <Billing organization />
        </OrganizationProfile.Page>
      </OrganizationSwitcher>
      {!authData.isLoaded && (
        <div className=" w-[185.83px] cl-rootBox border rounded-lg py-2 px-2 flex items-center hover:bg-accent cl-organizationSwitcher-root">
          <div className="cl-userPreview cl-userPreview__personalWorkspace flex gap-2 items-center">
            <Skeleton className="w-5 h-5 rounded-md bg-gray-200" />
            <Skeleton className="w-24 h-4 ml-2 rounded-md bg-gray-200" />
          </div>
        </div>
      )}
      <div className="flex-1" />
      <TryProButton organization />
      <UserButton
        appearance={{
          layout: { shimmer: true },
        }}
      >
        <UserProfile.Page
          label="Billing"
          url="/billing"
          labelIcon={<ReceiptTextIcon className="cl-navbarButtonIcon size-4" />}
        >
          <Billing user />
        </UserProfile.Page>
      </UserButton>
      {!authData.isLoaded && (
        <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
      )}
    </TopBar>
  );
}
