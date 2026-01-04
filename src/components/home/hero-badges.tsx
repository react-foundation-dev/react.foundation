export function HeroBadges() {
  return (
    <div className="mt-4 rounded-lg bg-muted/50 px-4 py-4 sm:mt-0 sm:bg-transparent sm:px-0 sm:py-0">
      <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-foreground/50 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 shrink-0 bg-success/50" />
          <span className="whitespace-nowrap">100% Transparent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 shrink-0 bg-primary/50" />
          <span className="whitespace-nowrap">Community First</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 shrink-0 bg-destructive/50" />
          <span className="whitespace-nowrap">Open Source</span>
        </div>
      </div>
    </div>
  );
}
