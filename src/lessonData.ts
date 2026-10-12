// ============================================================================
// THE PERFECT HANGOUT? — A Plan That Keeps Changing
// Static lesson data: venues, roles, phrases, warm-up items, dialogue scripts
// ============================================================================

export type VenueId = "A" | "B" | "C";

export interface Venue {
  id: VenueId;
  name: string;
  cost: number;
  capacity: number;
  indoor: boolean;
  accessible: boolean; // step-free access
  closingTime: string; // display
  closingHour: number; // 24h for comparisons
  electricity: boolean;
  tables: boolean;
  notes: string;
}

export const VENUES: Record<VenueId, Venue> = {
  A: {
    id: "A",
    name: "Studio Café",
    cost: 160,
    capacity: 24,
    indoor: true,
    accessible: true,
    closingTime: "7:00 p.m.",
    closingHour: 19,
    electricity: true,
    tables: true,
    notes: "Cosy indoor café space. Lovely atmosphere, but it's quite small and closes early.",
  },
  B: {
    id: "B",
    name: "Park Pavilion",
    cost: 90,
    capacity: 40,
    indoor: false,
    accessible: true,
    closingTime: "8:00 p.m.",
    closingHour: 20,
    electricity: false,
    tables: false,
    notes: "Open-air pavilion with no roof and no power supply. Cheapest option by far.",
  },
  C: {
    id: "C",
    name: "Community Hall",
    cost: 220,
    capacity: 40,
    indoor: true,
    accessible: true,
    closingTime: "8:00 p.m.",
    closingHour: 20,
    electricity: true,
    tables: true,
    notes: "Spacious indoor hall with electricity and tables included, but the most expensive choice.",
  },
};

export const INITIAL_BUDGET = 200;
export const EXPECTED_GUESTS = 30;
export const EXTRA_MONEY = 30;

// ---------------------------------------------------------------------------
// Useful B1 phrases shown throughout the lesson
// ---------------------------------------------------------------------------
export const CORE_PHRASES: string[] = [
  "I'd rather...",
  "The main advantage is...",
  "The problem with that option is...",
  "What if we...?",
  "That might work, but...",
  "How about finding a compromise?",
  "I see your point.",
  "We could... instead.",
];

export const WEATHER_PHRASES: string[] = [
  "We need to reconsider...",
  "That changes things because...",
  "Our original plan might not work.",
  "Perhaps we should...",
  "The best alternative would be...",
];

// ---------------------------------------------------------------------------
// STAGE 1 — Warm-up situations
// ---------------------------------------------------------------------------
export interface WarmUpItem {
  id: string;
  situation: string;
  options: { id: string; text: string }[];
  // no single "correct" option — students must justify. We only require a choice + reasoning.
  followUp: string;
}

export const WARMUP_ITEMS: WarmUpItem[] = [
  {
    id: "w1",
    situation:
      "A cheaper venue is 25 minutes further away by bus. The more expensive one is a 5-minute walk.",
    options: [
      { id: "cheap", text: "Choose the cheaper, further venue" },
      { id: "near", text: "Choose the closer, pricier venue" },
    ],
    followUp: "Why? What matters more to you: saving money or saving time?",
  },
  {
    id: "w2",
    situation:
      "A large venue is only free for 90 minutes. A smaller venue is free all afternoon.",
    options: [
      { id: "large", text: "Book the large venue for a short time" },
      { id: "small", text: "Book the smaller venue for longer" },
    ],
    followUp: "Why? Is it better to have more space or more time?",
  },
  {
    id: "w3",
    situation:
      "A really fun outdoor activity isn't suitable for a friend who uses a wheelchair.",
    options: [
      { id: "fun", text: "Do the fun activity anyway" },
      { id: "alt", text: "Choose a different activity everyone can join" },
    ],
    followUp: "Why? How important is it that absolutely everyone can take part?",
  },
  {
    id: "w4",
    situation:
      "You can invite everyone (35 people) to a free venue with no electricity, or 20 people to a venue with music and lights.",
    options: [
      { id: "everyone", text: "Invite everyone, keep it simple" },
      { id: "fewer", text: "Invite fewer people, make it a bigger experience" },
    ],
    followUp: "Why? Is it better to include everyone or to create a better atmosphere?",
  },
  {
    id: "w5",
    situation:
      "The weather forecast is uncertain. One venue is outdoors and free; the other is indoors and costs money.",
    options: [
      { id: "outdoor", text: "Risk it and book outdoors" },
      { id: "indoor", text: "Pay more to be safe indoors" },
    ],
    followUp: "Why? How much risk are you willing to take?",
  },
  {
    id: "w6",
    situation:
      "Your group disagrees: half want games and music, half want a quiet chat and food. There isn't time or money for both.",
    options: [
      { id: "games", text: "Focus on games and music" },
      { id: "chat", text: "Focus on food and conversation" },
    ],
    followUp: "Why? How could you find a compromise instead of choosing only one?",
  },
];

