import { useEffect, useRef } from "react";
import { THEME } from "../config";

export function Backdrop({ avatar, accent }: { avatar: string | null; accent: string }) {
  const bg = THEME.background;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = bg.speed;
  }, [bg.speed]);

  const media = { filter: bg.blur ? `blur(${bg.blur}px)` : undefined, transform: bg.blur ? "scale(1.08)" : undefined };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {bg.type === "video" && bg.src && (
        <video
          ref={ref}
          src={bg.src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={media}
          aria-label="background video"
        >
          <track kind="captions" />
        </video>
      )}
      {bg.type === "image" && bg.src && (
        <img src={bg.src} alt="" className="absolute inset-0 h-full w-full object-cover" style={media} />
      )}
      {bg.type === "avatar" && avatar && (
        <img
          src={avatar}
          alt=""
          className="absolute top-[-12%] left-1/2 h-[620px] w-[620px] -translate-x-1/2 scale-125 rounded-full object-cover opacity-[0.22] blur-[90px]"
        />
      )}

      {/* dim layer — radial so edges are darker than the center */}
      {bg.type !== "none" && bg.type !== "avatar" && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 50% 30%, rgba(7,7,8,${bg.dim * 0.85}) 0%, rgba(7,7,8,${Math.min(1, bg.dim + 0.15)}) 100%)`,
          }}
        />
      )}

      {bg.glow && (
        <div
          className="absolute top-[4%] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[110px] transition-colors duration-1000"
          style={{ background: accent }}
        />
      )}
      {bg.grain && <div className="grain absolute inset-0" />}
    </div>
  );
}
