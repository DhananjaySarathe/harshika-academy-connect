// -----------------------------------------------------------------------------
// Harshika Academy — all editable site content lives here.
//
// This is the only file the academy needs to edit for day-to-day changes:
// phone numbers, stats, courses, results, gallery photos and FAQs.
// The section components read from here and never hardcode copy.
// -----------------------------------------------------------------------------

export const phoneDisplay = "+91 91711 64151";
export const phoneE164 = "+919171164151";
export const phoneHref = `tel:${phoneE164}`;

export const whatsappUrl =
  "https://wa.me/919171164151?text=Hi%2C%20I%20want%20to%20know%20about%20admission%20at%20Harshika%20Academy";

export type SocialLink = { label: string; href: string };

export const academy = {
  name: "Harshika Academy",
  tagline: "Building Knowledge. Shaping Futures.",
  strapline: "Quality Education · Strong Foundation · Bright Future",
  city: "Bhairunda",
  phone: phoneDisplay,
  phoneE164,
  phoneHref,
  email: "harshikaacademy@gmail.com",
  addressLine: "Neelkanth Road, Ward No. 10",
  /** Locals navigate by the college, not the road name. */
  landmark: "Near SVN Govt. College",
  locality: "Bhairunda",
  district: "Sehore",
  region: "Madhya Pradesh",
  postalCode: "466331",
  country: "IN",
  timings: "Monday – Saturday · 8:00 AM – 7:00 PM",
  openingHours: "Mo-Sa 08:00-19:00",
  /**
   * Real profiles only — these feed the footer, the contact block and the
   * `sameAs` array in the JSON-LD, where a placeholder link is worse than
   * no link at all. Add Instagram and Facebook here once the handles exist.
   */
  social: [
    { label: "YouTube", href: "https://www.youtube.com/@studywithharshi" },
  ] satisfies SocialLink[],
};

/** Full postal address on one line — used in the footer, contact row and schema. */
export const fullAddress = `${academy.addressLine}, ${academy.landmark}, ${academy.locality}, Dist. ${academy.district}, ${academy.region} ${academy.postalCode}`;

/**
 * Surveyed coordinates, not a geocode of the address string. Bhairunda has few
 * mapped street names, so searching the address drops the pin in the wrong part
 * of town; the lat/long puts it on the building.
 */
export const geo = { latitude: 22.68059, longitude: 77.27266 };

