import { ChevronDownIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="w-full p-4 sticky top-0 z-30">
      <div className="w-full mx-auto max-w-screen-lg h-16 rounded-full flex items-center justify-between px-8 space-x-12 bg-background">
        <a href="#" className="-mt-1">
          <Logo />
        </a>
        <div className="flex items-center">
          <Button variant="ghost" className="rounded-full" asChild>
            <a href="#" className="text-sm">
              Use cases
              <ChevronDownIcon className="w-4 h-4 ml-2 inline-block" />
            </a>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <a href="#" className="text-sm">
              Features
              <ChevronDownIcon
                className="w-
            4 h-4 ml-2 inline-block"
              />
            </a>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <a href="#" className="text-sm">
              Pricing
            </a>
          </Button>
        </div>
        <div className="flex-auto" />
        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-full">
            Log in
          </Button>
          <Button className="bg-rose-600 text-white rounded-full ">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}
