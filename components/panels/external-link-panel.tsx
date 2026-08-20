export function ExternalLinkPanel({ label, url, avatarText }: { label: string; url: string; avatarText: string }) {
  return (
    <div>
      {/* Placeholder avatar for the linked account — swap for a real profile picture. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://placehold.co/120x120/1a1a1a/ffffff?text=${encodeURIComponent(avatarText)}`}
        alt=""
        width={80}
        height={80}
        className="rounded-full border border-white/15"
      />
      <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">{label}</h2>
      <p className="mt-2 max-w-md text-sm text-white/55">This opens in a new tab.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
      >
        Open {label} ↗
      </a>
    </div>
  );
}
