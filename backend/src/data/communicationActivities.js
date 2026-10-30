"use strict";

/**
 * CareerCoach AI - Phase 5 Communication Practice Activities
 * 10 Structured Engineering Placement Communication Modules
 */

const communicationActivities = [
  {
    id: "self_intro",
    number: 1,
    title: "Self-Introduction",
    category: "Interview Foundations",
    badge: "High Frequency",
    estimatedMinutes: 3,
    prompt: "Deliver a structured 60–90 second professional self-introduction suitable for a campus placement drive. Highlight your degree, engineering specialization, 1–2 key technical projects, and career aspiration.",
    guidelines: [
      "Open with your name, degree, and engineering institute.",
      "Highlight 1-2 major projects and the practical problem solved.",
      "Summarize your core tech stack and why this career track excites you.",
      "Keep between 90 and 160 words for ideal spoken delivery pacing."
    ],
    sampleDraft: "Hello, my name is Aarav Sharma. I am a final-year Computer Science Engineering student at NIT Trichy with a strong focus on full-stack web development and distributed systems. Over the past year, I built an automated campus recruitment portal using React, Node.js, and PostgreSQL that reduced application processing time by 40% across 500+ student applicants. I also completed an internship where I optimized REST API latency using Redis caching. I am eager to apply my problem-solving skills, engineering rigor, and passion for scalable web platforms to your software engineering team.",
    followUpExercise: "Now deliver a customized version that mentions one specific product or technology stack used by your dream employer."
  },
  {
    id: "tell_me_about_yourself",
    number: 2,
    title: "Tell Me About Yourself",
    category: "Interview Foundations",
    badge: "Core Opener",
    estimatedMinutes: 3,
    prompt: "Answer the common opener 'Tell me about yourself' by emphasizing your problem-solving identity, past technical journey, and what drives you as an engineer.",
    guidelines: [
      "Use the Present-Past-Future narrative framework.",
      "Avoid merely repeating your resume line-by-line.",
      "Convey intellectual curiosity, resilience, and adaptability.",
      "Target roughly 100-150 words."
    ],
    sampleDraft: "I see myself as a pragmatic engineer who loves turning complex system problems into clean, reliable software solutions. Currently, I am finishing my engineering degree while building full-stack applications and solving algorithmic problems daily on LeetCode. In my earlier academic years, I explored low-level programming with C++ and microcontrollers, which taught me the value of memory efficiency and clean architecture. Looking forward, I am seeking an engineering environment where I can collaborate with senior architects, contribute to mission-critical distributed services, and continuously elevate code quality.",
    followUpExercise: "Identify one personal engineering hobby or open-source curiosity that can be woven organically into your narrative."
  },
  {
    id: "explain_project",
    number: 3,
    title: "Explain Your Project",
    category: "Technical Storytelling",
    badge: "Technical Rounds",
    estimatedMinutes: 4,
    prompt: "Explain your most impactful engineering capstone or personal project to an interviewer. Structure your response clearly: Problem Statement, Technical Architecture & Stack, Engineering Challenges Faced, and Measured Impact.",
    guidelines: [
      "Clearly state what problem the project solved and for whom.",
      "Explain the architectural choices (why React over plain HTML, why SQL over NoSQL).",
      "Mention a specific technical obstacle or bug you resolved.",
      "Quantify your results with real numbers (latency, users, throughput)."
    ],
    sampleDraft: "For our engineering capstone, my team built 'MediTrack', a telemedicine appointment and triage platform designed for rural clinics with intermittent internet connectivity. We engineered an offline-first web client using React and IndexedDB, backed by an Express and PostgreSQL service. The key engineering challenge was data synchronization when re-establishing connectivity; concurrent updates caused race conditions. I designed a conflict-resolution protocol using monotonic version vectors and Redis queues, reducing sync failure rates from 18% to under 0.2%. The system successfully handled 1,200 simulated patient consultations in our benchmark tests.",
    followUpExercise: "Prepare an alternative version explaining this exact project in 3 sentences for an executive or HR manager who is non-technical."
  },
  {
    id: "strengths_weaknesses",
    number: 4,
    title: "Describe Strengths and Weaknesses",
    category: "Behavioral & Self-Awareness",
    badge: "HR Round",
    estimatedMinutes: 3,
    prompt: "Describe one genuine professional strength and one authentic area for growth (weakness). Explain the concrete systems or habits you have built to manage your weakness.",
    guidelines: [
      "Choose a strength with an illustrative example (e.g., debugging tenacity, documentation, fast learner).",
      "Avoid cliché non-weaknesses like 'I am a perfectionist' or 'I work too hard'.",
      "Pick a real technical or organizational growth area and show active remediation.",
      "Maintain a humble, self-aware, and growth-oriented tone."
    ],
    sampleDraft: "My greatest strength is systematic debugging and root-cause analysis. When systems fail under pressure, I stay calm and inspect logs, isolate variables, and write reproducible regression tests rather than guessing. On the other hand, an authentic growth area for me has been delegating tasks during group projects. In earlier semesters, I tended to take on extra code modules myself because I feared inconsistent styling. I realized this created bottlenecks and denied peers learning opportunities. Over the past year, I instituted automated linting, pre-commit hooks, and pair programming sessions, which helped me trust team code and delegate effectively.",
    followUpExercise: "Name a skill you are currently actively improving through deliberate daily practice this semester."
  },
  {
    id: "behavioral_star",
    number: 5,
    title: "Behavioral Interview Responses (STAR)",
    category: "Behavioral & Culture Fit",
    badge: "STAR Method",
    estimatedMinutes: 4,
    prompt: "Answer: 'Describe a high-pressure situation where a project deadline was at risk. How did you prioritize tasks and ensure delivery?' Follow the STAR method (Situation, Task, Action, Result).",
    guidelines: [
      "Situation: Set context, timeline, and stakes concisely.",
      "Task: Define your specific responsibility.",
      "Action: Detail the technical decisions, prioritization, and communication steps YOU personally took.",
      "Result: Share the measurable outcome and key lesson."
    ],
    sampleDraft: "During the final week of our semester hackathon, our external payment gateway API underwent an unannounced deprecation that broke our checkout flow with only 48 hours remaining. As team lead, my task was to deliver a functioning demonstration without missing the presentation deadline. I immediately convened a 15-minute triage meeting, deprioritized non-essential UI animations, and personally refactored our payment abstraction layer to mock the gateway using localized webhooks. We delivered the prototype on schedule, won 2nd place out of 40 teams, and learned the vital lesson of decoupling external third-party dependencies behind adapter interfaces.",
    followUpExercise: "Identify where you could replace vague adjectives like 'we worked hard' with specific nouns and actions."
  },
  {
    id: "group_discussion",
    number: 6,
    title: "Group Discussion Preparation",
    category: "Campus Drives",
    badge: "Elimination Round",
    estimatedMinutes: 4,
    prompt: "Provide an articulate opening or intervening perspective on the topic: 'Is AI going to replace entry-level software engineering jobs, or transform them?' Practice a balanced, collaborative, and evidence-supported viewpoint.",
    guidelines: [
      "Acknowledge multiple valid perspectives diplomatically.",
      "Introduce a structured taxonomy (e.g., repetitive syntax generation vs architectural reasoning).",
      "Invite collaborative discussion from other group members.",
      "Maintain professional debate etiquette without aggression."
    ],
    sampleDraft: "Good morning everyone. While the rise of generative coding assistants has certainly raised questions about entry-level software roles, I believe the transition is an evolution rather than replacement. Tools like GitHub Copilot automate boilerplate CRUD generation and syntax formatting, but they cannot perform architectural trade-off evaluations, understand nuanced domain constraints, or debug distributed failure states. The entry-level engineer of tomorrow will need higher-order systems thinking, prompt verification skills, and stronger security auditing earlier in their careers. I would love to hear how others view the implications for university curricula.",
    followUpExercise: "Formulate a polite, diplomatic intervention technique for when two participants in a group discussion interrupt each other."
  },
  {
    id: "email_writing",
    number: 7,
    title: "Professional Email Writing",
    category: "Business Communication",
    badge: "Workplace Skills",
    estimatedMinutes: 3,
    prompt: "Write a professional email to a corporate HR recruiter following up on an on-campus placement interview you completed 7 business days ago, requesting an update on next steps.",
    guidelines: [
      "Include a clear, descriptive Subject line with Candidate Name and Role.",
      "Use a professional salutation and state the purpose immediately in paragraph 1.",
      "Reiterate genuine interest and mention one specific topic discussed in the interview.",
      "Close with courteous appreciation and a professional signature block."
    ],
    sampleDraft: "Subject: Follow-up on Software Engineer Interview - Aarav Sharma (Ref: Campus Drive 2026)\n\nDear Ms. Kapoor,\n\nI hope you are having a productive week.\n\nI am writing to politely follow up on the status of my second-round technical interview for the Graduate Software Engineer position, which took place on October 22nd with your engineering team. I thoroughly enjoyed our technical discussion regarding microservice scalability and database indexing strategies.\n\nPlease let me know if there are any additional project artifacts or documentation I can provide to assist in your evaluation. I remain very enthusiastic about the opportunity to contribute to your engineering organization.\n\nThank you for your time and guidance.\n\nWarm regards,\nAarav Sharma\nB.Tech Computer Science, NIT Trichy\nPhone: +91-98765-43210\nLinkedIn: linkedin.com/in/aarav-sharma-cs",
    followUpExercise: "Draft a polite email declining an offer because you accepted another opportunity, preserving goodwill for the future."
  },
  {
    id: "tech_in_simple_terms",
    number: 8,
    title: "Explain a Technical Concept Simply",
    category: "Clarity & Empathy",
    badge: "Executive Presence",
    estimatedMinutes: 3,
    prompt: "Explain how 'Cloud Computing' or 'Application Programming Interfaces (APIs)' work to a non-technical person (e.g. a high school student or business recruiter) using an intuitive everyday analogy.",
    guidelines: [
      "Avoid ungrounded jargon (like virtual machines, endpoints, JSON, abstraction layers).",
      "Anchor the concept in a familiar analogy (restaurant menu, power grid, postal service).",
      "Connect the analogy back to the real-world business value.",
      "Keep it under 140 words."
    ],
    sampleDraft: "Imagine visiting a restaurant. You are the customer sitting at a table, and the kitchen is where the chefs prepare meals. You cannot walk directly into the kitchen to cook food yourself; instead, you read a menu and place an order through a waiter. The waiter carries your request to the kitchen and delivers the prepared dish back to your table. In software, an API is that waiter. When you check weather on your phone, your app does not maintain meteorological satellites; it sends a waiter (an API) to ask the weather bureau's computers for today's forecast, and the waiter brings the temperature back to your screen in milliseconds.",
    followUpExercise: "Now explain 'Database Indexing' using the analogy of an index at the back of a textbook."
  },
  {
    id: "grammar_vocab",
    number: 9,
    title: "Grammar and Vocabulary Precision",
    category: "Linguistic Precision",
    badge: "Professional Polish",
    estimatedMinutes: 3,
    prompt: "Rewrite the following informal, grammatically weak paragraph into polished, professional engineering prose: 'I done lots of coding in my project and we had so many bugs but me and my friends we somehow fixed it and made the speed very fast.'",
    guidelines: [
      "Correct grammatical errors ('done' -> 'have developed/implemented', 'me and my friends' -> 'my team and I').",
      "Replace vague phrases ('so many bugs', 'somehow fixed it') with precise terminology (identified edge-case anomalies, resolved concurrency bottlenecks).",
      "Upgrade vocabulary: replace 'speed very fast' with 'optimized latency', 'enhanced throughput', or 'improved performance'.",
      "Maintain active, professional voice."
    ],
    sampleDraft: "Throughout our project, my team and I implemented extensive architectural modules. Although we encountered several complex concurrency anomalies during initial integration testing, we systematically conducted root-cause analyses and resolved the underlying memory leaks. As a result of these optimizations, we significantly reduced average query latency and enhanced overall system throughput by 45%.",
    followUpExercise: "Identify 3 weak verbs in your technical resume (such as 'worked on', 'helped with', 'did') and replace them with strong action verbs (engineered, orchestrated, spearheaded)."
  },
  {
    id: "concise_answer",
    number: 10,
    title: "Concise Answer Practice",
    category: "Clarity & Empathy",
    badge: "Brevity Under Pressure",
    estimatedMinutes: 2,
    prompt: "Answer this question in EXACTLY 2 to 3 sentences (under 60 words): 'What is the primary benefit of using automated testing (Unit and Integration tests) in modern continuous deployment pipelines?'",
    guidelines: [
      "Strict brevity: maximum 3 sentences and under 60 words.",
      "Cut filler words and redundant pleasantries.",
      "State the primary value proposition directly in sentence 1.",
      "Provide the operational impact in sentence 2."
    ],
    sampleDraft: "Automated unit and integration testing establishes an immediate feedback loop that catches regression defects before code reaches production environments. By verifying functional correctness deterministically on every commit, engineering teams can release updates frequently with high confidence and minimal downtime.",
    followUpExercise: "Summarize your entire engineering degree's core specialty in one single punchy sentence."
  }
];

module.exports = { communicationActivities };
