"use client";

import Link from "next/link";
import { forwardRef, useContext, type ComponentProps } from "react";
import { CraftNavigationBlockContext } from "./CraftNavigationBlock";

export const BlockerLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link>
>(function BlockerLink(props, ref) {
  const { dirty, setShowModal, setTargetHref } = useContext(
    CraftNavigationBlockContext
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dirty) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      setShowModal(true);
      setTargetHref(props.href);
      return;
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return <Link ref={ref} {...props} onClick={handleClick} />;
});
