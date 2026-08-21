import { HOME } from "@/content";

export function HomeBioPanel() {
  return (
    <div>
      {/* Placeholder profile picture — swap the src for a real photo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://placehold.co/160x160/1a1a1a/ffffff?text=${encodeURIComponent(HOME.avatarText)}`}
        alt=""
        width={96}
        height={96}
        className="rounded-full border border-white/15"
      />
      <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">{HOME.name}</h2>
      <p className="mt-2 text-white/60">{HOME.tagline}</p>
      <p className="mt-5 max-w-md leading-relaxed text-white/55">{HOME.bio}</p>
    </div>
  );
}
