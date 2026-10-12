import { VENUES, INITIAL_BUDGET, EXPECTED_GUESTS } from "../lessonData";
import { Card, PrimaryButton, Pill } from "./ui";
import type { Mode, SoloRole } from "../types";

export function IntroScreen({
  onStart,
}: {
  onStart: (mode: Mode, soloRole: SoloRole) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8a3b3b]">
          B1 Speaking Lesson · Digital Planning Studio
        </p>
        <h1 className="text-3xl font-extrabold text-[#2c2420] sm:text-4xl">
          The Perfect Hangout?
        </h1>
        <p className="mt-1 text-lg text-[#5c5349]">A Plan That Keeps Changing</p>
      </div>

      <Card>
        <h2 className="mb-2 text-xl font-bold text-[#2c2420]">The mission</h2>
        <p className="text-[#5c5349]">
          Two friends are organising a special after-school event. You must choose a venue, plan
          activities, manage the budget, and agree on a schedule. The catch: each of you has
          different information and different priorities, and the plan will be interrupted — more
          than once. There is no perfect option. You will need to talk, ask questions, and
          compromise.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="warn">Starting budget: £{INITIAL_BUDGET}</Pill>
          <Pill tone="neutral">Expected guests: {EXPECTED_GUESTS}</Pill>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-bold text-[#2c2420]">Three venues (public overview)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.values(VENUES).map((v) => (
            <div key={v.id} className="rounded-xl border border-[#e4d8c6] bg-[#fbf4e8] p-4">
              <p className="text-xs font-bold uppercase text-[#8a3b3b]">Option {v.id}</p>
              <p className="text-lg font-bold text-[#2c2420]">{v.name}</p>
              <p className="mt-2 text-sm text-[#5c5349]">{v.notes}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs italic text-[#8a3b3b]">
          Full details (cost, capacity, facilities) are split between the two roles — you'll
          discover them together in Stage 3.
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 text-xl font-bold text-[#2c2420]">Choose how you'll work</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-[#d8c9b2] p-4">
            <p className="text-lg font-bold text-[#2c2420]">👥 Pair mode</p>
            <p className="mb-3 text-sm text-[#5c5349]">
              Work with a real partner, on one shared device (pass & hide) or two separate devices
              (you'll need to actually talk — this app does not transmit data between devices).
            </p>
            <PrimaryButton onClick={() => onStart("pair", "A")} className="w-full">
              Start in Pair Mode
            </PrimaryButton>
          </div>
          <div className="rounded-xl border-2 border-[#d8c9b2] p-4">
            <p className="text-lg font-bold text-[#2c2420]">🧑 Solo mode</p>
            <p className="mb-3 text-sm text-[#5c5349]">
              Practise alone with a scripted practice partner (fixed, pre-written responses — not a
              live AI conversation). Choose which role you'll play:
            </p>
            <div className="mb-3 flex gap-2">
              <PrimaryButton onClick={() => onStart("solo", "A")} className="flex-1">
                Play Student A
              </PrimaryButton>
              <PrimaryButton onClick={() => onStart("solo", "B")} className="flex-1">
                Play Student B
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
