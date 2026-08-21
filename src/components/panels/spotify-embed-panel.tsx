export function SpotifyEmbedPanel({ embedUrl }: { embedUrl: string }) {
  return (
    <div>
      <iframe
        style={{ borderRadius: 12 }}
        src={embedUrl}
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
