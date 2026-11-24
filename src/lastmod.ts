import type { ContentRecord } from "./schema";

function maxDate(dates: string[]): string | undefined {
  return dates.length ? [...dates].sort().at(-1) : undefined;
}

export function lastmodFor(page: ContentRecord, now: Date): string | null {
  const sectionDates = (page.sections?.map((s) => s.editedAt).filter(Boolean) ??
    []) as string[];
  const stamp =
    page.contentUpdatedAt || maxDate(sectionDates) || page.firstPublishedAt;
  if (!stamp) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(stamp)) {
    throw new Error(`BAD_LASTMOD: ${page.url} has unparsable '${stamp}'`);
  }
  const d = new Date(`${stamp}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== stamp) {
    throw new Error(`BAD_LASTMOD: ${page.url} has unparsable '${stamp}'`);
  }

  const todayUtc = now.toISOString().slice(0, 10);
  if (stamp > todayUtc) {
    throw new Error(
      `FUTURE_LASTMOD: ${page.url} -> '${stamp}' is after build date ${todayUtc}. Fix the content record; never ship build-time or future stamps.`,
    );
  }
  return stamp;
}
