import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/sacred/AppShell";

function previewDate(raw: unknown): Date | undefined {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const [year, month, day] = raw.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const date = typeof search.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(search.date)
      ? search.date
      : undefined;
    return date ? { date } : {};
  },
  component: Home,
});

function Home() {
  const { date } = Route.useSearch();
  return <AppShell now={previewDate(date)} />;
}
