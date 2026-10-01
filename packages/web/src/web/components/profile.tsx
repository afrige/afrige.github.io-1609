import { Monitor, Smartphone, Globe } from "lucide-react";
import {
  type LanyardData,
  STATUS_META,
  avatarUrl,
  decorationUrl,
  emojiUrl,
  guildBadgeUrl,
} from "../lib/lanyard";
import { BIO, THEME } from "../config";

export function Profile({ data }: { data: LanyardData }) {
  const u = data.discord_user;
  const status = STATUS_META[data.discord_status];
  const deco = decorationUrl(u);
  const badge = guildBadgeUrl(u);
  const tag = THEME.show.guildTag && u.primary_guild?.identity_enabled !== false ? u.primary_guild?.tag : null;
  const custom = data.activities.find((a) => a.type === 4);
  const name = u.global_name || u.display_name || u.username;

  const platforms = !THEME.show.platforms ? [] : [
    data.active_on_discord_desktop && { icon: Monitor, label: "desktop" },
    data.active_on_discord_mobile && { icon: Smartphone, label: "mobile" },
    data.active_on_discord_web && { icon: Globe, label: "web" },
  ].filter(Boolean) as { icon: typeof Monitor; label: string }[];

  return (
    <header className="flex flex-col items-center text-center">
      <div className="reveal relative h-[132px] w-[132px]" style={{ animationDelay: "0ms" }}>
        <img
          src={avatarUrl(u)}
          alt={name}
          className="absolute inset-[14px] h-[104px] w-[104px] rounded-full object-cover"
        />
        {deco && (
          <img src={deco} alt="" className="pointer-events-none absolute inset-0 h-full w-full" />
        )}
        <span
          className="status-dot absolute right-[18px] bottom-[18px] h-[22px] w-[22px] rounded-full border-[4px] border-[var(--void)]"
          style={{ background: status.color }}
          title={status.label}
        />
      </div>

      <h1
        className="reveal font-display mt-5 text-[56px] leading-[0.9] italic tracking-tight text-[var(--ink)]"
        style={{ animationDelay: "60ms" }}
      >
        {name}
      </h1>

      <div
        className="reveal mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[var(--ash)] uppercase"
        style={{ animationDelay: "120ms" }}
      >
        {THEME.show.username && <span className="normal-case tracking-[0.08em]">@{u.username}</span>}
        {tag && (
          <span className="flex items-center gap-1 rounded-[5px] border border-[var(--line)] bg-[var(--glass)] px-1.5 py-[3px] normal-case tracking-normal text-[var(--ink)]">
            {badge && <img src={badge} alt="" className="h-3.5 w-3.5" />}
            <span className="font-sans text-[11px] font-medium">{tag}</span>
          </span>
        )}
      </div>

      <div
        className="reveal mt-4 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase"
        style={{ animationDelay: "180ms" }}
      >
        <span className="flex items-center gap-1.5" style={{ color: status.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
          {status.label}
        </span>
        {platforms.length > 0 && <span className="h-3 w-px bg-[var(--line)]" />}
        {platforms.map((p) => (
          <span key={p.label} className="flex items-center gap-1 text-[var(--ash)]" title={p.label}>
            <p.icon size={11} strokeWidth={1.75} />
            {p.label}
          </span>
        ))}
      </div>

      {THEME.show.customStatus && (custom?.state || custom?.emoji) && (
        <div
          className="reveal mt-5 flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-3.5 py-1.5 text-[13px] font-light text-[var(--ink)]"
          style={{ animationDelay: "240ms" }}
        >
          {custom.emoji &&
            (emojiUrl(custom.emoji) ? (
              <img src={emojiUrl(custom.emoji)!} alt={custom.emoji.name} className="h-4.5 w-4.5" />
            ) : (
              <span>{custom.emoji.name}</span>
            ))}
          {custom.state && <span className="truncate">{custom.state}</span>}
        </div>
      )}

      {BIO && (
        <p
          className="reveal mt-4 max-w-[34ch] text-[14px] leading-relaxed font-light text-[var(--ash)]"
          style={{ animationDelay: "280ms" }}
        >
          {BIO}
        </p>
      )}
    </header>
  );
}
