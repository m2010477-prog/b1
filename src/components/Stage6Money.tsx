import { VENUES, INITIAL_BUDGET, EXTRA_MONEY } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, Pill, TextArea, TextInput, NotificationCard } from "./ui";
import { SpeakingCheckpoint } from "./SpeakingCheckpoint";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

const CHOICES: { id: "raise" | "reduce" | "format" | "date"; label: string; hint: string }[] = [
  { id: "raise", label: "Raise the extra £30", hint: "Only possible if you can justify WHY it's needed." },
  { id: "reduce", label: "Reduce the number of guests", hint: "Fewer people — but who gets left out?" },
  { id: "format", label: "Change the event format", hint: "e.g. shorter event, potluck food, two smaller sessions..." },
  { id: "date", label: "Move the event to another date", hint: "May solve money/weather issues, but availability could change." },
];

export function Stage6Money({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const m = state.money;
  const patch = (p: Partial<typeof m>) => update({ money: { ...m, ...p } });
  const venue = state.weather.venue ? VENUES[state.weather.venue as VenueId] : null;

  const canSubmit =
    m.choice !== "" && m.justification.trim().length >= 20 && m.newGuests > 0 && m.discussed;

  const budgetAvailable = m.choice === "raise" ? INITIAL_BUDGET + EXTRA_MONEY : INITIAL_BUDGET;
  const effectiveBudget = m.newBudget || budgetAvailable;
  const overBudget = venue ? venue.cost - effectiveBudget : 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 6 · A second surprise"
        title="Last-minute message"
        description="A new opportunity — and a new negotiation. There is no single obvious winner here; discuss the real consequences of each option."
      />

      <NotificationCard title="Last-Minute Message 📩" icon="📩">
        Good news — the group MIGHT be able to raise an extra <strong>£{EXTRA_MONEY}</strong>, but
        only if you can clearly explain to the organisers why the extra money is really necessary.
      </NotificationCard>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">What will you do?</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                patch({
                  choice: c.id,
                  newBudget: c.id === "raise" ? INITIAL_BUDGET + EXTRA_MONEY : INITIAL_BUDGET,
                  newGuests:
                    c.id === "reduce" && venue ? Math.min(m.newGuests, venue.capacity) : m.newGuests,
                })
              }
              className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                m.choice === c.id
                  ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                  : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
              }`}
            >
              <p className="font-semibold">{c.label}</p>
              <p className={`text-xs ${m.choice === c.id ? "text-[#fbf4e8]/80" : "text-[#8a3b3b]"}`}>
                {c.hint}
              </p>
            </button>
          ))}
        </div>

        <label className="mt-4 mb-1 block text-sm font-semibold text-[#2c2420]">
          Justify your decision (why this, and not another option?)
        </label>
        <TextArea
          rows={3}
          value={m.justification}
          onChange={(e) => patch({ justification: e.target.value })}
          placeholder="Explain your reasoning in full sentences..."
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Final guest number
            </label>
            <TextInput
              type="number"
              min={1}
              value={m.newGuests}
              onChange={(e) => patch({ newGuests: parseInt(e.target.value || "0", 10) })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Final budget available
            </label>
            <TextInput
              type="number"
              min={0}
              value={effectiveBudget}
              onChange={(e) => patch({ newBudget: parseInt(e.target.value || "0", 10) })}
            />
          </div>
        </div>

        {venue && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone={overBudget > 0 ? "bad" : "good"}>
              Current venue (Option {venue.id}) costs £{venue.cost} —{" "}
              {overBudget > 0 ? `£${overBudget} over your chosen budget` : "fits your chosen budget"}
            </Pill>
            <Pill tone={m.newGuests > venue.capacity ? "bad" : "good"}>
              Capacity {venue.capacity} for {m.newGuests} guests{" "}
              {m.newGuests > venue.capacity ? "— too many!" : "— fits"}
            </Pill>
          </div>
        )}
      </Card>

      <SpeakingCheckpoint
        prompt="Discuss out loud: should you raise the money, cut guests, change the format, or move the date? What is the real consequence of your choice?"
        confirmed={m.discussed}
        onConfirmChange={(v) => patch({ discussed: v })}
      />

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {canSubmit ? "Ready to continue." : "Choose an option, justify it (20+ characters), set numbers, and confirm discussion."}
        </p>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            patch({ submitted: true });
            onComplete();
          }}
        >
          Confirm Decision →
        </PrimaryButton>
      </div>
    </div>
  );
}
