import { NavMenu } from "./NavMenu";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="w-full p-4 sticky top-0 z-30">
      <div className="w-full mx-auto max-w-screen-lg h-16 rounded-full flex items-center justify-between pl-8 pr-4 space-x-12 bg-background">
        <a href="#" className="-mt-1">
          <Logo />
        </a>
        <div className="flex items-center">
          <NavMenu />
        </div>
        <div className="flex-auto" />
        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-full">
            Log in
          </Button>
          <Button className="rounded-full" variant="secondary">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
