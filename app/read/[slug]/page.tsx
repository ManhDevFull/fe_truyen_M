import ReadClient from "../_components/ReadClient";
import { parseChapterId } from "../../../lib/slug";

export default function ReadLegacyPage({ params }: { params: { slug: string } }) {
  const chapterId = parseChapterId(params.slug);
  return <ReadClient chapterId={chapterId} />;
}
