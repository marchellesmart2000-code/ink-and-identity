import Markdown from "react-markdown";

export function RichTextRenderer({ content }: { content: string }) {
  return (
    <div className="space-y-4 text-[1.05rem] leading-8 text-ivory/75 [&_h2]:display [&_h2]:text-3xl [&_h2]:text-ivory [&_a]:text-gold">
      <Markdown>{content}</Markdown>
    </div>
  );
}
