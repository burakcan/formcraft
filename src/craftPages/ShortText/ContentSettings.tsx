import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { OptionalInputField } from "../contentAtoms/OptionalInputField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { ShortText } from "./schema";

interface Props {
  page: ShortText;
  onChange: (page: ShortText) => void;
}

export function ShortTextContentSettings(props: Props) {
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
          label="Max characters"
          name="maxLength"
          placeHolder="1 - 999999999"
          type="number"
          value={page.maxLength}
          onChange={(maxLength) => onChange({ ...page, maxLength })}
          format={Number}
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
