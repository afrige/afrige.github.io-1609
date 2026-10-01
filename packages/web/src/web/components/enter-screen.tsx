import { THEME } from "../config";

export function EnterScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <button
      type="button"
      onClick={onEnter}
      className="fixed inset-0 z-50 grid cursor-pointer place-items-center bg-[var(--void)]/80 backdrop-blur-xl"
    >
      <span className="font-display animate-pulse text-3xl text-[var(--ink)] italic">{THEME.enterScreen.text}</span>
    </button>
  );
}
