import type { VenueId } from "./lessonData";

export type Mode = "pair" | "solo";
export type SoloRole = "A" | "B"; // which role the solo learner plays (partner plays the other)

export interface DecisionPlan {
  venue: VenueId | "";
  guests: number;
  advantages: string; // two advantages, free text
  problem: string;
  reaction: string;
  compromise: string;
  discussed: boolean;
  submitted: boolean;
}

export const emptyPlan = (guests: number): DecisionPlan => ({
  venue: "",
  guests,
  advantages: "",
  problem: "",
  reaction: "",
  compromise: "",
  discussed: false,
  submitted: false,
});

export interface WeatherPlan {
  stillWorks: "" | "yes" | "no" | "partly";
  changes: string;
  venue: VenueId | "";
  guests: number;
  discussed: boolean;
  submitted: boolean;
}

export interface MoneyPlan {
  choice: "" | "raise" | "reduce" | "format" | "date";
  justification: string;
  newGuests: number;
  newBudget: number;
  discussed: boolean;
  submitted: boolean;
}

export interface FinalPlan {
  venue: VenueId | "";
  guests: number;
  budget: number;
  activities: string[];
  customActivity: string;
  startTime: string;
  endTime: string;
  reasons: string;
  discussed: boolean;
  submitted: boolean;
}

export interface RubricScores {
  [criterionId: string]: number; // 0-4
}

export interface SelfAssessment {
  [key: string]: boolean;
}

export interface LessonState {
  mode: Mode | "";
  soloRole: SoloRole;
  stage: number; // 1-10
  // stage 1
  warmUpChoices: Record<string, { option: string; justification: string }>;
  phraseAnswers: Record<string, { value: string; correct: boolean | null }>;
  // stage 2
  viewedA: boolean;
  viewedB: boolean;
  // stage 3
  infoGapAnswers: Record<string, { value: string; correct: boolean | null }>;
  infoGapUnlocked: boolean;
  // stage 4
  decision1: DecisionPlan;
  // stage 5
  weather: WeatherPlan;
  // stage 6
  money: MoneyPlan;
  // stage 7
  memoryAnswers: Record<string, "true" | "false" | "discuss" | "">;
  // stage 8
  finalPlan: FinalPlan;
  rubric: RubricScores;
  teacherComment: string;
  selfAssessment: SelfAssessment;
  // solo chat memory
  soloLog: string[];
}

export const STORAGE_KEY = "perfect-hangout-lesson-v1";
