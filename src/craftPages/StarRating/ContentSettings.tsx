import { useMemo } from "react";
import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SelectField } from "../contentAtoms/SelectField";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import { VariableName } from "../contentAtoms/VariableName";
import type { StarRating } from "./schema";

interface Props {
  page: StarRating;
  onChange: (page: StarRating) => void;
}

export function StarRatingContentSettings(props: Props) {
  const { page, onChange } = props;
  const numStarsOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
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
          selectClassName="w-24"
          label="Icon"
          name="ratingIcon"
          value={page.ratingIcon}
          options={[
            { value: "star", label: "Star" },
            { value: "heart", label: "Heart" },
            { value: "thumb", label: "Thumb" },
            { value: "smiley", label: "Smiley" },
          ]}
          onChange={(value) => onChange({ ...page, ratingIcon: value })}
        />
        <SelectField
          selectClassName="w-24"
          label="Maximum"
          name="max"
          value={String(page.numStars)}
          options={numStarsOptions}
          onChange={(value) => onChange({ ...page, numStars: Number(value) })}
        />
      </InputGroup>
      <VariableName page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
