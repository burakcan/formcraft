import { BarLoader } from "@/components/BarLoader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <BarLoader />
    </div>
  );
}
