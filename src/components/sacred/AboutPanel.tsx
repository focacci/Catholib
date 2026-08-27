import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { useIsDesktop } from "@/lib/media";

const SOURCES = [
  {
    name: "The Holy See",
    href: "https://www.vatican.va/",
    note: "Catechism, conciliar constitutions, encyclicals, and papal audiences. Used in the Bible and Church views.",
  },
  {
    name: "Catholic Encyclopedia (New Advent)",
    href: "https://www.newadvent.org/cathen/",
    note: "Public-domain Catholic Encyclopedia articles. Saint, pope, and event cards in the Church view link to confirmed encyclopedia pages when those articles exist. Later events, including the Second Vatican Council, link to the Holy See.",
  },
  {
    name: "United States Conference of Catholic Bishops",
    href: "https://bible.usccb.org/",
    note: "New American Bible Revised Edition (NABRE), chapter by chapter. Used in the Bible view.",
  },
  {
    name: "EWTN",
    href: "https://www.ewtn.com/bible",
    note: "Revised Standard Version Catholic Edition (RSV-CE), chapter by chapter. Used in the Bible view.",
  },
  {
    name: "The Douay-Rheims Bible",
    href: "https://thedouayrheims.com/",
    note: "Original Douay-Rheims Bible, chapter by chapter. Used in the Bible view.",
  },
  {
    name: "Haydock Commentary (1859)",
    href: "https://haydockcommentary.com",
    note: "Public-domain Douay-Rheims commentary, sourced exclusively from haydockcommentary.com. Used in the Bible view.",
  },
  {
    name: "Catena Aurea",
    href: "https://www.ecatholic2000.com/catena/",
    note: "St. Thomas Aquinas’s Golden Chain on the four Gospels, sourced exclusively from ecatholic2000.com. Used in the Bible view.",
  },
  {
    name: "Cornelius a Lapide",
    href: "https://lapide.org",
    note: "Public-domain Commentaria in Scripturam Sacram, sourced exclusively from lapide.org. Used in the Bible view. Job and Psalms are omitted; Lapide never published those books.",
  },
  {
    name: "Missale Meum",
    href: "https://www.missalemeum.com/en",
    note: "1962 Roman Missal. Sole source for the Missal view. Cards link to confirmed Missale Meum pages; proper texts remain there. This app does not calculate the liturgical year.",
  },
];

function AboutCopy() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted">
        Catholib has three views. Bible follows the canon, with chapter
        text in NABRE, RSV-CE, and the Douay-Rheims, and commentary from
        Haydock, the Catena Aurea, and Cornelius a Lapide. Church follows
        the history of the Church, with encyclopedia articles for events,
        popes, and saints, and magisterial texts from the Holy See. Missal
        is a static catalog of the 1962 Roman Missal: Today, the Ordo
        Missae, the Temporale, the Sanctorale, the Commons, and Votive
        Masses, each card opening a confirmed page on Missale Meum.
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted">
        The dataset stays limited to approved sources. No paraphrase of
        doctrine is offered. Every artifact links to its original page. If
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
            <p className="mt-1 text-base text-muted">{s.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-relaxed text-subtle">
        Artwork is the sole exception to the approved-source list:
        well-known public-domain historical works, attributed via
        Wikimedia Commons. Catholib is not an official publication of the
        Holy See or the USCCB.
      </p>
    </>
  );
}

export function AboutPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const desktop = useIsDesktop();

  if (desktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(42rem,85dvh)] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
            <div className="flex shrink-0 items-center justify-between px-5 pt-4">
              <Dialog.Title className="font-serif text-xl font-semibold text-fg">
                About and sources
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Editorial notes and approved sources for Catholib.
              </Dialog.Description>
              <Dialog.Close
                className="flex size-11 items-center justify-center rounded-md text-muted hover:text-fg"
                aria-label="Close"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-6 [max-height:calc(85dvh-4.5rem)]">
              <AboutCopy />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
          <div className="flex shrink-0 items-center justify-between px-5 pt-3">
            <Drawer.Title className="font-serif text-xl font-semibold text-fg">
              About and sources
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              Editorial notes and approved sources for Catholib.
            </Drawer.Description>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-11 items-center justify-center rounded-md text-muted"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] [max-height:calc(88dvh-4.75rem)]">
            <AboutCopy />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
