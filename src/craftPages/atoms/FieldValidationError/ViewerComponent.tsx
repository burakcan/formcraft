interface Props {
  children: React.ReactNode;
}

export function FieldValidationErrorViewer(props: Props) {
  return (
    <div className="bg-rose-100 text-rose-800 font-semibold p-1 rounded text-xs mt-2 inline-block">
      {props.children}
    </div>
  );
}
