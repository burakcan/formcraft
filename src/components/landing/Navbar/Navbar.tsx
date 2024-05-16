import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NavMenu } from "./NavMenu";

export function Navbar() {
  const authData = auth();

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
          {authData.userId ? (
            <Button variant="secondary" className="rounded-full" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full" asChild>
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button className="rounded-full" variant="secondary" asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
