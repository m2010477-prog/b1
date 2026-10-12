import { Pill } from "./ui";

const STAGE_NAMES = [
  "Warm-up",
  "Role Cards",
  "Information Gap",
  "First Decision",
  "Weather Alert",
  "Extra Money",
  "Memory Check",
  "Final Negotiation",
  "Solo Partner",
  "Feedback",
];

export function Header({
  stage,
  maxStageReached,
  onJump,
  budgetLabel,
  mode,
}: {
  stage: number;
  maxStageReached: number;
  onJump: (s: number) => void;
  budgetLabel: string;
  mode: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e4d8c6] bg-[#f6ecda]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#2c2420] sm:text-xl">
              The Perfect Hangout?{" "}
              <span className="font-normal text-[#8a3b3b]">— A Plan That Keeps Changing</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {mode && <Pill tone="neutral">{mode === "pair" ? "👥 Pair mode" : "🧑 Solo mode"}</Pill>}
            <Pill tone="warn">{budgetLabel}</Pill>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STAGE_NAMES.map((name, i) => {
            const s = i + 1;
            const reachable = s <= maxStageReached;
            const active = s === stage;
            return (
              <button
                key={name}
                disabled={!reachable}
                onClick={() => onJump(s)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                    : reachable
                    ? "border-[#c9b8a4] bg-white text-[#5c5349] hover:bg-[#efe6d8]"
                    : "cursor-not-allowed border-[#e4d8c6] bg-[#efe6d8]/50 text-[#b4a690]"
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-[10px]">
                  {s}
                </span>
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
