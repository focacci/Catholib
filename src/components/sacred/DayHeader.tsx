export function DayHeader() {
  return (
    <header className="shrink-0 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
      <div className="flex h-11">
        <div className="flex w-full items-center justify-center px-5 lg:w-64 lg:justify-start lg:border-r lg:border-line lg:bg-surface">
          <p className="font-serif text-lg font-semibold tracking-tight text-gold">
            Catholib
          </p>
        </div>
        <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />
      </div>
    </header>
  );
}
