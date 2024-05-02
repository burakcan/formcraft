interface Props {
  withMeta?: boolean;
}

export function PressEnterEditor(props: Props) {
  return (
    <span className="ml-2 text-sm whitespace-nowrap text-craft-description/50">
      or press{" "}
      {props.withMeta ? (
        <>
          <kbd>Meta</kbd> + <kbd>Enter</kbd>
        </>
      ) : (
        <kbd>Enter</kbd>
      )}
    </span>
  );
}
