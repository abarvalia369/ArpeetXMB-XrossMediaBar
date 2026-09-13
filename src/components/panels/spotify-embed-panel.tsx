export function SpotifyEmbedPanel({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="w-full">
      <iframe
        style={{ borderRadius: 12, height: "min(70vh, 660px)" }}
        src={embedUrl}
        width="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
