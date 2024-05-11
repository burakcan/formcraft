import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ErrorType } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

export function isMacish() {
  var macOsPattern = /Mac|iPod|iPhone|iPad/;
  return typeof window !== "undefined" &&
    navigator.userAgent.match(macOsPattern)
    ? true
    : false;
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
