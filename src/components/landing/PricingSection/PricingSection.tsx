"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PricingSection() {
  return (
    <div className="w-full mx-auto max-w-screen-lg mt-8 mb-8 p-16 rounded-3xl bg-primary text-primary-foreground">
      <h3 className="text-5xl text-center font-bold leading-[3.25rem] font-landing-secondary">
        Pick a plan that works for you
      </h3>
      <div className="text-lg leading-[2rem] mt-4 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
      <Tabs defaultValue="personal" className="dark mt-4" value="personal">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="business">Organization</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="personal" asChild>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-primary-foreground p-8 rounded-3xl">
              <h4 className="text-3xl font-bold">Free</h4>
              <div className="text-2xl mt-4">$0/month</div>
              <div className="text-lg mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div className="mt-4">
                <Button className="rounded-full" size="lg" asChild>
                  <Link href="/signup">Get started for free</Link>
                </Button>
                <div className="text-xs mt-2 ">No credit card required</div>
              </div>
            </div>
            <div className="bg-primary-foreground p-8 rounded-3xl">
              <h4 className="text-3xl font-bold">Pro</h4>
              <div className="text-2xl mt-4">$29.99/month</div>
              <div className="text-lg mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div className="mt-4">
                <Button className="rounded-full" size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
