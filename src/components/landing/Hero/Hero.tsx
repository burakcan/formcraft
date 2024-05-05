import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="container pt-8 pb-16">
      <div className="grid grid-cols-[1fr_1fr] gap-8 justify-center items-center">
        <div className="relative">
          <Image
            className="rounded-lg ring-1 ring-offset-4 ring-gray-300 ring-offset-gray-200"
            src="/landing-images/onboarding-form.png"
            alt="Form builder"
            width={1000}
            height={1000}
          />
        </div>
        <div className="w-full">
          <h1 className="text-5xl font-bold leading-[3.25rem] font-landing-secondary">
            Lorem ipsum
            <br />
            Dolor sit amet
          </h1>
          <Badge className=" pointer-events-none flex-none inline-block bg-blue-100 text-blue-700 mt-2">
            An afforable alternative to Typeform
          </Badge>
          <div className="text-lg leading-[2rem] mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
            tincidunt, nunc non vestibulum bibendum, sem mi fermentum orci.
          </div>
          <div className="mt-8 grid grid-cols-[auto_1fr] gap-2">
            <div>
              <Button
                className="bg-rose-600 text-white rounded-full "
                size="lg"
              >
                Get started for free
              </Button>
              <div className="text-xs mt-2 text-gray-500 text-center">
                🎉 Unlimited forms & responses
              </div>
            </div>
            <div>
              <Button variant="link" size="lg">
                See example forms
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
