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