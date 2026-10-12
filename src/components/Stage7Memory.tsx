import { MEMORY_STATEMENTS, VENUES } from "../lessonData";
import { Card, SectionTitle, PrimaryButton } from "./ui";
import type { LessonState } from "../types";
import type { MemorySnapshot, VenueId } from "../lessonData";

export function Stage7Memory({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const snap: MemorySnapshot = {
    firstVenue: (state.decision1.venue || null) as VenueId | null,
    currentVenue: (state.weather.venue || state.decision1.venue || null) as VenueId | null,
    firstBudget: state.decision1.venue ? VENUES[state.decision1.venue as VenueId].cost : null,
    currentBudget: state.money.newBudget || null,
    firstGuests: state.decision1.guests || null,
    currentGuests: state.money.newGuests || state.weather.guests || null,
    usedExtraMoney: state.money.choice === "raise",
  };

  const setAnswer = (id: string, value: "true" | "false" | "discuss") => {
    update({ memoryAnswers: { ...state.memoryAnswers, [id]: value } });
  };

  const allAnswered = MEMORY_STATEMENTS.every((s) => state.memoryAnswers[s.id]);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 7 · Conversation with memory"
        title="What do we still agree on?"
        description="Look back at your earlier decisions. Which ideas are still valid, and which have changed because of the surprises? Discuss together, then mark each statement."
      />

      <Card>
        <h4 className="mb-2 text-sm font-bold text-[#7a2e2e]">Ask each other:</h4>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[#2c2420]">
          <li>What did we agree on earlier?</li>
          <li>Why did we choose that option?</li>
          <li>Does our previous decision still make sense?</li>
          <li>What have we changed, and why?</li>
        </ul>
      </Card>

      <div className="space-y-3">
        {MEMORY_STATEMENTS.map((s, i) => {
          const truth = s.check(snap);
          const answered = state.memoryAnswers[s.id];
          return (
            <Card key={s.id}>
              <p className="mb-2 font-medium text-[#2c2420]">
                {i + 1}. {s.text}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAnswer(s.id, "true")}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    answered === "true"
                      ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                      : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                  }`}
                >
                  Still true
                </button>
                <button
                  onClick={() => setAnswer(s.id, "false")}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                    answered === "false"
                      ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                      : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                  }`}
                >
                  No longer true
                </button>
                {truth === null && (
                  <button
                    onClick={() => setAnswer(s.id, "discuss")}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                      answered === "discuss"
                        ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                        : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                    }`}
                  >
                    We're still discussing this
                  </button>
                )}
              </div>
              {answered && truth !== null && (
                <p className="mt-2 text-xs font-semibold">
                  {(answered === "true") === truth ? (
                    <span className="text-[#3a5c2d]">✓ That matches the facts you've entered so far.</span>
                  ) : (
                    <span className="text-[#8a3b3b]">
                      ⚠ Based on your own numbers so far, this looks {truth ? "TRUE" : "FALSE"} — double check together.
                    </span>
                  )}
                </p>
              )}
              {truth === null && (
                <p className="mt-2 text-xs italic text-[#8a3b3b]">
                  This is a matter of opinion/discussion, not an automatically graded fact.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {allAnswered ? "Great reflection — ready for the final negotiation." : "Respond to all 5 statements to continue."}
        </p>
        <PrimaryButton disabled={!allAnswered} onClick={onComplete}>
          Continue to Final Negotiation →
        </PrimaryButton>
      </div>
    </div>
  );
}
