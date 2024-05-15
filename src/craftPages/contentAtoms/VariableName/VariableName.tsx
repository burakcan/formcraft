import { CircleHelpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InputGroup } from "../InputGroup";
import { OptionalInputField } from "../OptionalInputField";

interface Props<T> {
  page: T;
  onChange: (page: T) => void;
}

export function VariableName<T extends FormCraft.CraftPage>(props: Props<T>) {
  const { page, onChange } = props;

  return (
    <InputGroup>
      <OptionalInputField
        name="variableName"
        placeHolder="eg. age, name, email, etc."
        value={page.variableName}
        onChange={(newValue) =>
          onChange({
            ...page,
            variableName: newValue,
          })
        }
        label={
          <>
            Variable name
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelpIcon className="size-4 ml-1 inline-block" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  You can refer to this answer in the next pages by using <br />
                  this variable name like <code>{`{variable_name}`}</code>.
                </p>
              </TooltipContent>
            </Tooltip>
          </>
        }
      />
    </InputGroup>
  );
}
