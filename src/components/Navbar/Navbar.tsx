import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { TopBar } from "../AppChrome";
import { Logo } from "../Logo";

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
      />
      <div className="flex-1" />
      <UserButton />
    </TopBar>
  );
}
