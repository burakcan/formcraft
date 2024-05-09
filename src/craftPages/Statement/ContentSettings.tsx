import { Logo } from "../contentAtoms/Logo";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import type { Statement } from "./schema";

interface Props {
  page: Statement;
  onChange: (page: Statement) => void;
}

export function StatementContentSettings(props: Props) {
  const { page, onChange } = props;

  return (
    <SettingsWrapper>
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
