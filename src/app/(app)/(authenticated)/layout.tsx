import { auth } from "@clerk/nextjs/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Confetti from "@/components/Confetti";
import { getStripeSubscription } from "@/services/stripe/server";

export const metadata: Metadata = {
  title: "FormCraft",
  description: "A form builder",
};

export default async function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = await auth();
  const queryClient = new QueryClient();

  if (!authData || !authData.userId) {
    redirect("/sign-in");
  }

  await queryClient.prefetchQuery({
    queryKey: ["subscription", authData.userId, authData.orgId || ""],
    queryFn: async () =>
      getStripeSubscription(
        authData.orgId
          ? { organizationId: authData.orgId }
          : { userId: authData.userId }
      ),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
      <Suspense fallback={null}>
        <Confetti />
      </Suspense>
    </>
  );
}
