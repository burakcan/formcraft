"use client";

import type Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, PropsWithChildren } from "react";
import { createContext, useEffect, useState } from "react";
import { useEditCraftStoreTemporal } from "@/hooks/useEditCraftStore";
import { BlockerModal } from "./BlockerModal";

interface CraftNavigationBlockContextProps {
  dirty: boolean;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  setTargetHref: (href: ComponentProps<typeof Link>["href"]) => void;
}

export const CraftNavigationBlockContext =
  createContext<CraftNavigationBlockContextProps>({
    dirty: false,
    showModal: false,
    setShowModal: () => {},
    setTargetHref: () => {},
  });

export function CraftNavigationBlockProvider(props: PropsWithChildren) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [targetHref, setTargetHref] =
    useState<ComponentProps<typeof Link>["href"]>();
  const dirty = useEditCraftStoreTemporal((s) => s.pastStates.length > 0);

  useEffect(() => {
    const dirtyCallback = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    if (dirty) {
      window.addEventListener("beforeunload", dirtyCallback);
    }

    return () => {
      window.removeEventListener("beforeunload", dirtyCallback);
    };
  }, [dirty]);

  const handleNavigationConfirmed = () => {
    if (targetHref) {
      router.push(targetHref.toString());
      setTargetHref(undefined);
    }
  };

  const handleNavigationCancelled = () => {
    setTargetHref(undefined);
  };

  const handleDiscarded = () => {
    if (targetHref) {
      router.push(targetHref.toString());
      router.refresh();
    }
  };

  return (
    <CraftNavigationBlockContext.Provider
      value={{ dirty, showModal, setShowModal, setTargetHref }}
    >
      {props.children}
      <BlockerModal
        open={showModal}
        onOpenChange={setShowModal}
        onNavigationConfirmed={handleNavigationConfirmed}
        onNavigationCancelled={handleNavigationCancelled}
        onDiscarded={handleDiscarded}
      />
    </CraftNavigationBlockContext.Provider>
  );
}
