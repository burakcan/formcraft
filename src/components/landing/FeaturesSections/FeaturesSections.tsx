import Image from "next/image";
import { Button } from "@/components/ui/button";

export function FeaturesSections() {
  return (
    <div className="relative">
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
            <h2 className="text-5xl font-bold leading-[3.25rem] font-landing-secondary">
              Lorem ipsum
              <br />
              Dolor sit amet
            </h2>
            <div className="text-lg leading-[2rem] mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              tincidunt, nunc non vestibulum bibendum, sem mi fermentum orci.
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
              <div>
                <Button className="rounded-full " size="lg">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-16 pb-16">
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
            <h2 className="text-5xl font-bold leading-[3.25rem] font-landing-secondary">
              Lorem ipsum
              <br />
              Dolor sit amet
            </h2>
            <div className="text-lg leading-[2rem] mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              tincidunt, nunc non vestibulum bibendum, sem mi fermentum orci.
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
              <div>
                <Button className="rounded-full " size="lg">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-16 pb-16">
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
            <h2 className="text-5xl font-bold leading-[3.25rem] font-landing-secondary">
              Lorem ipsum
              <br />
              Dolor sit amet
            </h2>
            <div className="text-lg leading-[2rem] mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              tincidunt, nunc non vestibulum bibendum, sem mi fermentum orci.
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
              <div>
                <Button className="rounded-full " size="lg">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
