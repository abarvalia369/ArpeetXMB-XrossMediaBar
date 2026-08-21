export function SoundCloudEmbedPanel({ embedUrl }: { embedUrl: string }) {
  return (
    <div>
      <iframe width="100%" height="300" scrolling="no" frameBorder="no" allow="autoplay; encrypted-media" src={embedUrl} />
    </div>
  );
}
