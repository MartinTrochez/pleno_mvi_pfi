export function ShortcutKbd({ value }: { value: string }) {
  return (
    <kbd
      className="ml-2 pointer-events-none inline-flex items-center 
      rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-muted-foreground"
    >
      {value}
    </kbd>
  );
}
