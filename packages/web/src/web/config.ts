// ─────────────────────────────────────────────────────────────
//  Edit this file to customise your page.
// ─────────────────────────────────────────────────────────────

/** Your Discord user ID (must be in the Lanyard Discord server). */
export const DISCORD_ID = "1243657660704755775";

/** Optional short bio under your name. Leave "" to hide. */
export const BIO = "";

// ── Look & feel ──────────────────────────────────────────────
export const THEME = {
  background: {
    /** "video" | "image" | "avatar" (blurred pfp) | "none" */
    type: "video" as "video" | "image" | "avatar" | "none",
    /** file in packages/web/public/ — e.g. "/videos/background.mp4" or "/images/bg.jpg" */
    src: "/videos/background.mp4",
    /** 0–1 black layer on top of the background (higher = darker, easier to read) */
    dim: 0.72,
    /** blur in px (0 = sharp) */
    blur: 0,
    /** video playback speed (1 = normal) */
    speed: 1,
    /** film grain on top */
    grain: true,
    /** soft glow behind avatar in your accent color */
    glow: true,
  },

  /** "status" = follows your discord status color, or any hex like "#c084fc" */
  accent: "status" as "status" | (string & {}),

  /** card style: "glass" (frosted) | "solid" | "outline" */
  cardStyle: "glass" as "glass" | "solid" | "outline",

  /** corner roundness for cards + link tiles, px */
  radius: 16,

  /** links grid columns (4 = quarters) */
  linkColumns: 4,

  /** link tile icon color: "mono" (white) | "brand" (each platform's color) */
  linkIconColor: "mono" as "mono" | "brand",

  /** show/hide sections */
  show: {
    activities: true,
    spotify: true,
    platforms: true,
    customStatus: true,
    guildTag: true,
    username: true,
  },

  /** "Click to enter" splash before the page — lets music autoplay. */
  enterScreen: {
    enabled: false,
    text: "click to enter",
  },

  /** Background music (needs enterScreen.enabled for autoplay). File in public/, e.g. "/audio/song.mp3". "" = off */
  music: {
    src: "",
    volume: 0.35,
  },
};

// ── Links ────────────────────────────────────────────────────
export type LinkIcon =
  | "discord"
  | "github"
  | "instagram"
  | "x"
  | "tiktok"
  | "youtube"
  | "spotify"
  | "steam"
  | "twitch"
  | "roblox"
  | "soundcloud"
  | "pinterest"
  | "telegram"
  | "snapchat"
  | "reddit"
  | "letterboxd"
  | "lastfm"
  | "email"
  | "website";

export interface SocialLink {
  /** shown as a tooltip on hover */
  label: string;
  url: string;
  icon: LinkIcon;
}

/**
 * Your socials — shown as square icon tiles. Order here is order on the page.
 * You can also add links without touching code by DMing the Lanyard bot:
 *   .set github https://github.com/you
 * Any Lanyard KV value that is a URL shows up automatically.
 */
export const LINKS: SocialLink[] = [
  { label: "Discord", url: `https://discord.com/users/${DISCORD_ID}`, icon: "discord" },
  // { label: "GitHub", url: "https://github.com/you", icon: "github" },
  // { label: "Instagram", url: "https://instagram.com/you", icon: "instagram" },
  // { label: "TikTok", url: "https://tiktok.com/@you", icon: "tiktok" },
  // { label: "Spotify", url: "https://open.spotify.com/user/you", icon: "spotify" },
];
