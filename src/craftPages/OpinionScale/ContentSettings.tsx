import { useMemo } from "react";
import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SelectField } from "../contentAtoms/SelectField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import type { OpinionScale } from "./schema";

interface Props {
  page: OpinionScale;
  onChange: (page: OpinionScale) => void;
}

export function OpinionScaleContentSettings(props: Props) {
  const { page, onChange } = props;
  const minValueOptions = useMemo(
    () =>
      Array.from({ length: 2 }, (_, i) => ({
        value: String(i),
        label: String(i),
      })),
    []
  );

  const maxValueOptions = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        value: String(i + 5),
        label: String(i + 5),
      })),
    []
  );

  return (
    <SettingsWrapper>
      <InputGroup>
        <SwitchField
          label="Required"
          name="required"
          checked={page.required}
          onCheckedChange={(value) => onChange({ ...page, required: value })}
        />
        <SelectField
          selectClassName="w-16"
          label="From"
          name="min"
          value={String(page.min)}
          options={minValueOptions}
          onChange={(value) => onChange({ ...page, min: Number(value) })}
        />
        <SelectField
          selectClassName="w-16"
          label="To"
          name="max"
          value={String(page.max)}
          options={maxValueOptions}
          onChange={(value) => onChange({ ...page, max: Number(value) })}
        />
      </InputGroup>

      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
