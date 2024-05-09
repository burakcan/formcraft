import type { Statement } from "./schema";

interface Props {
  page: Statement;
  onChange: (page: Statement) => void;
}

export function StatementContentSettings(props: Props) {
  const { page, onChange } = props;
  return <div></div>;
}
