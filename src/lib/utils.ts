import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ErrorType } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genericApiError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { message: error.meta?.cause, code: ErrorType.Prisma_Error },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { message: error.message, code: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ error }, { status: 400 });
}

export function splitContentAndEnding(pages: FormCraft.CraftPage[]) {
  const [endingPages, contentPages] = pages.reduce(
    (acc, page) => {
      if (page.type === "end_screen") {
        acc[0].push(page);
      } else {
        acc[1].push(page);
      }
      return acc;
    },
    [[], []] as [FormCraft.CraftPage[], FormCraft.CraftPage[]]
  );

  return { endingPages, contentPages };
}

export function findPageIndexes(pages: FormCraft.CraftPage[], pageId: string) {
  const { endingPages, contentPages } = splitContentAndEnding(pages);

  const indexInContent = contentPages.findIndex((p) => p.id === pageId);
  const indexInEndings = endingPages.findIndex((p) => p.id === pageId);
  const index = pages.findIndex((p) => p.id === pageId);

  return {
    indexInContent,
    indexInEndings,
    index,
  };
}

export function shiftEndingsToEnd(pages: FormCraft.CraftPage[]) {
  const { endingPages, contentPages } = splitContentAndEnding(pages);
  return [...contentPages, ...endingPages];
}