// Phrase-completion / reconstruction tasks (auto-checked)
export interface PhraseTask {
  id: string;
  prompt: string;
  answer: string[]; // accepted variations (lowercase, trimmed)
}

export const PHRASE_TASKS: PhraseTask[] = [
  {
    id: "p1",
    prompt: "Complete: 'The problem ____ that option is the price.'",
    answer: ["with"],
  },
  {
    id: "p2",
    prompt: "Complete: 'That might work, ____ it's quite expensive.'",
    answer: ["but"],
  },
  {
    id: "p3",
    prompt: "Reorder into a polite suggestion: 'compromise / we / how about / finding / a / ?'",
    answer: [
      "how about finding a compromise",
      "how about finding a compromise?",
    ],
  },
  {
    id: "p4",
    prompt: "Complete: 'I'd ____ go somewhere cheaper.' (preference)",
    answer: ["rather"],
  },
  {
    id: "p5",
    prompt: "Complete: 'What ____ we booked it for the morning instead?'",
    answer: ["if"],
  },
  {
    id: "p6",
    prompt: "Complete: 'We could try a smaller venue ____.' (replacement idea)",
    answer: ["instead"],
  },
];

// ---------------------------------------------------------------------------
// STAGE 2 — Secret role cards
// ---------------------------------------------------------------------------
export interface RoleCard {
  id: "A" | "B";
  title: string;
  bullets: string[];
  secretNote: string;
}

export const ROLE_CARDS: Record<"A" | "B", RoleCard> = {
  A: {
    id: "A",
    title: "Student A — The Organiser",
    bullets: [
      "You are responsible for the budget.",
      "You cannot spend more than £200 — unless the group finds extra money.",
      "You expect 30 guests.",
      "You want an enjoyable event, but the planning must be realistic.",
      "You know the exact COST of all three venues.",
    ],
    secretNote:
      "Keep this information to yourself at first. Your partner does not know what you know — you'll need to tell them, and ask them questions too.",
  },
  B: {
    id: "B",
    title: "Student B — The Experience Designer",
    bullets: [
      "You want every invited guest to be able to attend.",
      "At least one guest needs step-free access (no stairs).",
      "You prefer an indoor event, but you're willing to discuss alternatives.",
      "The event must finish by 8 p.m. — no later.",
      "You know the CAPACITY of Studio Café, and the CLOSING TIME / FACILITIES of Park Pavilion and Community Hall.",
    ],
    secretNote:
      "Keep this information to yourself at first. Your partner does not know what you know — you'll need to tell them, and ask them questions too.",
  },
};

// ---------------------------------------------------------------------------
// STAGE 3 — Information gap grid
// ---------------------------------------------------------------------------
export interface InfoGapField {
  id: string;
  label: string;
  venue: VenueId;
  knownBy: "A" | "B"; // who already knows this fact and must tell their partner
  question: string; // suggested question the other student can ask
  answerCheck: (value: string) => boolean;
  correctDisplay: string;
}

function numMatch(target: number) {
  return (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    return digits !== "" && parseInt(digits, 10) === target;
  };
}

function textIncludes(keywords: string[]) {
  return (value: string) => {
    const v = value.toLowerCase();
    return keywords.some((k) => v.includes(k));
  };
}

export const INFO_GAP_FIELDS: InfoGapField[] = [
  {
    id: "costA",
    label: "Cost of Studio Café",
    venue: "A",
    knownBy: "A",
    question: "How much does the Studio Café cost?",
    answerCheck: numMatch(160),
    correctDisplay: "£160",
  },
  {
    id: "costB",
    label: "Cost of Park Pavilion",
    venue: "B",
    knownBy: "A",
    question: "How much does the Park Pavilion cost?",
    answerCheck: numMatch(90),
    correctDisplay: "£90",
  },
  {
    id: "costC",
    label: "Cost of Community Hall",
    venue: "C",
    knownBy: "A",
    question: "How much does the Community Hall cost?",
    answerCheck: numMatch(220),
    correctDisplay: "£220",
  },
  {
    id: "capA",
    label: "Capacity of Studio Café",
    venue: "A",
    knownBy: "B",
    question: "How many people can the Studio Café hold?",
    answerCheck: numMatch(24),
    correctDisplay: "24 people",
  },
  {
    id: "closeB",
    label: "Closing time & facilities of Park Pavilion",
    venue: "B",
    knownBy: "B",
    question: "What time does the Park Pavilion close, and does it have electricity?",
    answerCheck: textIncludes(["8", "no electric", "without electric", "no power"]),
    correctDisplay: "Closes 8 p.m. — no electricity",
  },
  {
    id: "closeC",
    label: "Closing time & facilities of Community Hall",
    venue: "C",
    knownBy: "B",
    question: "What time does the Community Hall close, and what facilities does it have?",
    answerCheck: textIncludes(["8", "electric", "table"]),
    correctDisplay: "Closes 8 p.m. — electricity & tables provided",
  },
];

