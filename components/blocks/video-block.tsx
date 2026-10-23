import { Section } from "./section";
import type { VideoBlockProps } from "./types";
import { VideoPlayer } from "./video-player";

const embedUrls: Record<string, (id: string) => string> = {
  youtube: (id) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`,
};

/** Not in the documented block list: proof that a new type is one component and one registry line. */
export function VideoBlock({ block, ctx }: VideoBlockProps) {
  const embed = embedUrls[block.provider];
  if (!embed) return null;

  const title = block.title ?? ctx.messages.video.fallbackTitle;
  return (
    <Section id={block.id} title={block.title}>
      <VideoPlayer
        embedUrl={embed(block.videoId)}
        posterUrl={block.posterUrl}
        title={title}
        playLabel={ctx.messages.video.play(title)}
      />
    </Section>
  );
}
