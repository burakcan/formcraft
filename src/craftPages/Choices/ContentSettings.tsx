import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { OptionalInputField } from "../contentAtoms/OptionalInputField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { Choices } from "./schema";

interface Props {
  page: Choices;
  onChange: (page: Choices) => void;
}

export function ChoicesContentSettings(props: Props) {
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
        <SwitchField
          label="Multiple selection"
          name="multiple"
          checked={page.multiple}
          onCheckedChange={(value) => onChange({ ...page, multiple: value })}
        />
        {page.multiple && (
          <>
            <OptionalInputField
              label="Minimum selections"
              name="minSelections"
              placeHolder=""
              type="number"
              value={page.minSelections}
              onChange={(minSelections) => onChange({ ...page, minSelections })}
              format={(v) => Math.abs(Number(v))}
            />
            <OptionalInputField
              label="Maximum selections"
              name="maxSelections"
              placeHolder=""
              type="number"
              value={page.maxSelections}
              onChange={(maxSelections) => onChange({ ...page, maxSelections })}
              format={(v) => Math.abs(Number(v))}
            />
          </>
        )}
        <SwitchField
          label="Randomize"
          name="randomize"
          checked={page.randomize}
          onCheckedChange={(value) => onChange({ ...page, randomize: value })}
        />
        <SwitchField
          label="Horizontal orientation"
          name="orientation"
          checked={page.orientation === "horizontal"}
          onCheckedChange={(value) =>
            onChange({
              ...page,
              orientation: value ? "horizontal" : "vertical",
            })
          }
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
