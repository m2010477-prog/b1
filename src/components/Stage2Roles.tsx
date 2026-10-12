import { useState } from "react";
import { ROLE_CARDS } from "../lessonData";
import { Card, SectionTitle, PrimaryButton, SecondaryButton, Pill } from "./ui";
import type { LessonState } from "../types";

export function Stage2Roles({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState<"A" | "B" | null>(null);
  const isSolo = state.mode === "solo";

  const bothViewed = isSolo ? true : state.viewedA && state.viewedB;

  if (isSolo) {
    const myRole = ROLE_CARDS[state.soloRole];
    const partnerRole = ROLE_CARDS[state.soloRole === "A" ? "B" : "A"];
    return (
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Stage 2 · Secret role card"
          title="Your private mission briefing"
          description="In solo mode, your virtual partner secretly holds the other role card. You only see your own information below — you'll need to ask questions to find out the rest."
        />
        <Card className="border-2 border-[#7a2e2e]">
          <Pill tone="bad">🔒 Private — yours only</Pill>
          <h3 className="mt-3 text-xl font-bold text-[#2c2420]">{myRole.title}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[#2c2420]">
            {myRole.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs italic text-[#8a3b3b]">{myRole.secretNote}</p>
        </Card>
        <Card className="opacity-70">
          <p className="text-sm text-[#5c5349]">
            Your virtual partner is playing <strong>{partnerRole.title}</strong>. Their private
            information is hidden from you — you will uncover it during the Information Gap and
            Decision stages by asking questions.
          </p>
        </Card>
        <div className="flex justify-end">
          <PrimaryButton onClick={onComplete}>Continue to Information Gap →</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 2 · Secret role cards"
        title="One device, two secret identities"
        description="Decide who is Student A and who is Student B. Each of you should view ONLY your own card. If you're sharing one device, use 'Hide & pass to partner' so the other person doesn't see your secrets. If you each have your own device, simply open your own role below — the app does not and cannot transmit this information to your partner's device, so you will genuinely need to talk to each other."
      />

      {revealed === null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setRevealed("A")}
            className="rounded-2xl border-2 border-[#d8c9b2] bg-white p-8 text-left transition hover:border-[#7a2e2e] hover:bg-[#fbf4e8]"
          >
            <p className="text-sm font-semibold text-[#8a3b3b]">I am...</p>
            <p className="text-2xl font-bold text-[#2c2420]">Student A</p>
            <p className="mt-1 text-sm text-[#5c5349]">The Organiser</p>
            {state.viewedA && <Pill tone="good">✓ viewed</Pill>}
          </button>
          <button
            onClick={() => setRevealed("B")}
            className="rounded-2xl border-2 border-[#d8c9b2] bg-white p-8 text-left transition hover:border-[#7a2e2e] hover:bg-[#fbf4e8]"
          >
            <p className="text-sm font-semibold text-[#8a3b3b]">I am...</p>
            <p className="text-2xl font-bold text-[#2c2420]">Student B</p>
            <p className="mt-1 text-sm text-[#5c5349]">The Experience Designer</p>
            {state.viewedB && <Pill tone="good">✓ viewed</Pill>}
          </button>
        </div>
      )}

      {revealed && (
        <Card className="border-2 border-[#7a2e2e]">
          <div className="mb-3 flex items-center justify-between">
            <Pill tone="bad">🔒 Private — Student {revealed} only</Pill>
          </div>
          <h3 className="text-xl font-bold text-[#2c2420]">{ROLE_CARDS[revealed].title}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[#2c2420]">
            {ROLE_CARDS[revealed].bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs italic text-[#8a3b3b]">{ROLE_CARDS[revealed].secretNote}</p>
          <div className="mt-5 flex justify-end">
            <SecondaryButton
              onClick={() => {
                if (revealed === "A") update({ viewedA: true });
                if (revealed === "B") update({ viewedB: true });
                setRevealed(null);
              }}
            >
              Hide card & pass device to partner 🙈
            </SecondaryButton>
          </div>
        </Card>
      )}

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {bothViewed
            ? "Both roles have been viewed. Remember — don't reveal your secrets directly, discover them by asking!"
            : "Both Student A and Student B need to view their card before continuing."}
        </p>
        <PrimaryButton disabled={!bothViewed} onClick={onComplete}>
          Continue to Information Gap →
        </PrimaryButton>
      </div>
    </div>
  );
}
