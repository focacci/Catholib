import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { DUAL_COLUMN_GRID_CLASS } from "@/lib/timeline/columns";
import {
  nextSheetOverscroll,
  shouldDismissSheetPull,
  startSheetOverscroll,
  type SheetOverscroll,
} from "@/lib/timeline/sheet-dismiss";
import { cn } from "@/lib/utils";
import { StickyGroupHeader } from "./StickyHeaders";

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
    href: "https://thedouayrheims.com/drc/genesis/1",
    note: "Douay-Rheims Challoner revision, chapter by chapter. Used in the Bible view.",
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
    note: "1962 Roman Missal. Catalog cards link to confirmed Missale Meum pages; proper texts remain there. This app does not calculate the liturgical year.",
  },
  {
    name: "Rosary Center & Confraternity",
    href: "https://www.rosarycenter.org/how-to-pray-the-rosary/",
    note: "Scripturally based rosary, including the Luminous Mysteries. Today's rosary in the Missal view links to the mysteries assigned to the civil weekday.",
  },
];

type AboutTab = "about" | "sources";

function AboutCopy() {
  return (
    <>
      <p className="text-base leading-relaxed text-muted">
        Catholib has three views. Bible follows the canon, with chapter
        text in NABRE, RSV-CE, and the Douay-Rheims (Challoner), and
        commentary from Haydock, the Catena Aurea, and Cornelius a
        Lapide. Church follows the history of the Church, with
        encyclopedia articles for events, popes, and saints, and
        magisterial texts from the Holy See. Missal is a static catalog
        of the 1962 Roman Missal: Today, the Ordo Missae, the Temporale,
        the Sanctorale, the Commons, and Votive Masses. Missal cards open
        confirmed pages on Missale Meum. Today also includes the day's
        scripturally based rosary from the Rosary Center.
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted">
        The dataset stays limited to approved sources. No paraphrase of
        doctrine is offered. Every artifact links to its original page. If
        a working sourceUrl cannot be confirmed, the artifact is omitted.
      </p>
    </>
  );
}

function AboutDisclaimer() {
  return (
    <p className="text-sm leading-relaxed text-subtle">
      Artwork is the sole exception to the approved-source list:
      well-known public-domain historical works, attributed via
      Wikimedia Commons. Catholib is not an official publication of the
      Holy See or the USCCB.
    </p>
  );
}

function SourceCard({ name, href, note }: (typeof SOURCES)[number]) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      className={cn(
        "group block w-full overflow-hidden rounded-lg border border-line bg-elevated text-left no-underline",
        "md:transition-[border-color,box-shadow,transform] md:duration-200 md:ease-out",
        "md:hover:border-line-strong md:hover:shadow-[0_10px_28px_#00000050]",
      )}
    >
      <span className="flex flex-col gap-1 px-3 py-2.5 md:transition-transform md:duration-200 md:ease-out md:group-hover:-translate-y-0.5">
        <span className="block w-full font-serif text-lg font-semibold leading-snug text-fg">
          {name}
        </span>
        <span className="block w-full text-sm leading-snug text-muted">{note}</span>
        <span className="mt-1 flex items-end justify-between gap-2">
          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-gold-dim">
            Source
          </span>
        </span>
      </span>
    </a>
  );
}

function SourceList() {
  return (
    <ul className="flex flex-col gap-2">
      {SOURCES.map((source) => (
        <li key={source.href}>
          <SourceCard {...source} />
        </li>
      ))}
    </ul>
  );
}

