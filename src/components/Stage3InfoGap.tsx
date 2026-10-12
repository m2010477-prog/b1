import { useState } from "react";
import { INFO_GAP_FIELDS, VENUES, SOLO_INFO_ANSWERS, type InfoGapField } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, SecondaryButton, Pill, TextInput } from "./ui";
import type { LessonState } from "../types";

function FactSheet({ role, fields }: { role: "A" | "B"; fields: InfoGapField[] }) {
  const mine = fields.filter((f) => f.knownBy === role);
  return (
    <Card className="border-2 border-[#7a2e2e]">
      <Pill tone="bad">🔒 Private fact sheet — Student {role}</Pill>
      <p className="mt-3 mb-2 text-sm text-[#5c5349]">
        Tell your partner these facts when they ask — don't just read out the whole sheet!
      </p>
      <ul className="space-y-2">
        {mine.map((f) => (
          <li key={f.id} className="rounded-lg bg-[#fbf4e8] px-3 py-2 text-sm">
            <strong>{f.label}:</strong> {f.correctDisplay}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function Stage3InfoGap({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState<"A" | "B" | null>(null);
  const [soloAsked, setSoloAsked] = useState<Record<string, boolean>>({});
  const isSolo = state.mode === "solo";

  const setAnswer = (id: string, value: string) => {
    update({
      infoGapAnswers: { ...state.infoGapAnswers, [id]: { value, correct: null } },
    });
  };

  const checkAnswer = (field: InfoGapField) => {
    const current = state.infoGapAnswers[field.id]?.value ?? "";
    const correct = field.answerCheck(current);
    update({
      infoGapAnswers: {
        ...state.infoGapAnswers,
        [field.id]: { value: current, correct },
      },
    });
  };

  const allCorrect = INFO_GAP_FIELDS.every((f) => state.infoGapAnswers[f.id]?.correct === true);

  const handleFinish = () => {
    update({ infoGapUnlocked: true });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 3 · Information gap"
        title="Complete the planning table"
        description="Together you have all the facts about the three venues — but neither of you has all of them alone. Ask each other the questions below, then fill in and check the shared grid."
      />

      {!isSolo && (
        <div className="grid gap-4 sm:grid-cols-2">
          {revealed === null ? (
            <>
              <SecondaryButton onClick={() => setRevealed("A")}>
                👁 Show Student A's fact sheet
              </SecondaryButton>
              <SecondaryButton onClick={() => setRevealed("B")}>
                👁 Show Student B's fact sheet
              </SecondaryButton>
            </>
          ) : (
            <div className="sm:col-span-2 space-y-3">
              <FactSheet role={revealed} fields={INFO_GAP_FIELDS} />
              <SecondaryButton onClick={() => setRevealed(null)}>
                Hide & pass to partner 🙈
              </SecondaryButton>
            </div>
          )}
        </div>
      )}

      {isSolo && (
        <Card>
          <p className="mb-3 text-sm text-[#5c5349]">
            Click a question to ask your virtual partner. (This is a scripted response, not a real
            conversation — but it gives you the missing fact, just like a real partner would.)
          </p>
          <div className="flex flex-col gap-2">
            {INFO_GAP_FIELDS.filter((f) => f.knownBy !== state.soloRole).map((f) => (
              <div key={f.id}>
                <button
                  onClick={() => setSoloAsked((s) => ({ ...s, [f.id]: true }))}
                  className="w-full rounded-lg border border-[#d8c9b2] bg-white px-3 py-2 text-left text-sm font-medium hover:bg-[#efe6d8]"
                >
                  ❓ {f.question}
                </button>
                {soloAsked[f.id] && (
                  <p className="mt-1 rounded-lg bg-[#efe6d8] px-3 py-2 text-sm italic text-[#2c2420]">
                    🗨 Partner: "{SOLO_INFO_ANSWERS[f.id]}"
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#8a3b3b]">
            The facts you already know ({INFO_GAP_FIELDS.filter((f) => f.knownBy === state.soloRole)
              .map((f) => f.label)
              .join(", ")}) don't need asking — just fill them in below.
          </p>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 text-lg font-bold text-[#2c2420]">Shared planning grid</h3>
        <div className="grid gap-3">
          {INFO_GAP_FIELDS.map((field) => {
            const answer = state.infoGapAnswers[field.id];
            return (
              <div
                key={field.id}
                className="grid grid-cols-1 items-center gap-2 rounded-lg border border-[#e4d8c6] p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#2c2420]">{field.label}</p>
                  <p className="text-xs text-[#8a3b3b]">Ask: "{field.question}"</p>
                </div>
                <TextInput
                  value={answer?.value ?? ""}
                  onChange={(e) => setAnswer(field.id, e.target.value)}
                  placeholder="Write the answer your partner gave you..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => checkAnswer(field)}
                    className="rounded-lg bg-[#2c2420] px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                  >
                    Check
                  </button>
                  {answer?.correct === true && <Pill tone="good">✓</Pill>}
                  {answer?.correct === false && <Pill tone="bad">✗</Pill>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {allCorrect && (
        <Card className="border-2 border-[#3a5c2d] bg-[#eef5e9]">
          <h3 className="mb-2 font-bold text-[#3a5c2d]">✓ Full venue fact sheet unlocked</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.values(VENUES).map((v) => (
              <div key={v.id} className="rounded-lg bg-white p-3 text-sm shadow-sm">
                <p className="font-bold text-[#2c2420]">
                  Option {v.id} — {v.name}
                </p>
                <ul className="mt-1 space-y-0.5 text-[#5c5349]">
                  <li>Cost: £{v.cost}</li>
                  <li>Capacity: {v.capacity}</li>
                  <li>{v.indoor ? "Indoor" : "Outdoor, no roof"}</li>
                  <li>Step-free access: {v.accessible ? "Yes" : "No"}</li>
                  <li>Closes: {v.closingTime}</li>
                  <li>Electricity: {v.electricity ? "Yes" : "No"}</li>
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {allCorrect
            ? "All six facts confirmed — you're ready to plan."
            : "Check all six facts correctly to unlock the full venue sheet and continue."}
        </p>
        <PrimaryButton disabled={!allCorrect} onClick={handleFinish}>
          Continue to First Decision →
        </PrimaryButton>
      </div>
    </div>
  );
}
