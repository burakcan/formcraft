export function MadeWithFormCraft() {
  return (
    <div className="px-1 text-[10px] bg-craft-button text-craft-button-text shadow-md absolute bottom-8 right-8 z-10 rounded-md">
      Powered by{" "}
      <a
        href="https://formcraft.io"
        target="_blank"
        rel="noopener noreferrer"
        className=" no-underline bold text-craft-button-text"
      >
        FormCraft
      </a>
    </div>
  );
}
