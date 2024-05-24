"use client";

import { InputField } from "../contentAtoms/InputField";
import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SelectField } from "../contentAtoms/SelectField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import { currencies } from "./currencies";
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
      <StripeConnectField />
      <InputGroup>
        <SelectField
          selectClassName="w-36"
          label="Currency"
          name="currency"
          value={page.currency}
          options={currencies.map((currency) => ({
            value: currency.code,
            label: currency.currency,
          }))}
          onChange={(value) => onChange({ ...page, currency: value })}
        />
        <InputField
          type="number"
          placeholder="Enter price"
          name="price"
          min={0}
          value={page.price === 0 ? 0 : page.price || ""}
          onChange={(e) =>
            onChange({
              ...page,
              price: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
