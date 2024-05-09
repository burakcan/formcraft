import { InputField } from "../InputField";
import { InputGroup } from "../InputGroup";

interface Props<T> {
  page: T;
  onChange: (page: T) => void;
}

export function BaseContent<T extends FormCraft.CraftPage>(props: Props<T>) {
  const { page, onChange } = props;

  return (
    <InputGroup>
      <InputField
        label="Title"
        name="title"
        value={page.title}
        onChange={(e) => onChange({ ...page, title: e.target.value })}
      />
      <InputField
        label="Description"
        name="description"
        value={page.description}
        onChange={(e) => onChange({ ...page, description: e.target.value })}
      />
    </InputGroup>
  );
}
