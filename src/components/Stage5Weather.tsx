import { VENUES, WEATHER_PHRASES } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, Pill, TextArea, NotificationCard } from "./ui";
import { SpeakingCheckpoint } from "./SpeakingCheckpoint";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

export function Stage5Weather({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const w = state.weather;
  const patch = (p: Partial<typeof w>) => update({ weather: { ...w, ...p } });
  const originalVenue = state.decision1.venue as VenueId;
  const chosenVenue = (w.venue || originalVenue) as VenueId;
  const venueData = chosenVenue ? VENUES[chosenVenue] : null;

  const canSubmit =
    w.stillWorks !== "" && w.changes.trim().length >= 15 && !!w.venue && w.discussed;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 5 · Something changed"
        title="Wait, something changed!"
        description="React to the surprise, decide whether your original plan survives, and agree on a revised plan together."
      />

      <NotificationCard title="Weather Alert ⛈" icon="⛈">
        Heavy rain is now forecast for the afternoon of your event. Any venue without a roof will
        be seriously affected.
      </NotificationCard>

      <Card>
        <p className="mb-2 text-sm text-[#5c5349]">
          Your original plan was: <strong>Option {originalVenue} — {VENUES[originalVenue]?.name}</strong>{" "}
          ({VENUES[originalVenue]?.indoor ? "indoor" : "outdoor, no roof"}).
        </p>
        <h3 className="mb-2 font-bold text-[#2c2420]">Does your original plan still work?</h3>
        <div className="mb-4 flex gap-2">
          {[
            { id: "yes", label: "Yes, it still works" },
            { id: "partly", label: "Partly — needs adjusting" },
            { id: "no", label: "No, we must change it" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => patch({ stillWorks: opt.id as typeof w.stillWorks })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                w.stillWorks === opt.id
                  ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                  : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
          Describe at least two possible changes you discussed
        </label>
        <TextArea
          rows={3}
          value={w.changes}
          onChange={(e) => patch({ changes: e.target.value })}
          placeholder="e.g. 1) We could move to an indoor venue... 2) We could rent a gazebo for the pavilion..."
        />

        <div className="mt-4">
          <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
            Revised venue (can be the same, if you can justify it)
          </label>
          <div className="flex gap-2">
            {(["A", "B", "C"] as VenueId[]).map((id) => (
              <button
                key={id}
                onClick={() => patch({ venue: id })}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  w.venue === id
                    ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                    : "border-[#d8c9b2] bg-white hover:bg-[#efe6d8]"
                }`}
              >
                {id} — {VENUES[id].name}
              </button>
            ))}
          </div>
          <div className="mt-3 max-w-xs">
            <label className="mb-1 block text-sm font-semibold text-[#2c2420]">
              Expected guests (still correct?)
            </label>
            <input
              type="number"
              min={1}
              value={w.guests}
              onChange={(e) => patch({ guests: parseInt(e.target.value || "0", 10) })}
              className="w-full rounded-lg border border-[#d8c9b2] bg-white px-3 py-2 text-[#2c2420] outline-none focus:border-[#7a2e2e] focus:ring-2 focus:ring-[#7a2e2e]/20"
            />
          </div>
          {venueData && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone={venueData.indoor ? "good" : "bad"}>
                {venueData.indoor ? "Indoor — rain is not a problem" : "Outdoor, no roof — rain IS a problem"}
              </Pill>
              <Pill tone="neutral">Cost £{venueData.cost}</Pill>
              <Pill tone={w.guests > venueData.capacity ? "bad" : "good"}>
                Capacity {venueData.capacity} for {w.guests} guests
              </Pill>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h4 className="mb-2 text-sm font-bold text-[#7a2e2e]">Language support</h4>
        <div className="flex flex-wrap gap-2">
          {WEATHER_PHRASES.map((p) => (
            <Pill key={p}>{p}</Pill>
          ))}
        </div>
      </Card>

      <SpeakingCheckpoint
        prompt="Talk through the weather problem with your partner: explain whether the plan still works, discuss two alternatives, and agree before submitting."
        confirmed={w.discussed}
        onConfirmChange={(v) => patch({ discussed: v })}
      />

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {canSubmit ? "Ready to lock in your revised plan." : "Complete all fields above to continue."}
        </p>
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            patch({ submitted: true });
            onComplete();
          }}
        >
          Submit Revised Plan →
        </PrimaryButton>
      </div>
    </div>
  );
}
