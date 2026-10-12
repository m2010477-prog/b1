import { useState } from "react";
import { VENUES, INITIAL_BUDGET, PARTNER_DECISION_OPENERS, PARTNER_CONCERNS } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, Pill, TextArea, TextInput } from "./ui";
import { SpeakingCheckpoint } from "./SpeakingCheckpoint";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

export function Stage4Decision({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const plan = state.decision1;
  const isSolo = state.mode === "solo";
  const [partnerOpener] = useState(
    () => PARTNER_DECISION_OPENERS[Math.floor(Math.random() * PARTNER_DECISION_OPENERS.length)]
  );
  const [partnerConcern] = useState(
    () => PARTNER_CONCERNS[Math.floor(Math.random() * PARTNER_CONCERNS.length)]
  );

  const venue = plan.venue ? VENUES[plan.venue as VenueId] : null;

  const budgetOver = venue ? venue.cost - INITIAL_BUDGET : 0;
  const capacityShort = venue ? plan.guests - venue.capacity : 0;

  const patch = (p: Partial<typeof plan>) => update({ decision1: { ...plan, ...p } });

  const textFilled =
    plan.advantages.trim().length >= 10 &&
    plan.problem.trim().length >= 5 &&
    plan.reaction.trim().length >= 5 &&
    plan.compromise.trim().length >= 5;

  const canSubmit = !!plan.venue && plan.guests > 0 && textFilled && plan.discussed;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 4 · First decision"
        title="Make your first plan"
        description="Discuss all three venues together. There is no perfect option — every choice has a trade-off. Suggest a venue, explain two advantages, name a problem, react to your partner's concern, and suggest a compromise."
      />

      {isSolo && (
        <Card className="border-2 border-[#8a3b3b]/40 bg-[#fbf4e8]">
          <p className="text-sm font-semibold text-[#7a2e2e]">🗨 Your virtual partner says:</p>
          <p className="mt-1 italic text-[#2c2420]">"{partnerOpener}"</p>
          <p className="mt-2 text-sm font-semibold text-[#7a2e2e]">🗨 ...and raises a concern:</p>
          <p className="mt-1 italic text-[#2c2420]">"{partnerConcern}"</p>
          <p className="mt-2 text-xs text-[#8a3b3b]">
            Use the "React to partner's concern" box below to respond to this.
          </p>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">Decision board</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Proposed venue
            </label>
            <div className="flex gap-2">
              {(["A", "B", "C"] as VenueId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => patch({ venue: id })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    plan.venue === id
                      ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                      : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                  }`}
                >
                  {id} — {VENUES[id].name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Expected attendance
            </label>
            <TextInput
              type="number"
              min={1}
              value={plan.guests}
              onChange={(e) => patch({ guests: parseInt(e.target.value || "0", 10) })}
            />
          </div>
        </div>

        {venue && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone={budgetOver > 0 ? "bad" : "good"}>
              Budget: £{venue.cost} of £{INITIAL_BUDGET}{" "}
              {budgetOver > 0 ? `(£${budgetOver} over)` : "(within budget)"}
            </Pill>
            <Pill tone={capacityShort > 0 ? "bad" : "good"}>
              Capacity: {venue.capacity} seats for {plan.guests} guests{" "}
              {capacityShort > 0 ? `(${capacityShort} short)` : "(fits)"}
            </Pill>
            <Pill tone={venue.accessible ? "good" : "bad"}>
              {venue.accessible ? "Step-free access ✓" : "No step-free access ✗"}
            </Pill>
            <Pill tone="neutral">Closes {venue.closingTime}</Pill>
            <Pill tone={venue.indoor ? "good" : "warn"}>{venue.indoor ? "Indoor" : "Outdoor — weather risk"}</Pill>
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Two advantages of this venue
            </label>
            <TextArea
              rows={2}
              value={plan.advantages}
              onChange={(e) => patch({ advantages: e.target.value })}
              placeholder="e.g. It's affordable and has lots of space..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              At least one problem
            </label>
            <TextArea
              rows={2}
              value={plan.problem}
              onChange={(e) => patch({ problem: e.target.value })}
              placeholder="e.g. It might be too small for everyone..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Reaction to your partner's concern
            </label>
            <TextArea
              rows={2}
              value={plan.reaction}
              onChange={(e) => patch({ reaction: e.target.value })}
              placeholder="e.g. I see your point, but..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Possible compromise
            </label>
            <TextArea
              rows={2}
              value={plan.compromise}
              onChange={(e) => patch({ compromise: e.target.value })}
              placeholder="e.g. We could reduce the guest list, or..."
            />
          </div>
        </div>
      </Card>

      <SpeakingCheckpoint
        prompt="Before submitting, say your proposal out loud to your partner: name the venue, two advantages, one problem, and your suggested compromise."
        confirmed={plan.discussed}
        onConfirmChange={(v) => patch({ discussed: v })}
      />

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {!plan.venue
            ? "Choose a venue to begin."
            : !textFilled
            ? "Fill in advantages, a problem, a reaction and a compromise."
            : !plan.discussed
            ? "Confirm you've spoken about this out loud."
            : "Ready to submit your first plan."}
        </p>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            patch({ submitted: true });
            onComplete();
          }}
        >
          Submit First Plan →
        </PrimaryButton>
      </div>
    </div>
  );
}
