import type { MenuItem } from "@/content";
import { PANELS } from "@/src/lib/registry";
import { ExternalLinkPanel } from "@/src/components/panels/external-link-panel";
import { FilmPanel } from "@/src/components/panels/film-panel";
import { SpotifyEmbedPanel } from "@/src/components/panels/spotify-embed-panel";
import { SoundCloudEmbedPanel } from "@/src/components/panels/soundcloud-embed-panel";

export function PanelBody({ item }: { item: MenuItem }) {
  if (item.kind === "external") {
    return <ExternalLinkPanel label={item.label} url={item.url} avatarText={item.avatarText} />;
  }
  if (item.panelKey === "film") {
    return <FilmPanel filmId={item.filmId} />;
  }
  if (item.panelKey === "spotify") {
    return <SpotifyEmbedPanel embedUrl={item.embedUrl} />;
  }
  if (item.panelKey === "soundcloud") {
    return <SoundCloudEmbedPanel embedUrl={item.embedUrl} />;
  }
  const Panel = PANELS[item.panelKey];
  return <Panel />;
}
