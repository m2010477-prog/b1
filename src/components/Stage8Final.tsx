import { useEffect, useRef, useState } from "react";
import { VENUES, ACTIVITY_IDEAS, RUBRIC } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, SecondaryButton, Pill, TextArea, TextInput } from "./ui";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

export function Stage8Final({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const f = state.finalPlan;
  const patch = (p: Partial<typeof f>) => update({ finalPlan: { ...f, ...p } });
  const venue = f.venue ? VENUES[f.venue as VenueId] : null;

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = window.setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const toggleActivity = (a: string) => {
    const has = f.activities.includes(a);
    patch({ activities: has ? f.activities.filter((x) => x !== a) : [...f.activities, a] });
  };

  const canSubmit =
    !!f.venue &&
    f.guests > 0 &&
    f.activities.length + (f.customActivity.trim() ? 1 : 0) > 0 &&
    f.startTime &&
    f.endTime &&
    f.reasons.trim().length >= 30 &&
    f.discussed;

  const inTimerZone = timerSeconds >= 60 && timerSeconds <= 90;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 8 · Final negotiation"
        title="Your shared final plan"
        description="Combine everything you've negotiated into one agreed plan. Then give a joint spoken explanation of about 60–90 seconds, justifying your decisions."
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">Final venue</label>
            <div className="flex gap-2">
              {(["A", "B", "C"] as VenueId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => patch({ venue: id, budget: VENUES[id].cost })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    f.venue === id
                      ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                      : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
            {venue && <p className="mt-1 text-xs text-[#5c5349]">{venue.name} — £{venue.cost}, capacity {venue.capacity}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">Number of guests</label>
            <TextInput
              type="number"
              min={1}
              value={f.guests}
              onChange={(e) => patch({ guests: parseInt(e.target.value || "0", 10) })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">Budget (£)</label>
            <TextInput
              type="number"
              min={0}
              value={f.budget}
              onChange={(e) => patch({ budget: parseInt(e.target.value || "0", 10) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#2c2420]">Start time</label>
              <TextInput type="time" value={f.startTime} onChange={(e) => patch({ startTime: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#2c2420]">End time</label>
              <TextInput type="time" value={f.endTime} onChange={(e) => patch({ endTime: e.target.value })} />
            </div>
          </div>
        </div>

        {venue && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone={f.budget >= venue.cost ? "good" : "bad"}>
              {f.budget >= venue.cost ? "Budget covers venue cost ✓" : `Budget is £${venue.cost - f.budget} short`}
            </Pill>
            <Pill tone={f.guests <= venue.capacity ? "good" : "bad"}>
              {f.guests <= venue.capacity ? "Capacity OK ✓" : `${f.guests - venue.capacity} guests over capacity`}
            </Pill>
            {f.endTime && (
              <Pill tone={parseInt(f.endTime.split(":")[0], 10) <= venue.closingHour ? "good" : "bad"}>
                {parseInt(f.endTime.split(":")[0], 10) <= venue.closingHour
                  ? "Finishes before closing ✓"
                  : "Finishes after venue closes ✗"}
              </Pill>
            )}
          </div>
        )}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-[#2c2420]">Activities</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_IDEAS.map((a) => (
              <button
                key={a}
                onClick={() => toggleActivity(a)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  f.activities.includes(a)
                    ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                    : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <TextInput
            className="mt-2"
            placeholder="Add your own activity idea..."
            value={f.customActivity}
            onChange={(e) => patch({ customActivity: e.target.value })}
          />
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
            Reasons for your final decision (mention what changed and why)
          </label>
          <TextArea
            rows={4}
            value={f.reasons}
            onChange={(e) => patch({ reasons: e.target.value })}
            placeholder="Explain why you chose this venue, how you solved the budget/weather/accessibility issues, and what you compromised on..."
          />
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-semibold text-[#7a2e2e]">⏱ 60–90 second joint explanation</p>
        <p className="mb-3 text-sm text-[#5c5349]">
          Use the timer while you explain your final plan together out loud. Aim to land inside the
          green zone (60–90s).
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-lg px-4 py-2 font-mono text-xl font-bold ${
              inTimerZone ? "bg-[#e7efe1] text-[#3a5c2d]" : "bg-[#efe6d8] text-[#5c5349]"
            }`}
          >
            {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, "0")}
          </span>
          {!timerRunning ? (
            <SecondaryButton onClick={() => setTimerRunning(true)}>Start</SecondaryButton>
          ) : (
            <SecondaryButton onClick={() => setTimerRunning(false)}>Pause</SecondaryButton>
          )}
          <SecondaryButton
            onClick={() => {
              setTimerRunning(false);
              setTimerSeconds(0);
            }}
          >
            Reset
          </SecondaryButton>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-[#2c2420]">
          <input
            type="checkbox"
            checked={f.discussed}
            onChange={(e) => patch({ discussed: e.target.checked })}
            className="h-4 w-4 accent-[#7a2e2e]"
          />
          We gave our joint spoken explanation together.
        </label>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">Teacher-friendly assessment rubric</h3>
        <div className="space-y-3">
          {RUBRIC.map((r) => (
            <div key={r.id} className="rounded-lg border border-[#e4d8c6] p-3">
              <p className="font-semibold text-[#2c2420]">{r.label}</p>
              <p className="mb-2 text-xs text-[#5c5349]">{r.description}</p>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => update({ rubric: { ...state.rubric, [r.id]: n } })}
                    className={`h-8 w-8 rounded-md border text-sm font-bold ${
                      state.rubric[r.id] === n
                        ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                        : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-semibold text-[#2c2420]">Teacher comments</label>
          <TextArea
            rows={3}
            value={state.teacherComment}
            onChange={(e) => update({ teacherComment: e.target.value })}
            placeholder="Optional notes from the teacher..."
          />
        </div>
      </Card>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {canSubmit ? "Ready to finish!" : "Complete the final plan, discuss aloud, and confirm before finishing."}
        </p>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            patch({ submitted: true });
            onComplete();
          }}
        >
          Finish Lesson →
        </PrimaryButton>
      </div>
    </div>
  );
}
