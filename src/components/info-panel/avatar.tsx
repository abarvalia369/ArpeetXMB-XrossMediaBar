import { PROFILE } from "@/content";

export function Avatar() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PROFILE.avatarSrc}
      alt={PROFILE.avatarAlt}
      width={28}
      height={28}
      className="h-6 w-6 shrink-0 rounded-md border border-border object-cover sm:h-7 sm:w-7"
    />
  );
}