export const mapEmbedUrl = `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}&z=16&output=embed`;
export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${geo.latitude},${geo.longitude}`;

// -- Navigation ---------------------------------------------------------------

export type NavItem = { label: string; id: string };

export const navItems: NavItem[] = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Courses", id: "courses" },
  { label: "Faculty", id: "faculty" },
  { label: "Results", id: "results" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact", id: "contact" },
];

// -- Hero ---------------------------------------------------------------------

export const hero = {
  eyebrow: "Nursery to Class 10 · CBSE & MP Board",
  /**
   * The header already carries the wordmark, so the h1 sells the teaching
   * rather than repeating the brand name. Split so the second half can take
   * the gold treatment.
   */
  headline: { lead: "Concepts that", accent: "actually click" },
  subline: "Taught by Mohit Sarathe — CTET-qualified, in small batches.",
  bullets: [
    "Small batches, so every student gets attention",
    "Concepts explained until they actually click",
    "Regular tests, honest feedback to parents",
  ],
};

// -- Trust strip --------------------------------------------------------------

export type Stat = {
  /** Target number for the count-up. */
  value: number;
  suffix: string;
  label: string;
  /** Set this to show fixed text instead of a counting number. */
  display?: string;
};

export const stats: Stat[] = [
  { value: 1000, suffix: "+", label: "Students Taught" },
  { value: 6, suffix: "", label: "Years of Teaching" },
  { value: 0, suffix: "", label: "CTET Qualified Faculty", display: "CTET" },
  { value: 0, suffix: "", label: "Classes Covered", display: "Nur–10" },
];

// -- About --------------------------------------------------------------------

export type PillarIcon = "guidance" | "clarity" | "results";
export type Pillar = { icon: PillarIcon; title: string; text: string };

export const about = {
  paragraphs: [
    "Harshika Academy teaches every class from Nursery to Class 10, across CBSE and MP Board, with a dedicated batch for children preparing for the Navodaya entrance. Classes are taken by Mohit Sarathe, who is CTET qualified.",
    "We believe a strong foundation matters more than a good report card. A student who understands why a method works will handle a question they have never seen before. A student who only memorised the steps will not.",
    "So we keep batches small, teach every topic from the basics up, and tell parents the truth about where their child stands — every week, not just before the exams.",
  ],
};

export const pillars: Pillar[] = [
  {
    icon: "guidance",
    title: "Expert Guidance",
    text: "Taught by a CTET-qualified teacher with formal training in education, not part-time tutors.",
  },
  {
    icon: "clarity",
    title: "Concept Clarity",
    text: "Every topic is taught from the basics up, with doubt-clearing built into each class.",
  },
  {
    icon: "results",
    title: "Result Oriented",
    text: "Weekly tests, tracked progress, and a clear picture shared with parents.",
  },
];

export const aboutImages = {
  classroom: {
    src: "/assets/classroom-wide.webp",
    alt: "A morning batch at Harshika Academy, students seated at low desks with the whiteboard behind them",
  },
  student: {
    src: "/assets/classroom-desks.webp",
    alt: "Students working through written practice at their desks beside the classroom window",
  },
};

// -- Courses ------------------------------------------------------------------

export type SubjectIcon =
  "maths" | "science" | "english" | "social" | "physics" | "aptitude" | "reasoning";

export type Subject = {
  name: string;
  icon: SubjectIcon;
  description: string;
  timing: "Morning" | "Evening";
};

export type CourseTab = { id: string; label: string; subjects: Subject[] };

export const courseTabs: CourseTab[] = [
  {
    id: "nursery-class-5",
    label: "Nursery – Class 5",
    subjects: [
      {
        name: "Reading & Writing",
        icon: "english",
        description: "Letters, sounds and handwriting, at the child's own pace.",
        timing: "Morning",
      },
      {
        name: "Early Maths",
        icon: "maths",
        description: "Counting, tables, shapes and number sense before the tricks.",
        timing: "Morning",
      },
      {
        name: "EVS & General Awareness",
        icon: "science",
        description: "The world around them, explained in questions they already ask.",
        timing: "Evening",
      },
    ],
  },
  {
    id: "class-6-8",
    label: "Class 6 – Class 8",
    subjects: [
      {
        name: "Mathematics",
        icon: "maths",
        description: "Number sense, algebra basics, geometry and problem-solving.",
        timing: "Evening",
      },
      {
        name: "Science",
        icon: "science",
        description: "Living world, matter, energy and everyday experiments.",
        timing: "Morning",
      },
      {
        name: "English",
        icon: "english",
        description: "Grammar, reading and writing with confidence.",
        timing: "Evening",
      },
      {
        name: "Social Science",
        icon: "social",
        description: "History, civics and geography tied to things they know.",
        timing: "Morning",
      },
    ],
  },
  {
    id: "class-9-10",
    label: "Class 9 – Class 10",
    subjects: [
      {
        name: "Mathematics",
        icon: "maths",
        description: "Board-ready concepts, proofs and timed practice.",
        timing: "Evening",
      },
      {
        name: "Science",
        icon: "science",
        description: "Physics, Chemistry and Biology from first principles.",
        timing: "Morning",
      },
      {
        name: "Social Science",
        icon: "social",
        description: "History, civics, geography and economics made clear.",
        timing: "Evening",
      },
      {
        name: "English",
        icon: "english",
        description: "Comprehension, writing skills and board answer practice.",
        timing: "Morning",
      },
    ],
  },
  {
    id: "navodaya",
    label: "Navodaya Prep",
    subjects: [
      {
        name: "Mental Ability",
        icon: "reasoning",
        description: "Patterns, figures and odd-one-out, practised until they are quick.",
        timing: "Morning",
      },
      {
        name: "Arithmetic",
        icon: "maths",
        description: "The calculation speed the entrance paper actually demands.",
        timing: "Evening",
      },
      {
        name: "Language",
        icon: "english",
        description: "Passage reading and comprehension under exam timing.",
        timing: "Evening",
      },
    ],
  },
];

// -- Faculty ------------------------------------------------------------------

export type Teacher = {
  name: string;
  role: string;
  image: string;
  alt: string;
  qualifications: string[];
  badge: string;
  /** Written in the teacher's own voice. */
  note: string;
  quote: string;
};

export const faculty: Teacher[] = [
  {
    name: "Mohit Sarathe",
    role: "Faculty Head",
    image: "/assets/mohit-teaching.webp",
    alt: "Mohit Sarathe holding a piece of chalk in front of the classroom blackboard at Harshika Academy",
    qualifications: ["B.A.", "M.A.", "PGDCA", "D.El.Ed."],
    badge: "CTET Qualified",
    note: "I teach the way I wish I had been taught. One idea at a time, with an example from something the student already knows — a cricket score, a shop bill, a bus timing. If a child cannot explain it back to me in their own words, we have not finished the topic. I would rather cover less and have it stay.",
    quote: "A student who understands the 'why' never forgets the 'what'.",
  },
];

/**
 * The hero uses a composed portrait on the dark arc plate; the faculty card
 * further down uses the classroom shot. Two different images on purpose.
 */
export const heroPortrait = {
  src: "/assets/mohit-hero.webp",
  alt: "Mohit Sarathe, CTET-qualified faculty head at Harshika Academy",
};

// -- Admission ----------------------------------------------------------------

export type Step = { title: string; text: string };

export const admissionSteps: Step[] = [
  { title: "Message or call us", text: "Tell us your class and subjects." },
  { title: "Confirm your seat", text: "We share the timetable and you begin." },
];

// -- Results ------------------------------------------------------------------

export type ResultCard = {
  name: string;
  className: string;
  result: string;
  /** Context line under the score, e.g. which test it was. */
  note: string;
  initials: string;
};

/**
 * Real students, real marks, taken from the Navodaya Test 1 board.
 * Only the top scores are listed — publishing a child's low mark on a public
 * page is not something the academy needs to do.
 */
export const results: ResultCard[] = [
  {
    name: "Harsita Panwar",
    className: "Navodaya Batch",
    result: "85",
    note: "Navodaya Test 1",
    initials: "HP",
  },
  {
    name: "Apechha Pandey",
    className: "Navodaya Batch",
    result: "67.5",
    note: "Navodaya Test 1",
    initials: "AP",
  },
  {
    name: "Paridhi Sahu",
    className: "Navodaya Batch",
    result: "65",
    note: "Navodaya Test 1",
    initials: "PS",
  },
];

// -- Gallery ------------------------------------------------------------------

export const galleryCategories = ["All", "Classroom", "Events", "Achievements"] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

/** Ratios keep the masonry varied and reserve space so images don't shift the page. */
export type GalleryRatio = "tall" | "square" | "wide";

export type GalleryItem = {
  src: string;
  caption: string;
  category: Exclude<GalleryCategory, "All">;
  ratio: GalleryRatio;
};

export const galleryItems: GalleryItem[] = [
  {
    src: "/assets/classroom-wide.webp",
    caption: "A morning batch in session",
    category: "Classroom",
    ratio: "wide",
  },
  {
    src: "/assets/trophy-winners-banner.webp",
    caption: "Prize day under the academy banner",
    category: "Achievements",
    ratio: "tall",
  },
  {
    src: "/assets/report-cards.webp",
    caption: "Report cards, handed out together",
    category: "Achievements",
    ratio: "wide",
  },
  {
    src: "/assets/medalist-felicitation.webp",
    caption: "Felicitating a state-level medallist",
    category: "Achievements",
    ratio: "square",
  },
  {
    src: "/assets/classroom-desks.webp",
    caption: "Written practice by the window",
    category: "Classroom",
    ratio: "square",
  },
  {
    src: "/assets/prize-family.webp",
    caption: "Prize day at the academy",
    category: "Events",
    ratio: "tall",
  },
  {
    src: "/assets/students-peace.webp",
    caption: "After class, on the way home",
    category: "Classroom",
    ratio: "wide",
  },
  {
    src: "/assets/trophy-winners.webp",
    caption: "Trophies and a cake to go with them",
    category: "Achievements",
    ratio: "square",
  },
  {
    src: "/assets/guest-felicitation.webp",
    caption: "Welcoming a guest to the academy",
    category: "Events",
    ratio: "square",
  },
  {
    src: "/assets/new-year-group.webp",
    caption: "Ringing in the new year together",
    category: "Events",
    ratio: "wide",
  },
  {
    src: "/assets/classroom-desks-wide.webp",
    caption: "A quiet afternoon of practice",
    category: "Classroom",
    ratio: "wide",
  },
  {
    src: "/assets/senior-batch.webp",
    caption: "The senior batch outside the academy",
    category: "Events",
    ratio: "wide",
  },
  {
    src: "/assets/one-to-one-help.webp",
    caption: "One-to-one, when a topic needs it",
    category: "Classroom",
    ratio: "wide",
  },
  {
    src: "/assets/test-day.webp",
    caption: "A weekly test in progress",
    category: "Classroom",
    ratio: "wide",
  },
  {
    src: "/assets/navodaya-results.webp",
    caption: "Navodaya Test 1 results, up on the board",
    category: "Achievements",
    ratio: "wide",
  },
  {
    src: "/assets/navodaya-alumna.webp",
    caption: "Soniya Sahu, Navodaya batch of 2023, back for a session",
    category: "Achievements",
    ratio: "wide",
  },
  {
    src: "/assets/whole-academy.webp",
    caption: "The whole academy, one afternoon",
    category: "Events",
    ratio: "square",
  },
];

// -- FAQ ----------------------------------------------------------------------

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "How many students are there in one batch?",
    answer:
      "We keep batches small so students can ask questions and get individual attention. The exact number depends on the class and subject.",
  },
  {
    question: "What are the class timings?",
    answer:
      "Classes run Monday to Saturday between 8:00 AM and 7:00 PM. We share the current batch options when you contact us.",
  },
  {
    question: "Are there separate doubt-clearing sessions?",
    answer:
      "Doubt-clearing is part of every class. Extra time is also set aside when a student needs more practice on a topic.",
  },
  {
    question: "How often are tests conducted?",
    answer:
      "Students take a weekly test or topic check. Larger revision tests are planned before school examinations.",
  },
  {
    question: "How do parents receive progress updates?",
    answer:
      "We share honest feedback with parents regularly, including strengths, topics to revise and the next practice step.",
  },
];

// -- Enquiry form -------------------------------------------------------------

export const classOptions = courseTabs.map((tab) => tab.label);

// -- SEO ----------------------------------------------------------------------

export const seo = {
  title: `Harshika Academy — Coaching Classes in ${academy.city} | Mohit Sarathe`,
  description: `Concept-first coaching from Nursery to Class 10 in ${academy.city}, by CTET-qualified teacher Mohit Sarathe. Small batches, weekly tests and honest feedback to parents. Call or message to ask about admission.`,
};
