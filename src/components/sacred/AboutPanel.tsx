import { Drawer } from "vaul";
import { X } from "lucide-react";

const SOURCES = [
  {
    name: "The Holy See",
    href: "https://www.vatican.va/",
    note: "Catechism, conciliar constitutions, encyclicals, and papal audiences.",
  },
  {
    name: "United States Conference of Catholic Bishops",
    href: "https://bible.usccb.org/",
    note: "New American Bible Revised Edition, chapter by chapter.",
  },
  {
    name: "Haydock Commentary (1859)",
    href: "https://haydockcommentary.com",
    note: "Public-domain Douay-Rheims commentary, sourced exclusively from haydockcommentary.com.",
  },
];

export function AboutPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line-strong" />
          <div className="flex items-center justify-between px-5 pt-3">
            <Drawer.Title className="font-serif text-lg font-semibold text-fg">
              About and sources
            </Drawer.Title>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-11 items-center justify-center rounded-md text-muted"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
            <p className="text-sm leading-relaxed text-muted">
              Sacred Timeline is a curated prototype. The dataset has been
              substantially expanded — Haydock commentary across confirmed
              chapters of the Catholic canon, richly annotated high-value
              chapters, and a denser Church timeline — while remaining strictly
              limited to three approved sources. No paraphrase of doctrine is
              offered. Every artifact links to its original page. Some chapters
              still have limited annotations pending further verified data: if
              a working sourceUrl cannot be confirmed, the artifact is omitted.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {SOURCES.map((s) => (
                <li
                  key={s.href}
                  className="rounded-md bg-elevated px-3 py-3 shadow-[var(--shadow-border)]"
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gold"
                  >
                    {s.name}
                  </a>
                  <p className="mt-1 text-sm text-muted">{s.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-subtle">
              Artwork is the sole exception to the three-source rule:
              well-known public-domain historical works, attributed via
              Wikimedia Commons. This prototype is not an official publication
              of the Holy See or the USCCB.
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
