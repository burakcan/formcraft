"use client";

import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { StripePayment } from "./schema";
import { StripeConnectField } from "./StripeConnectField";

interface Props {
  page: StripePayment;
  onChange: (page: StripePayment) => void;
}

export function StripePaymentContentSettings(props: Props) {
  const { page, onChange } = props;

  return (
    <SettingsWrapper>
      <InputGroup>
        <SwitchField
          label="Required"
          name="required"
          checked={page.required}
          onCheckedChange={(value) => onChange({ ...page, required: value })}
        />
      </InputGroup>
      <StripeConnectField page={page} onChange={onChange} />
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
