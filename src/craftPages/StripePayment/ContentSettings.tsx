"use client";

import { useAuth } from "@clerk/nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TryProButton } from "@/components/TryProButton";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
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
  const craftId = useEditCraftStore((state) => state.craft.id);
  const { page, onChange } = props;
  const authData = useAuth();
  const { data: subscriptionData } = useSubscriptionQuery(
    authData.userId!,
    authData.orgId || ""
  );

  const hasActiveSubscription =
    subscriptionData?.status === "active" ||
    subscriptionData?.status === "trialing";

  return (
    <SettingsWrapper>
      <StripeConnectField />
      <InputGroup>
        <SwitchField
          label="Required"
          name="required"
          checked={page.required}
          onCheckedChange={(value) => onChange({ ...page, required: value })}
        />
        <SwitchField
          label="Collect billing address"
          name="collectAddress"
          checked={page.collectAddress}
          onCheckedChange={(value) =>
            onChange({ ...page, collectAddress: value })
          }
        />
      </InputGroup>
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
          wrapperClassName="flex items-center justify-between gap-2"
          inputClassName="w-36"
          label="Price"
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
        {!hasActiveSubscription && (
          <Alert>
            <AlertDescription>
              In the free plan, Formcraft takes a 1% fee on all transactions.
              Switch to Pro to remove this fee.
              <TryProButton
                organization
                className="w-full mt-2"
                returnPath={`/form/${craftId}/edit?page=${page.id}`}
              />
            </AlertDescription>
          </Alert>
        )}
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
