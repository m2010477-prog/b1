import { useMemo, useState } from "react";
import { Card, SectionTitle, PrimaryButton, Pill } from "./ui";
import { SpeakingCheckpoint } from "./SpeakingCheckpoint";
import { VENUES } from "../lessonData";
import type { LessonState } from "../types";
import type { VenueId } from "../lessonData";

interface ChatMsg {
  from: "partner" | "me";
  text: string;
}

export function Stage9Solo({
  state,
  update,
  onComplete,
}: {
  state: LessonState;
  update: (patch: Partial<LessonState>) => void;
  onComplete: () => void;
}) {
  const isSolo = state.mode === "solo";
  const finalVenue = (state.finalPlan.venue || "A") as VenueId;
  const venue = VENUES[finalVenue];

  const [step, setStep] = useState(0);
  const [log, setLog] = useState<ChatMsg[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  // A fixed, pre-written branching script (NOT a generative AI partner).
  const steps = useMemo(
    () => [
      {
        partner: `Honestly, I think Option ${finalVenue} (${venue.name}) was a reasonable choice overall, but I still want to double-check something — can I ask you a question?`,
        options: [
          { text: "Sure, go ahead.", reply: "Great — thanks for being open to it." },
          { text: "Okay, but I think our plan is already solid.", reply: "Fair enough, I just want to make sure we agree on the details." },
        ],
      },
      {
        partner: venue.indoor
          ? "Since we went indoors, I'm not worried about the rain anymore. But did we definitely stick to the budget?"
          : "We're still outdoors without a roof — are you sure we've solved the weather problem?",
        options: [
          { text: "Yes, we adjusted the budget / solved the weather issue.", reply: "Good, as long as we both explained that clearly in our final plan." },
          { text: "Actually, we compromised on something else instead.", reply: "That's fine too, as long as it's a real compromise and not just ignoring the problem." },
        ],
      },
      {
        partner: "One more thing — what about the guest who needs step-free access? Can they get in and move around easily?",
        options: [
          { text: venue.accessible ? "Yes, this venue has step-free access." : "Hmm, actually that could be a problem here.", reply: venue.accessible ? "Perfect, that's one less thing to worry about." : "Right — that's worth mentioning as a limitation in your final explanation." },
          { text: "We already discussed that and found a solution.", reply: "Good — make sure it's clear in your 60–90 second explanation." },
        ],
      },
      {
        partner: "Last thing: are you happy with how we handled the extra £30 opportunity?",
        options: [
          { text: "Yes, we justified it well.", reply: "Great — that shows good negotiation skills." },
          { text: "We decided not to use it, and explained why.", reply: "That's a valid choice too, as long as there's a clear reason." },
        ],
      },
      {
        partner: "Alright, I think we're ready. Good luck explaining our final plan!",
        options: [{ text: "Thanks — let's do it.", reply: "🎉" }],
      },
    ],
    [finalVenue, venue]
  );

  const current = steps[step];
  const finished = step >= steps.length;

  const choose = (optText: string, reply: string) => {
    const newLog: ChatMsg[] = [
      ...log,
      { from: "partner", text: current.partner },
      { from: "me", text: optText },
      { from: "partner", text: reply },
    ];
    setLog(newLog);
    update({ soloLog: newLog.map((m) => `${m.from === "partner" ? "Partner" : "You"}: ${m.text}`) });
    setStep((s) => s + 1);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Stage 9 · Solo practice partner"
        title={isSolo ? "A chat with your scripted practice partner" : "Optional extra speaking practice"}
        description={
          isSolo
            ? "This is a fixed, pre-written practice dialogue (not a real AI conversation) designed to let you rehearse responding to opinions, clarification requests and concerns before you present your final plan."
            : "Even in pair mode, you can use this scripted practice partner for extra individual rehearsal — useful for homework or solo revision."
        }
      />

      <Card>
        <div className="mb-4 max-h-80 space-y-2 overflow-y-auto rounded-lg bg-[#fbf4e8] p-3">
          {log.length === 0 && <p className="text-sm text-[#8a3b3b]">The conversation will appear here...</p>}
          {log.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.from === "partner"
                  ? "bg-white text-[#2c2420]"
                  : "ml-auto bg-[#7a2e2e] text-[#fbf4e8]"
              }`}
            >
              {m.text}
            </div>
          ))}
          {!finished && (
            <div className="max-w-[85%] rounded-lg bg-white px-3 py-2 text-sm text-[#2c2420]">
              {current.partner}
            </div>
          )}
        </div>

        {!finished ? (
          <div className="flex flex-col gap-2">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => choose(opt.text, opt.reply)}
                className="rounded-lg border border-[#d8c9b2] bg-white px-3 py-2 text-left text-sm font-medium hover:bg-[#efe6d8]"
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <Pill tone="good">✓ Practice conversation complete</Pill>
        )}
      </Card>

      <SpeakingCheckpoint
        prompt="Say your replies out loud (don't just click!) before moving on — try recording yourself if you can."
        confirmed={confirmed}
        onConfirmChange={setConfirmed}
      />

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5c5349]">
          {finished && confirmed ? "Nice work — ready for your feedback summary." : "Finish the conversation and confirm you spoke aloud."}
        </p>
        <PrimaryButton disabled={!finished || !confirmed} onClick={onComplete}>
          See My Feedback →
        </PrimaryButton>
      </div>
    </div>
  );
}
