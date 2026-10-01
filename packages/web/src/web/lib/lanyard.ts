import { useEffect, useState } from "react";

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  created_at?: number;
  emoji?: { name: string; id?: string; animated?: boolean };
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  buttons?: string[];
  sync_id?: string;
}

export interface LanyardSpotify {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
}

export interface LanyardData {
  kv: Record<string, string>;
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    display_name?: string | null;
    avatar: string | null;
    avatar_decoration_data?: { asset: string } | null;
    primary_guild?: {
      tag: string | null;
      badge: string | null;
      identity_guild_id: string | null;
      identity_enabled?: boolean;
    } | null;
  };
  activities: LanyardActivity[];
  discord_status: DiscordStatus;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
}

type State =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: LanyardData; error: null }
  | { status: "error"; data: null; error: string };

/** Live Lanyard presence via WebSocket, with REST bootstrap + auto-reconnect. */
export function useLanyard(id: string): State {
  const [state, setState] = useState<State>({ status: "loading", data: null, error: null });

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let reconnect: ReturnType<typeof setTimeout> | undefined;
    let closed = false;

    fetch(`https://api.lanyard.rest/v1/users/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (closed) return;
        if (j.success) setState({ status: "ready", data: j.data, error: null });
        else
          setState((s) =>
            s.status === "ready"
              ? s
              : { status: "error", data: null, error: j.error?.message ?? "User not found on Lanyard" },
          );
      })
      .catch(() => {});

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.op === 1) {
          ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: id } }));
          clearInterval(heartbeat);
          heartbeat = setInterval(() => ws?.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          setState({ status: "ready", data: msg.d, error: null });
        }
      };
      ws.onclose = () => {
        clearInterval(heartbeat);
        if (!closed) reconnect = setTimeout(connect, 3000);
      };
    };
    connect();

    return () => {
      closed = true;
      clearInterval(heartbeat);
      clearTimeout(reconnect);
      ws?.close();
    };
  }, [id]);

  return state;
}

// ── CDN helpers ──────────────────────────────────────────────

export function avatarUrl(u: LanyardData["discord_user"], size = 256) {
  if (!u.avatar) {
    const idx = Number((BigInt(u.id) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
  }
  const ext = u.avatar.startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=${size}`;
}

export function decorationUrl(u: LanyardData["discord_user"]) {
  const asset = u.avatar_decoration_data?.asset;
  return asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=240&passthrough=true`
    : null;
}

export function guildBadgeUrl(u: LanyardData["discord_user"]) {
  const g = u.primary_guild;
  if (!g?.badge || !g.identity_guild_id) return null;
  return `https://cdn.discordapp.com/clan-badges/${g.identity_guild_id}/${g.badge}.png?size=32`;
}

export function emojiUrl(e: NonNullable<LanyardActivity["emoji"]>) {
  if (!e.id) return null;
  return `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? "gif" : "webp"}?size=48`;
}

export function activityImage(a: LanyardActivity, key: "large_image" | "small_image" = "large_image") {
  const img = a.assets?.[key];
  if (!img) return key === "large_image" && a.application_id ? `https://dcdn.dstn.to/app-icons/${a.application_id}` : null;
  if (img.startsWith("mp:")) return `https://media.discordapp.net/${img.slice(3)}`;
  if (img.startsWith("spotify:")) return `https://i.scdn.co/image/${img.slice(8)}`;
  if (img.startsWith("http")) return img;
  return a.application_id ? `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png` : null;
}

export const STATUS_META: Record<DiscordStatus, { label: string; color: string }> = {
  online: { label: "online", color: "#3ba55d" },
  idle: { label: "idle", color: "#faa81a" },
  dnd: { label: "do not disturb", color: "#ed4245" },
  offline: { label: "offline", color: "#747f8d" },
};

export const ACTIVITY_VERB: Record<number, string> = {
  0: "playing",
  1: "streaming",
  2: "listening to",
  3: "watching",
  5: "competing in",
};
