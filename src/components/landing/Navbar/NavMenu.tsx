"use client";

import Link from "next/link";
import { forwardRef } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Use cases</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="m-4 mb-0 p-4 text-sm bg-muted text-muted-foreground rounded">
              🚀 Explore practical examples of how Formcraft can enhance your
              form creations.
            </div>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[620px] lg:grid-cols-2">
              <h5 className="col-span-2 text-sm text-muted-foreground">
                Business
              </h5>
              <ListItem href="/docs" title="Client Onboarding Forms">
                Streamline client entry with fast, tailored forms.
              </ListItem>
              <ListItem
                href="/docs/installation"
                title="Customer Satisfaction Surveys"
              >
                Enhance service with quick feedback forms.
              </ListItem>

              <h5 className="col-span-2 text-sm text-muted-foreground">
                Marketing
              </h5>
              <ListItem
                href="/docs/primitives/typography"
                title="Lead Generation Forms"
              >
                Capture leads effortlessly with smart forms.
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Market Research Surveys"
              >
                Conduct surveys to tap into market insights.
              </ListItem>

              <h5 className="col-span-2 text-sm text-muted-foreground">
                Fun & Engagement
              </h5>
              <ListItem
                href="/docs/primitives/typography"
                title="Interactive Quizzes"
              >
                Create fun quizzes for engagement and learning
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Personality Tests"
              >
                Engage users with interactive personality tests.
              </ListItem>

              <h5 className="col-span-2 text-sm text-muted-foreground">
                Startups & E-commerce
              </h5>
              <ListItem
                href="/docs/primitives/typography"
                title="Pre-launch Sign-ups"
              >
                Build anticipation with sleek coming soon pages.
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Sell courses & digital products"
              >
                Sell digital products easily with Stripe integration.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[620px] lg:grid-cols-[1fr_1fr]">
              <ListItem href="/docs" title="Form builder">
                Design and customize forms with ease using our intuitive
                drag-and-drop builder.
              </ListItem>
              <ListItem href="/docs/installation" title="Flow editor">
                Enhance form interactivity with conditional logic that adapts
                based on user responses.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Integrations">
                Connect your forms seamlessly to tools like Stripe, Google
                Sheets, and more for efficient workflow automation.
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Organizations"
              >
                Share a common workspace with your team to streamline form
                creation and management collaboratively.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
