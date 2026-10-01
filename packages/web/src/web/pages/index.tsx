import { useEffect, useRef, useState } from "react";
import { DISCORD_ID, THEME } from "../config";
import { STATUS_META, avatarUrl, useLanyard } from "../lib/lanyard";
import { Profile } from "../components/profile";
import { Activities } from "../components/activities";
import { Links } from "../components/links";
import { Backdrop } from "../components/backdrop";
import { EnterScreen } from "../components/enter-screen";

function Index() {
  const lanyard = useLanyard(DISCORD_ID);
  const data = lanyard.data;
  const statusColor = data ? STATUS_META[data.discord_status].color : "#747f8d";
  const accent = THEME.accent === "status" ? statusColor : THEME.accent;
  const name = data ? data.discord_user.global_name || data.discord_user.username : null;

  const [entered, setEntered] = useState(!THEME.enterScreen.enabled);
  const audio = useRef<HTMLAudioElement>(null);

  const enter = () => {
    setEntered(true);
    if (audio.current) {
      audio.current.volume = THEME.music.volume;
      audio.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!data) return;
    document.title = `${name} ✦ links`;
    let icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = avatarUrl(data.discord_user, 64);
  }, [data, name]);

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[var(--void)] text-[var(--ink)]"
      data-card={THEME.cardStyle}
      style={{ ["--accent" as string]: accent, ["--radius-card" as string]: `${THEME.radius}px` }}
    >
      <Backdrop avatar={data ? avatarUrl(data.discord_user, 128) : null} accent={accent} />
      {THEME.music.src && (
        <audio ref={audio} src={THEME.music.src} loop preload="auto" aria-label="background music">
          <track kind="captions" />
        </audio>
      )}
      {!entered && <EnterScreen onEnter={enter} />}

      {entered && (
        <div className="relative mx-auto flex w-full max-w-[440px] flex-col gap-10 px-6 pt-16 pb-24">
          {lanyard.status === "loading" && <Skeleton />}
          {lanyard.status === "error" && (
            <div className="mt-24 text-center">
              <p className="font-display text-3xl italic">couldn't reach Lanyard</p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.15em] text-[var(--ash)] uppercase">{lanyard.error}</p>
            </div>
          )}
          {data && (
            <>
              <Profile data={data} />
              {THEME.show.activities && <Activities data={data} />}
              <Links kv={data.kv} />
              <footer
                className="reveal text-center font-mono text-[10px] tracking-[0.3em] text-[var(--ash)]/60 uppercase"
                style={{ animationDelay: "800ms" }}
              >
                𓆩♡𓆪
              </footer>
            </>
          )}
        </div>
      )}
    </main>
  );
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center gap-4">
      <div className="mt-[14px] h-[104px] w-[104px] rounded-full bg-white/5" />
      <div className="mt-4 h-12 w-40 rounded-lg bg-white/5" />
      <div className="h-3 w-28 rounded bg-white/5" />
      <div className="mt-8 h-20 w-full rounded-[14px] bg-white/5" />
      <div className="h-20 w-full rounded-[14px] bg-white/5" />
    </div>
  );
}

export default Index;
