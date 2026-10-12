import { useState } from "react";
import { WARMUP_ITEMS, PHRASE_TASKS, CORE_PHRASES } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, Pill, TextArea, TextInput } from "./ui";
import type { LessonState } from "../types";

export function Stage1WarmUp({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const [showPhrases, setShowPhrases] = useState(false);

  const allWarmUpDone = WARMUP_ITEMS.every((w) => {
    const c = state.warmUpChoices[w.id];
    return c && c.option && c.justification.trim().length >= 8;
  });

  const checkedCount = Object.values(state.phraseAnswers).filter((a) => a.correct !== null).length;
  const allPhrasesChecked = checkedCount === PHRASE_TASKS.length;

  const setChoice = (id: string, option: string) => {
    const prev = state.warmUpChoices[id] || { option: "", justification: "" };
    update({ warmUpChoices: { ...state.warmUpChoices, [id]: { ...prev, option } } });
  };
  const setJustification = (id: string, justification: string) => {
    const prev = state.warmUpChoices[id] || { option: "", justification: "" };
    update({ warmUpChoices: { ...state.warmUpChoices, [id]: { ...prev, justification } } });
  };

  const checkPhrase = (id: string, answers: string[]) => {
    const current = state.phraseAnswers[id]?.value ?? "";
    const correct = answers.includes(current.trim().toLowerCase());
    update({
      phraseAnswers: { ...state.phraseAnswers, [id]: { value: current, correct } },
    });
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 1 · Warm-up"
        title="What really matters?"
        description="Six quick real-life trade-offs about organising social events. There's no single 'correct' click — talk it through with your partner (or think it through alone) and justify your choice in a few words."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {WARMUP_ITEMS.map((item, idx) => {
          const choice = state.warmUpChoices[item.id];
          return (
            <Card key={item.id}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8a3b3b]">
                Situation {idx + 1}
              </p>
              <p className="mb-4 text-[#2c2420]">{item.situation}</p>
              <div className="mb-3 flex flex-col gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setChoice(item.id, opt.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                      choice?.option === opt.id
                        ? "border-[#7a2e2e] bg-[#7a2e2e] text-[#fbf4e8]"
                        : "border-[#d8c9b2] bg-white text-[#2c2420] hover:bg-[#efe6d8]"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              <p className="mb-1 text-xs font-semibold text-[#5c5349]">{item.followUp}</p>
              <TextArea
                rows={2}
                placeholder="Explain your reasoning (at least one sentence)..."
                value={choice?.justification ?? ""}
                onChange={(e) => setJustification(item.id, e.target.value)}
              />
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="mb-2 text-lg font-bold text-[#2c2420]">Useful language for negotiating</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {CORE_PHRASES.map((p) => (
            <Pill key={p} tone="neutral">
              {p}
            </Pill>
          ))}
        </div>
        <button
          onClick={() => setShowPhrases((s) => !s)}
          className="text-sm font-semibold text-[#7a2e2e] underline"
        >
          {showPhrases ? "Hide" : "Show"} quick phrase practice (auto-checked)
        </button>
        {showPhrases && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {PHRASE_TASKS.map((task) => {
              const answer = state.phraseAnswers[task.id];
              return (
                <div key={task.id} className="rounded-lg border border-[#e4d8c6] p-3">
                  <p className="mb-2 text-sm text-[#2c2420]">{task.prompt}</p>
                  <div className="flex gap-2">
                    <TextInput
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        update({
                          phraseAnswers: {
                            ...state.phraseAnswers,
                            [task.id]: { value: e.target.value, correct: null },
                          },
                        })
                      }
                      placeholder="Type your answer..."
                    />
                    <button
                      onClick={() => checkPhrase(task.id, task.answer)}
                      className="shrink-0 rounded-lg bg-[#2c2420] px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                    >
                      Check
                    </button>
                  </div>
                  {answer?.correct === true && (
                    <p className="mt-1 text-xs font-semibold text-[#3a5c2d]">✓ Correct!</p>
                  )}
                  {answer?.correct === false && (
                    <p className="mt-1 text-xs font-semibold text-[#8a3b3b]">
                      Not quite — try again.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {allWarmUpDone
            ? "Great — all six situations discussed."
            : "Choose an option and write a short justification for all six situations to continue."}
          {" "}
          {allPhrasesChecked ? "Phrase practice complete." : `(Phrase practice checked: ${checkedCount}/${PHRASE_TASKS.length})`}
        </p>
        <PrimaryButton disabled={!allWarmUpDone} onClick={onComplete}>
          Continue to Role Cards →
        </PrimaryButton>
      </div>
    </div>
  );
}