function AboutTabSwitcher({
  tab,
  onChange,
}: {
  tab: AboutTab;
  onChange: (tab: AboutTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="About and sources"
      className="grid grid-cols-2 rounded-md bg-elevated p-0.5"
      style={{
        boxShadow: "0 0 0 1px color-mix(in oklab, var(--color-gold) 30%, transparent)",
      }}
    >
      {(
        [
          { id: "about", label: "About" },
          { id: "sources", label: "Sources" },
        ] as const
      ).map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onChange(id)}
          className={cn(
            "flex h-10 items-center justify-center rounded-sm font-medium transition-colors duration-150",
            tab === id ? "bg-gold text-bg" : "text-muted",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function AboutView() {
  return (
    <div className="relative pb-[40vh]">
      <div
        className="absolute top-2 bottom-8 left-[var(--rail-x)] w-px timeline-rail"
        aria-hidden
      />
      <div className={DUAL_COLUMN_GRID_CLASS}>
        <section className="min-w-0 dual:col-start-1">
          <StickyGroupHeader className="pl-[var(--rail-pad)]">About</StickyGroupHeader>
          <div className="px-2 pt-3 pl-[calc(var(--rail-pad)+0.5rem)]">
            <AboutCopy />
            <div className="mt-5">
              <AboutDisclaimer />
            </div>
          </div>
        </section>
        <section className="min-w-0 dual:col-start-2">
          <StickyGroupHeader>Sources</StickyGroupHeader>
          <div className="px-2 pt-3">
            <SourceList />
          </div>
        </section>
      </div>
    </div>
  );
}

function applySheetPull(sheet: HTMLElement, pullY: number, snapping = false) {
  sheet.style.transition = snapping ? "transform 0.25s var(--ease-out)" : "none";
  sheet.style.transform = `translate3d(0, ${Math.max(0, pullY)}px, 0)`;
}

function clearSheetPull(sheet: HTMLElement) {
  sheet.style.transform = "";
  sheet.style.transition = "";
}

export function AboutPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<AboutTab>("about");
  const [sheetNodes, setSheetNodes] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<SheetOverscroll>(startSheetOverscroll(0));
  const activeRef = useRef(false);
  const suppressClickRef = useRef(false);

  const setScrollNode = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
    setSheetNodes((n) => n + 1);
  }, []);
  const setSheetNode = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setSheetNodes((n) => n + 1);
  }, []);

  useEffect(() => {
    if (open) setTab("about");
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    let cancelled = false;
    let detach = () => {};

    const tryAttach = () => {
      if (cancelled) return;
      const scroll = scrollRef.current;
      const sheet = contentRef.current;
      if (!scroll || !sheet) {
        requestAnimationFrame(tryAttach);
        return;
      }

      const unbindMove = { current: () => {} };

    const onMove = (event: Event, clientY: number) => {
      if (!activeRef.current) return;
      const next = nextSheetOverscroll({
        prev: gestureRef.current,
        clientY,
        scrollTop: scroll.scrollTop,
      });
      gestureRef.current = next;
      if (next.pulling) {
        if ("cancelable" in event && event.cancelable) event.preventDefault();
        applySheetPull(sheet, next.pullY);
        if (next.pullY > 8) suppressClickRef.current = true;
        return;
      }
      applySheetPull(sheet, 0);
    };

    const onEnd = () => {
      unbindMove.current();
      unbindMove.current = () => {};
      if (!activeRef.current) return;
      activeRef.current = false;
      const { pulling, pullY } = gestureRef.current;
      gestureRef.current = startSheetOverscroll(0);
      if (!pulling) return;
      if (shouldDismissSheetPull(pullY)) {
        clearSheetPull(sheet);
        onOpenChange(false);
        return;
      }
      applySheetPull(sheet, 0, true);
      const done = () => {
        sheet.removeEventListener("transitionend", done);
        clearSheetPull(sheet);
      };
      sheet.addEventListener("transitionend", done);
    };

    const bindWindow = () => {
      const onWinPointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        onMove(event, event.clientY);
      };
      window.addEventListener("pointermove", onWinPointerMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
      window.addEventListener("touchend", onEnd);
      window.addEventListener("touchcancel", onEnd);
      unbindMove.current = () => {
        window.removeEventListener("pointermove", onWinPointerMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
      };
    };

    const onStart = (clientY: number) => {
      unbindMove.current();
      activeRef.current = true;
      gestureRef.current = startSheetOverscroll(clientY, scroll.scrollTop);
      bindWindow();
    };

    const onNativeScroll = () => {
      if (!activeRef.current || gestureRef.current.pulling) return;
      gestureRef.current = {
        ...gestureRef.current,
        lastScrollTop: scroll.scrollTop,
      };
    };

    const onClickCapture = (event: Event) => {
      if (!suppressClickRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      onStart(event.clientY);
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches[0]) onStart(event.touches[0].clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) onMove(event, event.touches[0].clientY);
    };

    scroll.addEventListener("pointerdown", onPointerDown);
    scroll.addEventListener("scroll", onNativeScroll, { passive: true });
    scroll.addEventListener("click", onClickCapture, true);
    scroll.addEventListener("touchstart", onTouchStart, { passive: true });
    scroll.addEventListener("touchmove", onTouchMove, { passive: false });

    detach = () => {
      unbindMove.current();
      scroll.removeEventListener("pointerdown", onPointerDown);
      scroll.removeEventListener("scroll", onNativeScroll);
      scroll.removeEventListener("click", onClickCapture, true);
      scroll.removeEventListener("touchstart", onTouchStart);
      scroll.removeEventListener("touchmove", onTouchMove);
      clearSheetPull(sheet);
    };
    };

    tryAttach();
    return () => {
      cancelled = true;
      detach();
    };
  }, [open, onOpenChange, sheetNodes]);

  return (
    <Drawer.Root handleOnly open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content
          ref={setSheetNode}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col overflow-hidden overscroll-none rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none"
        >
          <Drawer.Handle className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
          <div className="shrink-0 px-[max(1.25rem,var(--safe-x))] pt-3 pb-2">
            <Drawer.Title className="sr-only">
              {tab === "about" ? "About" : "Sources"}
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              Editorial notes and approved sources for Catholib.
            </Drawer.Description>
            <AboutTabSwitcher
              tab={tab}
              onChange={(next) => {
                setTab(next);
                scrollRef.current?.scrollTo({ top: 0 });
              }}
            />
          </div>
          <div
            ref={setScrollNode}
            data-vaul-no-drag=""
            className="min-h-0 flex-1 overflow-y-auto overscroll-none px-[max(1.25rem,var(--safe-x))] pt-1 pb-[max(1.5rem,env(safe-area-inset-bottom))] [overflow-anchor:none] [-webkit-overflow-scrolling:touch]"
          >
            {tab === "about" ? (
              <>
                <AboutCopy />
                <div className="mt-5">
                  <AboutDisclaimer />
                </div>
              </>
            ) : (
              <SourceList />
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
