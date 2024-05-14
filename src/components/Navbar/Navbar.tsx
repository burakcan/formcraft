"use client";

import {
  OrganizationProfile,
  OrganizationSwitcher,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { ReceiptTextIcon } from "lucide-react";
import { TopBar } from "../AppChrome";
import Billing from "../Billing/Billing";
import { Logo } from "../Logo";
import { TryProButton } from "./TryProButton";

export function Navbar() {
  return (
    <TopBar className="items-center gap-4 px-4">
      <Logo />
      <OrganizationSwitcher
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox:
              "border rounded-lg p-1 pr-0 flex items-center hover:bg-accent",
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
          <Billing for="organization" />
        </OrganizationProfile.Page>
      </OrganizationSwitcher>
      <div className="flex-1" />
      <TryProButton />
      <UserButton>
        <UserProfile.Page
          label="Billing"
          url="/billing"
          labelIcon={<ReceiptTextIcon className="cl-navbarButtonIcon size-4" />}
        >
          <Billing for="user" />
        </UserProfile.Page>
      </UserButton>
    </TopBar>
  );
}
