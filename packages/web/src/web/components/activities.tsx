import { useEffect, useState } from "react";
import { SiSpotify } from "react-icons/si";
import { Gamepad2 } from "lucide-react";
import { THEME } from "../config";
import { type LanyardActivity, type LanyardData, ACTIVITY_VERB, activityImage } from "../lib/lanyard";

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

function Thumb({ a }: { a: LanyardActivity }) {
  const [broken, setBroken] = useState(false);
  const large = activityImage(a, "large_image");
  const small = activityImage(a, "small_image");
  return (
    <div className="relative h-[60px] w-[60px] shrink-0">
      {large && !broken ? (
        <img
          src={large}
          alt={a.assets?.large_text ?? a.name}
          onError={() => setBroken(true)}
          className="h-full w-full rounded-[calc(var(--radius-card)-6px)] object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-[calc(var(--radius-card)-6px)] border border-[var(--line)] bg-[var(--glass)] text-[var(--ash)]">
          <Gamepad2 size={22} strokeWidth={1.5} />
        </div>
      )}
      {small && (
        <img
          src={small}
          alt={a.assets?.small_text ?? ""}
          className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-[var(--void)]"
        />
      )}
    </div>
  );
}

function ActivityCard({ a, now, delay }: { a: LanyardActivity; now: number; delay: number }) {
  const start = a.timestamps?.start;
  const end = a.timestamps?.end;
  const showEnd = end && end - now < 1000 * 60 * 60 * 24;
  return (
    <div className="card reveal flex items-center gap-3.5 p-3" style={{ animationDelay: `${delay}ms` }}>
      <Thumb a={a} />
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[9.5px] tracking-[0.2em] text-[var(--ash)] uppercase">
          {ACTIVITY_VERB[a.type] ?? "doing"}
        </div>
        <div className="truncate text-[14px] font-medium text-[var(--ink)]">{a.name}</div>
        {a.details && a.details !== a.name && (
          <div className="truncate text-[12.5px] font-light text-[var(--ash)]">{a.details}</div>
        )}
        {a.state && <div className="truncate text-[12.5px] font-light text-[var(--ash)]">{a.state}</div>}
      </div>
      {(start || showEnd) && (
        <div className="shrink-0 self-start pt-0.5 font-mono text-[10.5px] text-[var(--ash)] tabular-nums">
          {showEnd ? `-${fmt(end - now)}` : fmt(now - start!)}
        </div>
      )}
    </div>
  );
}

function SpotifyCard({ s, now, delay }: { s: NonNullable<LanyardData["spotify"]>; now: number; delay: number }) {
  const total = s.timestamps.end - s.timestamps.start;
  const elapsed = Math.min(total, now - s.timestamps.start);
  const pct = total > 0 ? (elapsed / total) * 100 : 0;
  return (
    <a
      href={`https://open.spotify.com/track/${s.track_id}`}
      target="_blank"
      rel="noreferrer"
      className="card reveal group block p-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3.5">
        <img src={s.album_art_url} alt={s.album} className="h-[60px] w-[60px] shrink-0 rounded-[calc(var(--radius-card)-6px)] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.2em] text-[#1db954] uppercase">
            <SiSpotify size={10} /> listening
          </div>
          <div className="truncate text-[14px] font-medium text-[var(--ink)] group-hover:underline">{s.song}</div>
          <div className="truncate text-[12.5px] font-light text-[var(--ash)]">{s.artist.replace(/;/g, ",")}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2.5 font-mono text-[10px] text-[var(--ash)] tabular-nums">
        <span>{fmt(elapsed)}</span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
        </div>
        <span>{fmt(total)}</span>
      </div>
    </a>
  );
}

export function Activities({ data }: { data: LanyardData }) {
  const now = useNow();
  const list = data.activities.filter((a) => a.type !== 4 && !(a.type === 2 && a.name === "Spotify"));
  const spotify = THEME.show.spotify ? data.spotify : null;
  if (!spotify && list.length === 0) return null;

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="label reveal" style={{ animationDelay: "300ms" }}>
        right now
      </h2>
      {spotify && <SpotifyCard s={spotify} now={now} delay={340} />}
      {list.map((a, i) => (
        <ActivityCard key={a.id} a={a} now={now} delay={380 + i * 60} />
      ))}
    </section>
  );
}
