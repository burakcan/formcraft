import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup } from "../contentAtoms/InputGroup";
import { Logo } from "../contentAtoms/Logo";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import { SwitchField } from "../contentAtoms/SwitchField";
import type { Dropdown } from "./schema";

interface Props {
  page: Dropdown;
  onChange: (page: Dropdown) => void;
}

export function DropdownContentSettings(props: Props) {
  const { page, onChange } = props;

  return (
    <SettingsWrapper>
      <InputGroup>
        <div className="space-y-2">
          <Label>Placeholder Text</Label>
          <Input
            value={page.placeholder ?? ""}
            onChange={(e) => onChange({ ...page, placeholder: e.target.value })}
            placeholder="Select an option..."
          />
        </div>
      </InputGroup>

      <InputGroup>
        <SwitchField
          label={
            <div className="space-y-0.5">
              <div>Required</div>
              <div className="text-sm text-muted-foreground">
                Require an answer before proceeding
              </div>
            </div>
          }
          name="required"
          checked={page.required}
          onCheckedChange={(value) => onChange({ ...page, required: value })}
        />

        <SwitchField
          label={
            <div className="space-y-0.5">
              <div>Clearable</div>
              <div className="text-sm text-muted-foreground">
                Allow clearing the selected value
              </div>
            </div>
          }
          name="clearable"
          checked={page.clearable}
          onCheckedChange={(value) => onChange({ ...page, clearable: value })}
        />

        <SwitchField
          label={
            <div className="space-y-0.5">
              <div>Randomize Options</div>
              <div className="text-sm text-muted-foreground">
                Randomize the order of options
              </div>
            </div>
          }
          name="randomize"
          checked={page.randomize}
          onCheckedChange={(value) => onChange({ ...page, randomize: value })}
        />
      </InputGroup>

      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
