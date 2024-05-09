import { CtaContent } from "../contentAtoms/CtaContent";
import { Logo } from "../contentAtoms/Logo";
import { SettingsWrapper } from "../contentAtoms/SettingsWrapper";
import type { EndScreen } from "./schema";

interface Props {
  page: EndScreen;
  onChange: (page: EndScreen) => void;
}

export function EndScreenContentSettings(props: Props) {
  const { page, onChange } = props;

  return (
    <SettingsWrapper>
      <CtaContent page={page} onChange={onChange} />
      <Logo page={page} onChange={onChange} />
    </SettingsWrapper>
  );
}