// ---------------------------------------------------------------------------
// Virtual partner scripted dialogue (SOLO MODE)
// NOTE: this is a fixed, pre-written branching script — NOT an AI / generative
// conversation partner. All lines are authored in advance.
// ---------------------------------------------------------------------------
export interface PartnerLine {
  id: string;
  speaker: "partner";
  text: string;
}

export interface PartnerOption {
  id: string;
  text: string;
  partnerReply: string;
}

export const SOLO_INFO_ANSWERS: Record<string, string> = {
  costA: "The Studio Café costs £160.",
  costB: "The Park Pavilion costs £90.",
  costC: "The Community Hall costs £220.",
  capA: "The Studio Café holds 24 people — not very big.",
  closeB: "The Park Pavilion closes at 8 p.m., but it has no electricity.",
  closeC: "The Community Hall closes at 8 p.m. and it has electricity and tables.",
};

export const PARTNER_DECISION_OPENERS = [
  "Honestly, I'd rather go somewhere everyone can actually fit — what do you think?",
  "I like the idea of saving money, but I'm a bit worried about the weather and the roof situation.",
  "I think we should think about the guest who needs step-free access before anything else.",
  "My main worry is the budget. We really shouldn't go over £200 without a good reason.",
];

export const PARTNER_CONCERNS = [
  "Wait — what happens if it rains? One of these places doesn't even have a roof.",
  "Hold on, are we sure everyone can actually get in without stairs?",
  "What time does it finish, though? We can't go past 8 p.m.",
  "Are we sure £200 is enough, or will we need to find more money?",
];

export const PARTNER_REACTIONS: Record<string, string[]> = {
  agree: [
    "Okay, I see your point — let's go with that.",
    "Fair enough, that does make sense.",
    "Yeah, I can live with that.",
  ],
  disagree: [
    "Hmm, I'm still not totally convinced, but let's hear the compromise.",
    "I get that, but I still think there's a problem we haven't solved.",
    "I'm not sure that solves everything, to be honest.",
  ],
  compromise: [
    "That actually sounds like a fair compromise — good thinking.",
    "Okay, that could work for both of us.",
    "That's a reasonable middle ground, yes.",
  ],
};

// ---------------------------------------------------------------------------
// STAGE 7 — Memory statements
// ---------------------------------------------------------------------------
export interface MemoryStatement {
  id: string;
  text: string;
  // function receives stored state snapshot and returns the factual truth value, or null if not objectively checkable
  check: (snap: MemorySnapshot) => boolean | null;
}

export interface MemorySnapshot {
  firstVenue: VenueId | null;
  currentVenue: VenueId | null;
  firstBudget: number | null;
  currentBudget: number | null;
  firstGuests: number | null;
  currentGuests: number | null;
  usedExtraMoney: boolean;
}

export const MEMORY_STATEMENTS: MemoryStatement[] = [
  {
    id: "m1",
    text: "We are still using the same venue as our very first plan.",
    check: (s) => (s.firstVenue && s.currentVenue ? s.firstVenue === s.currentVenue : null),
  },
  {
    id: "m2",
    text: "Our budget is still £200 or less.",
    check: (s) => (s.currentBudget !== null ? s.currentBudget <= 200 : null),
  },
  {
    id: "m3",
    text: "We are still expecting exactly 30 guests.",
    check: (s) => (s.currentGuests !== null ? s.currentGuests === 30 : null),
  },
  {
    id: "m4",
    text: "The weather problem no longer affects our plan (we are indoors).",
    check: (s) => (s.currentVenue ? VENUES[s.currentVenue].indoor : null),
  },
  {
    id: "m5",
    text: "We decided to use the extra £30.",
    check: () => null, // genuinely a matter of discussion / opinion, not auto-gradable
  },
];

// ---------------------------------------------------------------------------
// Activity ideas for final plan
// ---------------------------------------------------------------------------
export const ACTIVITY_IDEAS: string[] = [
  "Music playlist & dancing",
  "Board games / card games",
  "Food & drinks table",
  "Quiz or trivia competition",
  "Photo booth corner",
  "Outdoor games (if suitable)",
  "Talent show / open mic",
  "Group film screening",
];

// ---------------------------------------------------------------------------
// Rubric for Stage 8
// ---------------------------------------------------------------------------
export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
}

export const RUBRIC: RubricCriterion[] = [
  {
    id: "interaction",
    label: "Interaction & turn-taking",
    description: "Both students contributed, listened and responded to each other.",
  },
  {
    id: "relevance",
    label: "Relevance & development of ideas",
    description: "Ideas were relevant to the task and developed with reasons/examples.",
  },
  {
    id: "vocabulary",
    label: "B1 vocabulary & grammar",
    description: "Used appropriate vocabulary and reasonably accurate grammar for the level.",
  },
  {
    id: "responding",
    label: "Responding to new information",
    description: "Adapted the plan sensibly when new information/surprises appeared.",
  },
  {
    id: "negotiation",
    label: "Negotiation & compromise",
    description: "Negotiated respectfully and reached a genuine compromise.",
  },
];
