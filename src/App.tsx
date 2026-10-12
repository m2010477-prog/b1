import { useEffect, useState } from "react";
import type { LessonState, Mode, SoloRole } from "./types";
import { STORAGE_KEY, emptyPlan } from "./types";
import { EXPECTED_GUESTS, INITIAL_BUDGET } from "./lessonData";
import { IntroScreen } from "./components/IntroScreen";
import { Header } from "./components/Header";
import { Stage1WarmUp } from "./components/Stage1WarmUp";
import { Stage2Roles } from "./components/Stage2Roles";
import { Stage3InfoGap } from "./components/Stage3InfoGap";
import { Stage4Decision } from "./components/Stage4Decision";
import { Stage5Weather } from "./components/Stage5Weather";
import { Stage6Money } from "./components/Stage6Money";
import { Stage7Memory } from "./components/Stage7Memory";
import { Stage8Final } from "./components/Stage8Final";
import { Stage9Solo } from "./components/Stage9Solo";
import { Stage10Feedback } from "./components/Stage10Feedback";

function freshState(): LessonState {
  return {
    mode: "",
    soloRole: "A",
    stage: 1,
    warmUpChoices: {},
    phraseAnswers: {},
    viewedA: false,
    viewedB: false,
    infoGapAnswers: {},
    infoGapUnlocked: false,
    decision1: emptyPlan(EXPECTED_GUESTS),
    weather: {
      stillWorks: "",
      changes: "",
      venue: "",
      guests: EXPECTED_GUESTS,
      discussed: false,
      submitted: false,
    },
    money: {
      choice: "",
      justification: "",
      newGuests: EXPECTED_GUESTS,
      newBudget: INITIAL_BUDGET,
      discussed: false,
      submitted: false,
    },
    memoryAnswers: {},
    finalPlan: {
      venue: "",
      guests: EXPECTED_GUESTS,
      budget: INITIAL_BUDGET,
      activities: [],
      customActivity: "",
      startTime: "",
      endTime: "",
      reasons: "",
      discussed: false,
      submitted: false,
    },
    rubric: {},
    teacherComment: "",
    selfAssessment: {},
    soloLog: [],
  };
}

function loadState(): LessonState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...freshState(), ...parsed };
    }
  } catch {
    // ignore corrupted storage
  }
  return freshState();
}

export default function App() {
  const [state, setState] = useState<LessonState>(() => loadState());
  const [maxStageReached, setMaxStageReached] = useState(() => loadState().stage || 1);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch: Partial<LessonState>) => setState((prev) => ({ ...prev, ...patch }));

  const goToStage = (s: number) => {
    update({ stage: s });
    setMaxStageReached((m) => Math.max(m, s));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStage = () => goToStage(state.stage + 1);

  const start = (mode: Mode, soloRole: SoloRole) => {
    update({ mode, soloRole, stage: 1 });
    setMaxStageReached(1);
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = freshState();
    setState(fresh);
    setMaxStageReached(1);
  };

  if (!state.mode) {
    return (
      <div className="min-h-screen bg-[#f3e9d7]">
        <IntroScreen onStart={start} />
      </div>
    );
  }

  const budgetLabel = (() => {
    const activeVenue =
      state.finalPlan.venue || state.weather.venue || state.decision1.venue || "";
    if (!activeVenue) return `Budget: £${INITIAL_BUDGET}`;
    return `Budget in use: £${state.finalPlan.budget || state.money.newBudget || INITIAL_BUDGET}`;
  })();

  return (
    <div className="min-h-screen bg-[#f3e9d7] pb-16">
      <Header
        stage={state.stage}
        maxStageReached={maxStageReached}
        onJump={goToStage}
        budgetLabel={budgetLabel}
        mode={state.mode}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {state.stage === 1 && (
          <Stage1WarmUp state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 2 && (
          <Stage2Roles state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 3 && (
          <Stage3InfoGap state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 4 && (
          <Stage4Decision state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 5 && (
          <Stage5Weather state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 6 && (
          <Stage6Money state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 7 && (
          <Stage7Memory state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 8 && (
          <Stage8Final state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 9 && (
          <Stage9Solo state={state} update={update} onComplete={nextStage} />
        )}
        {state.stage === 10 && (
          <Stage10Feedback state={state} update={update} onRestart={restart} />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 text-center text-xs text-[#8a7968] sm:px-6">
        The Perfect Hangout? — a B1 communication-first speaking lesson. No data leaves your
        browser; progress is saved locally on this device only.
      </footer>
    </div>
  );
}
