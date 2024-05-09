import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { OptionalInputField } from "../contentAtoms/OptionalInputField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { NumberInput } from "./schema";

interface Props {
  page: NumberInput;
  onChange: (page: NumberInput) => void;
}

export function NumberInputContentSettings(props: Props) {
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
        <OptionalInputField
          label="Minimum value"
          name="min"
          placeHolder="1 - 999999999"
          type="number"
          value={page.min}
          onChange={(min) => onChange({ ...page, min })}
          format={Number}
        />
        <OptionalInputField
          label="Maximum value"
          name="max"
          placeHolder="1 - 999999999"
          type="number"
          value={page.max}
          onChange={(max) => onChange({ ...page, max })}
          format={Number}
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
