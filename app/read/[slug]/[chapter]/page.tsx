import ReadClient from "../../_components/ReadClient";
import { parseChapterNumber } from "../../../../lib/slug";

export default function ReadSlugPage({ params }: { params: { slug: string; chapter: string } }) {
  const chapterNumber = parseChapterNumber(params.chapter);
  return <ReadClient slug={params.slug} chapterNumber={chapterNumber} />;
}
