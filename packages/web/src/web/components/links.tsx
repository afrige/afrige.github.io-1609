import type { IconType } from "react-icons";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiX,
  SiTiktok,
  SiYoutube,
  SiSpotify,
  SiSteam,
  SiTwitch,
  SiRoblox,
  SiSoundcloud,
  SiPinterest,
  SiTelegram,
  SiSnapchat,
  SiReddit,
  SiLetterboxd,
  SiLastdotfm,
} from "react-icons/si";
import { Globe, Mail } from "lucide-react";
import { type LinkIcon, type SocialLink, LINKS, THEME } from "../config";

const ICONS: Record<LinkIcon, { Icon: IconType | typeof Globe; brand: string }> = {
  discord: { Icon: SiDiscord, brand: "#5865F2" },
  github: { Icon: SiGithub, brand: "#ffffff" },
  instagram: { Icon: SiInstagram, brand: "#E4405F" },
  x: { Icon: SiX, brand: "#ffffff" },
  tiktok: { Icon: SiTiktok, brand: "#ff0050" },
  youtube: { Icon: SiYoutube, brand: "#FF0000" },
  spotify: { Icon: SiSpotify, brand: "#1DB954" },
  steam: { Icon: SiSteam, brand: "#66c0f4" },
  twitch: { Icon: SiTwitch, brand: "#9146FF" },
  roblox: { Icon: SiRoblox, brand: "#ffffff" },
  soundcloud: { Icon: SiSoundcloud, brand: "#FF5500" },
  pinterest: { Icon: SiPinterest, brand: "#E60023" },
  telegram: { Icon: SiTelegram, brand: "#26A5E4" },
  snapchat: { Icon: SiSnapchat, brand: "#FFFC00" },
  reddit: { Icon: SiReddit, brand: "#FF4500" },
  letterboxd: { Icon: SiLetterboxd, brand: "#40BCF4" },
  lastfm: { Icon: SiLastdotfm, brand: "#D51007" },
  email: { Icon: Mail, brand: "#ededeb" },
  website: { Icon: Globe, brand: "#ededeb" },
};

/** Guess an icon from a URL (used for Lanyard KV links). */
function guessIcon(url: string): LinkIcon {
  if (url.startsWith("mailto:")) return "email";
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }
  const map: [string, LinkIcon][] = [
    ["discord", "discord"],
    ["github", "github"],
    ["instagram", "instagram"],
    ["twitter", "x"],
    ["x.com", "x"],
    ["tiktok", "tiktok"],
    ["youtu", "youtube"],
    ["spotify", "spotify"],
    ["steam", "steam"],
    ["twitch", "twitch"],
    ["roblox", "roblox"],
    ["soundcloud", "soundcloud"],
    ["pinterest", "pinterest"],
    ["t.me", "telegram"],
    ["snapchat", "snapchat"],
    ["reddit", "reddit"],
    ["letterboxd", "letterboxd"],
    ["last.fm", "lastfm"],
  ];
  return map.find(([k]) => host.includes(k))?.[1] ?? "website";
}

export function Links({ kv }: { kv: Record<string, string> }) {
  const kvLinks: SocialLink[] = Object.entries(kv)
    .filter(([, v]) => /^(https?:\/\/|mailto:)/i.test(v))
    .filter(([, v]) => !LINKS.some((l) => l.url === v))
    .map(([k, v]) => ({ label: k, url: v, icon: guessIcon(v) }));
  const all = [...LINKS, ...kvLinks];
  if (all.length === 0) return null;

  return (
    <section className="flex flex-col">
      <h2 className="label reveal mb-3" style={{ animationDelay: "480ms" }}>
        links
      </h2>
      <ul className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${THEME.linkColumns}, minmax(0, 1fr))` }}>
        {all.map((l, i) => {
          const { Icon, brand } = ICONS[l.icon] ?? ICONS.website;
          const color = THEME.linkIconColor === "brand" ? brand : undefined;
          return (
            <li key={l.url} className="reveal" style={{ animationDelay: `${520 + i * 50}ms` }}>
              <a
                href={l.url}
                target={l.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={l.label}
                data-label={l.label}
                className="card link-tile group grid aspect-square w-full place-items-center"
                style={{ ["--brand" as string]: brand }}
              >
                <Icon
                  className="h-[34%] w-[34%] text-[var(--ink)] transition-transform duration-300 group-hover:scale-110"
                  style={color ? { color } : undefined}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
