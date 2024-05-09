import { InputField } from "../InputField";
import { InputGroup } from "../InputGroup";
import { SwitchField } from "../SwitchField";

interface Props<T> {
  onChange: (page: T) => void;
  page: T;
}

export function CtaContent<T extends FormCraft.CraftPage>(props: Props<T>) {
  const { onChange, page } = props;

  const canDisable = "showCta" in page;
  const ctaEnabled = !canDisable || page.showCta;
  const showLink = ctaEnabled && "ctaLink" in page;

  return (
    <InputGroup>
      {canDisable && (
        <SwitchField
          label="Show button"
          name="showCta"
          checked={page.showCta}
          onCheckedChange={(showCta) => onChange({ ...page, showCta })}
        />
      )}

      {showLink && (
        <InputField
          label="Button link"
          name="ctaLink"
          value={page.ctaLink}
          onChange={(e) => onChange({ ...page, ctaLink: e.target.value })}
        />
      )}
    </InputGroup>
  );
}
