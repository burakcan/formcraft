import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SelectField } from "../contentAtoms/SelectField/SelectField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { DateText, DateFormat, Separator } from "./schema";

interface Props {
  page: DateText;
  onChange: (page: DateText) => void;
}

export function DateTextContentSettings(props: Props) {
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
        <SelectField<DateFormat>
          label="Format"
          name="dateFormat"
          value={page.dateFormat}
          selectClassName="w-32"
          options={[
            { value: "MMDDYYYY", label: "MMDDYYYY" },
            { value: "DDMMYYYY", label: "DDMMYYYY" },
            { value: "YYYYMMDD", label: "YYYYMMDD" },
          ]}
          onChange={(value) => onChange({ ...page, dateFormat: value })}
        />
        <SelectField<Separator>
          label="Separator"
          name="separator"
          value={page.separator}
          selectClassName="w-32"
          options={[
            { value: "/", label: "/" },
            { value: "-", label: "-" },
            { value: ".", label: "." },
          ]}
          onChange={(value) => onChange({ ...page, separator: value })}
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
