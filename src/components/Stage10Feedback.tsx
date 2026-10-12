import { PHRASE_TASKS, CORE_PHRASES, INFO_GAP_FIELDS, VENUES, RUBRIC } from "../lessonData";
import { Card, SectionTitle, Pill, TextArea, SecondaryButton } from "./ui";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

const SELF_CHECKLIST: { id: string; label: string }[] = [
  { id: "sc1", label: "I asked my partner questions to find missing information." },
  { id: "sc2", label: "I explained my reasons using full sentences." },
  { id: "sc3", label: "I reacted to my partner's concerns instead of ignoring them." },
  { id: "sc4", label: "I used at least one negotiation phrase (e.g. 'What if we...?')." },
  { id: "sc5", label: "I adapted our plan when new information appeared." },
  { id: "sc6", label: "I contributed roughly equally to the conversation." },
];

export function Stage10Feedback({
  state,
  update,
  onRestart,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onRestart: () => void;
}) {
  const correctFactual = INFO_GAP_FIELDS.filter((f) => state.infoGapAnswers[f.id]?.correct === true);
  const incorrectPhrases = PHRASE_TASKS.filter((p) => state.phraseAnswers[p.id]?.correct === false);
  const correctPhrases = PHRASE_TASKS.filter((p) => state.phraseAnswers[p.id]?.correct === true);

  const v1 = state.decision1.venue ? VENUES[state.decision1.venue as VenueId] : null;
  const v2 = state.weather.venue ? VENUES[state.weather.venue as VenueId] : null;
  const v3 = state.finalPlan.venue ? VENUES[state.finalPlan.venue as VenueId] : null;

  const toggleCheck = (id: string) => {
    update({ selfAssessment: { ...state.selfAssessment, [id]: !state.selfAssessment[id] } });
  };

  const rubricTotal = RUBRIC.reduce((sum, r) => sum + (state.rubric[r.id] ?? 0), 0);
  const rubricMax = RUBRIC.length * 4;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 10 · Personal feedback"
        title="How did it go?"
        description="A summary of your checked language and factual tasks, how your plan evolved, and space for self- and teacher-reflection. We don't invent a fluency or pronunciation score — only explicitly checked items are reported here."
      />

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">✅ Factual challenges completed</h3>
        {correctFactual.length === 0 ? (
          <p className="text-sm text-[#8a3b3b]">No factual items were confirmed correct yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {correctFactual.map((f) => (
              <Pill key={f.id} tone="good">
                {f.label}: {f.correctDisplay}
              </Pill>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">📝 Language tasks</h3>
        <p className="mb-2 text-sm text-[#5c5349]">
          Correct: {correctPhrases.length} / {PHRASE_TASKS.length}
        </p>
        {incorrectPhrases.length > 0 ? (
          <div>
            <p className="mb-1 text-sm font-semibold text-[#8a3b3b]">Suggested review:</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[#2c2420]">
              {incorrectPhrases.map((p) => (
                <li key={p.id}>{p.prompt}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-[#3a5c2d]">All checked language tasks were answered correctly!</p>
        )}
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">💬 Useful B1 expressions to keep using</h3>
        <div className="flex flex-wrap gap-2">
          {CORE_PHRASES.map((p) => (
            <Pill key={p}>{p}</Pill>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">🔄 How your plan changed</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#fbf4e8] p-3 text-sm">
            <p className="font-semibold text-[#7a2e2e]">First plan</p>
            <p>{v1 ? `Option ${v1.id} — ${v1.name}` : "—"}</p>
            <p>{state.decision1.guests} guests</p>
          </div>
          <div className="rounded-lg bg-[#fbf4e8] p-3 text-sm">
            <p className="font-semibold text-[#7a2e2e]">After weather alert</p>
            <p>{v2 ? `Option ${v2.id} — ${v2.name}` : "—"}</p>
            <p>{state.weather.stillWorks === "yes" ? "Kept original plan" : state.weather.stillWorks === "no" ? "Changed completely" : state.weather.stillWorks === "partly" ? "Adjusted plan" : "—"}</p>
          </div>
          <div className="rounded-lg bg-[#fbf4e8] p-3 text-sm">
            <p className="font-semibold text-[#7a2e2e]">Final plan</p>
            <p>{v3 ? `Option ${v3.id} — ${v3.name}` : "—"}</p>
            <p>{state.finalPlan.guests} guests, £{state.finalPlan.budget}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#5c5349]">
          Money decision: <strong>{state.money.choice || "not recorded"}</strong>
          {state.money.justification && ` — "${state.money.justification}"`}
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">🗣 Speaking self-assessment</h3>
        <div className="space-y-2">
          {SELF_CHECKLIST.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm text-[#2c2420]">
              <input
                type="checkbox"
                checked={!!state.selfAssessment[item.id]}
                onChange={() => toggleCheck(item.id)}
                className="h-4 w-4 accent-[#7a2e2e]"
              />
              {item.label}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-[#2c2420]">👩‍🏫 Teacher feedback</h3>
        <p className="mb-2 text-sm text-[#5c5349]">
          Rubric score so far: <strong>{rubricTotal} / {rubricMax}</strong> (set in Stage 8)
        </p>
        <TextArea
          rows={4}
          value={state.teacherComment}
          onChange={(e) => update({ teacherComment: e.target.value })}
          placeholder="Teacher: add personalised feedback here..."
        />
      </Card>

      <div className="flex justify-end">
        <SecondaryButton onClick={onRestart}>🔁 Restart the whole lesson</SecondaryButton>
      </div>
    </div>
  );
}
