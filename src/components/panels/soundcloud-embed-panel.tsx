export function SoundCloudEmbedPanel({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="w-full">
      <iframe
        style={{ height: "min(65vh, 620px)" }}
        width="100%"
        scrolling="no"
        frameBorder="no"
        allow="autoplay; encrypted-media"
        src={embedUrl}
      />
    </div>
  );
}
