export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildChapterSegment(chapterNumber: number): string {
  return `chuong-${chapterNumber}`;
}

export function buildReadPath(comicTitle: string, chapterNumber: number): string {
  const slug = slugify(comicTitle || "truyen");
  return buildReadPathFromSlug(slug, chapterNumber);
}

export function buildReadPathFromSlug(slug: string, chapterNumber: number): string {
  return `/read/${slug}/${buildChapterSegment(chapterNumber)}`;
}

export function parseChapterNumber(raw: string): number {
  const match = raw.match(/(\d+)$/);
  if (!match) return Number.NaN;
  return Number(match[1]);
}

export function parseChapterId(raw: string): number {
  if (!/^\d+$/.test(raw)) return Number.NaN;
  return Number(raw);
}
