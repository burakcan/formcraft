import { useState } from "react";
import type { Value as E164Number } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input";

export function PhoneNumberFieldEditor() {
  const [phoneNumber, setPhoneNumber] = useState<E164Number>();

  return (
    <div className="w-full px-2 pt-2">
      <PhoneInput
        value={phoneNumber}
        onChange={setPhoneNumber}
        international
        disabled={false}
      />
    </div>
  );
}
