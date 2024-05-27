import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import type { Website } from "./schema";

interface Props {
  page: Website;
  onChange: (page: Website) => void;
}

export function WebsiteContentSettings(props: Props) {
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

      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
