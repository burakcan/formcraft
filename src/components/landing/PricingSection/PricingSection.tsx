"use client";

import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Free, pro, organization

export function PricingSection() {
  return (
    <>
      <div className="w-full mx-auto max-w-screen-lg mt-8 mb-8 p-16 rounded-3xl bg-primary text-primary-foreground">
        <h3 className="text-5xl text-center font-bold leading-[3.25rem] font-landing-secondary">
          Pick a plan that works for you
        </h3>
        <div className="text-lg leading-[2rem] mt-4 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="h-full">
            <div className="relative flex flex-col h-full p-8 rounded-2xl bg-white  ">
              <div className="mb-5">
                <div className="text-gray-900  font-semibold mb-1">Free</div>
                <div className="inline-flex items-baseline mb-2">
                  <span className="text-gray-900 font-bold text-3xl">$</span>
                  <span className="text-gray-900 font-bold text-4xl">0</span>
                  <span className="text-gray-500 font-light">/mo</span>
                </div>
                <div className="text-sm text-gray-500 mb-5">
                  There are many variations available, but the majority have
                  suffered.
                </div>
                <Button className="w-full rounded-full" size="lg" asChild>
                  <Link href="/auth/sign-up">Get started for free</Link>
                </Button>
                <div className="text-xs mt-2 text-gray-500 text-center">
                  No credit card required
                </div>
              </div>
              <div className="text-gray-900 font-medium mb-3">Includes:</div>
              <ul className="text-gray-600 text-sm space-y-3 grow">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Unlimited placeholder texts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Consectetur adipiscing elit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Excepteur sint occaecat cupidatat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Officia deserunt mollit anim</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-full">
            <div className="relative flex flex-col h-full p-8 rounded-2xl bg-white  ">
              <div className="mb-5">
                <div className="text-gray-900  font-semibold mb-1">Pro</div>
                <div className="inline-flex items-baseline mb-2">
                  <span className="text-gray-900 font-bold text-3xl">$</span>
                  <span className="text-gray-900 font-bold text-4xl">
                    29.99
                  </span>
                  <span className="text-gray-500 font-light">/mo</span>
                </div>
                <div className="text-sm text-gray-500 mb-5">
                  There are many variations available, but the majority have
                  suffered.
                </div>
                <Button
                  className="w-full rounded-full bg-rose-600"
                  size="lg"
                  asChild
                >
                  <Link href="/auth/sign-up">Get started</Link>
                </Button>
                <div className="text-xs mt-2 text-transparent text-center">
                  -
                </div>
              </div>
              <div className="text-gray-900 font-medium mb-3">Includes:</div>
              <ul className="text-gray-600 text-sm space-y-3 grow">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Unlimited placeholder texts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Consectetur adipiscing elit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Excepteur sint occaecat cupidatat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Officia deserunt mollit anim</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-full">
            <div className="relative flex flex-col h-full p-8 rounded-2xl bg-white  ">
              <div className="mb-5">
                <div className="text-gray-900  font-semibold mb-1">
                  Organization
                </div>
                <div className="inline-flex items-baseline mb-2">
                  <span className="text-gray-900 font-bold text-3xl">$</span>
                  <span className="text-gray-900 font-bold text-4xl">
                    49.99
                  </span>
                  <span className="text-gray-500 font-light">/mo</span>
                </div>
                <div className="text-sm text-gray-500 mb-5">
                  There are many variations available, but the majority have
                  suffered.
                </div>
                <Button
                  className="w-full rounded-full bg-blue-600"
                  size="lg"
                  asChild
                >
                  <Link href="/auth/sign-up">Get started</Link>
                </Button>
                <div className="text-xs mt-2 text-transparent text-center">
                  -
                </div>
              </div>
              <div className="text-gray-900 font-medium mb-3">Includes:</div>
              <ul className="text-gray-600 text-sm space-y-3 grow">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Unlimited placeholder texts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Consectetur adipiscing elit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Excepteur sint occaecat cupidatat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="flex-none size-5 text-emerald-500" />
                  <span>Officia deserunt mollit anim</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pt-8">
        <div className="w-full mx-auto max-w-screen-lg flex flex-col items-center">
          <h2 className="text-2xl text-center font-landing">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
            tincidunt, nunc non vestibulum bibendum, sem mi fermentum orci.
          </h2>
          <Button className="mt-8 rounded-full bg-rose-600" size="lg" asChild>
            <Link href="/auth/sign-up">Get started for free</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
