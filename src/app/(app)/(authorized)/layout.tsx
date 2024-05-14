import { auth } from "@clerk/nextjs/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getPaddleIds } from "@/services/db/paddle";

export const metadata: Metadata = {
  title: "FormCraft",
  description: "A form builder",
};

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = auth();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["subscriptions", authData.userId, authData.orgId || ""],
      queryFn: async () => getPaddleIds(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
