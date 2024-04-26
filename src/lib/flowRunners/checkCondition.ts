export function checkCondition(
  a: FormCraft.CraftAnswer,
  b: string,
  operator: FormCraft.BranchingConditionType
) {
  switch (operator) {
    case "eq":
      return String(a).toLowerCase() === String(b).toLowerCase();
    case "neq":
      return String(a).toLowerCase() !== String(b).toLowerCase();
    case "gt":
      return Number(a) > Number(b);
    case "lt":
      return Number(a) < Number(b);
    case "gte":
      return Number(a) >= Number(b);
    case "lte":
      return Number(a) <= Number(b);
    case "contains":
      return String(a).toLowerCase().includes(String(b).toLowerCase());
    case "not_contains":
      return !String(a).toLowerCase().includes(String(b).toLowerCase());
    case "starts_with":
      return String(a).toLowerCase().startsWith(String(b).toLowerCase());
    case "ends_with":
      return String(a).toLowerCase().endsWith(String(b).toLowerCase());

    default:
      return false;
  }
}
