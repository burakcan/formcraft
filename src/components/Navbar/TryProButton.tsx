"use client";

import { BadgeCheckIcon } from "lucide-react";
import { Button } from "../ui/button";

export function TryProButton() {
  const handleClick = () => {};

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
