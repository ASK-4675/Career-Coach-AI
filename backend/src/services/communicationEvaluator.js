"use strict";

/**
 * CareerCoach AI - Phase 5 Communication Skills Evaluator
 * Evaluates typed text on:
 * - Grammar & Syntax
 * - Clarity & Flow
 * - Vocabulary Precision
 * - Relevance to Activity
 * - Conciseness
 * - Organization
 * - Professional Tone
 *
 * Provides Ground-Truth text metrics (word count, delivery time @ 130 wpm, vocabulary diversity).
 * Does NOT pretend to measure voice pronunciation or pitch from typed text.
 */

function calculateTextMetrics(text) {
  const clean = (text || "").trim();
  if (!clean) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      estimatedDeliverySeconds: 0,
      vocabularyRichnessPct: 0
    };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Split on sentence terminators (. ! ?)
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  // Estimated delivery time at standard conversational pace of 130 words per minute
  const estimatedDeliverySeconds = Math.round((wordCount / 130) * 60);

  // Vocabulary richness: unique words / total words
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")));
  const vocabularyRichnessPct = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 0;

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    estimatedDeliverySeconds,
    vocabularyRichnessPct
  };
}

async function evaluateCommunication({
  activityId,
  activityTitle,
  promptText,
  guidelines = [],
  userResponse = ""
}) {
  const metrics = calculateTextMetrics(userResponse);
  const trimmed = userResponse.trim();

  if (!trimmed) {
    return {
      success: true,
      evaluationSource: "System Validation",
      score: 0,
      scores: {
        grammar: 0,
        clarity: 0,
        vocabulary: 0,
        tone: 0,
        conciseness: 0
      },
      metrics,
      strengths: "No submission recorded yet.",
      improvements: "Please enter your response to receive structured communication assessment.",
      revisedVersion: "Take a look at the guidelines above to structure your draft.",
      revisionRationale: "Drafting an initial version allows the coach to identify specific phrasing to elevate.",
      followUpExercise: "Write a short 2-3 sentence introduction to begin.",
      encouragement: "Everyone starts with a blank page. Take your time and draft your initial thoughts."
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const result = await callGeminiCommunication({
        apiKey: geminiKey,
        activityId,
        activityTitle,
        promptText,
        guidelines,
        userResponse: trimmed,
        metrics
      });
      return { ...result, metrics, evaluationSource: "Gemini AI" };
    } catch (err) {
      console.error("[communication Gemini error]", err.message);
      return {
        success: false,
        serviceUnavailable: true,
        error: `AI evaluation service unavailable: ${err.message}`,
        canRetry: true
      };
    }
  }

  if (openaiKey) {
    try {
      const result = await callOpenAICommunication({
        apiKey: openaiKey,
        activityId,
        activityTitle,
        promptText,
        guidelines,
        userResponse: trimmed,
        metrics
      });
      return { ...result, metrics, evaluationSource: "OpenAI LLM" };
    } catch (err) {
      console.error("[communication OpenAI error]", err.message);
      return {
        success: false,
        serviceUnavailable: true,
        error: `AI evaluation service unavailable: ${err.message}`,
        canRetry: true
      };
    }
  }

  // If no API key is configured in backend environment
  return {
    success: false,
    serviceUnavailable: true,
    error: "AI evaluation service is not configured. Please set GEMINI_API_KEY in backend/.env.",
    canRetry: true
  };
}

async function callGeminiCommunication({
  apiKey,
  activityTitle,
  promptText,
  guidelines,
  userResponse,
  metrics
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
You are a senior executive communication coach and engineering placement mentor.
Evaluate the student's written response for the activity: "${activityTitle}".

CRITERIA TO EVALUATE:
1. Grammar & Syntax: Grammatical precision, subject-verb agreement, punctuation.
2. Clarity & Flow: Logical progression of thoughts, transitions between ideas.
3. Vocabulary Precision: Professional engineering vocabulary, avoiding vague filler words.
4. Relevance & Organization: Directly addresses prompt instructions and structure.
5. Conciseness: Economy of language, avoidance of unnecessary repetition.
6. Professional Tone: Composed, confident, respectful, and appropriate for corporate engineering settings.

CRITICAL CONSTRAINTS:
- Report only measurements derived from text (word count, structure, vocabulary richness).
- Do NOT claim to measure speech pronunciation, pitch, volume, or acoustic speed from typed text.
- Provide a corrected or improved version of the student's text.
- Explicitly explain WHY the revised version is better.
- Provide a small, practical follow-up exercise.
- Use evidence-based encouragement. Treat mistakes as growth opportunities without shaming.

Return ONLY a valid JSON object matching this schema:
{
  "score": <overall number 0-100>,
  "scores": {
    "grammar": <number 0-100>,
    "clarity": <number 0-100>,
    "vocabulary": <number 0-100>,
    "tone": <number 0-100>,
    "conciseness": <number 0-100>
  },
  "strengths": <string: highlight specific strong phrases and well-structured elements>,
  "improvements": <string: constructive feedback on grammar, word choice, or structure>,
  "revisedVersion": <string: polished, high-impact version of the student's text>,
  "revisionRationale": <string: detailed explanation of why the revisions enhance impact and professional clarity>,
  "followUpExercise": <string: a practical micro-exercise to cement this skill>,
  "encouragement": <string: supportive, evidence-based motivational message>
}
`;

  const userPrompt = `
ACTIVITY: ${activityTitle}
PROMPT: ${promptText}
GUIDELINES:
${guidelines.map((g) => `- ${g}`).join("\n")}

STUDENT'S SUBMITTED RESPONSE:
${userResponse}

TEXT METRICS:
Word Count: ${metrics.wordCount}
Sentence Count: ${metrics.sentenceCount}
Estimated Delivery Time @ 130 wpm: ${metrics.estimatedDeliverySeconds}s
Vocabulary Richness: ${metrics.vocabularyRichnessPct}%
`;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemInstruction },
          { text: userPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText.slice(0, 150)}`);
  }

  const data = await res.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) throw new Error("Empty response received from Gemini.");

  const parsed = JSON.parse(textOutput);
  return {
    success: true,
    score: typeof parsed.score === "number" ? parsed.score : 70,
    scores: {
      grammar: parsed.scores?.grammar || 75,
      clarity: parsed.scores?.clarity || 75,
      vocabulary: parsed.scores?.vocabulary || 70,
      tone: parsed.scores?.tone || 80,
      conciseness: parsed.scores?.conciseness || 75
    },
    strengths: parsed.strengths || "Addressed the prompt directly.",
    improvements: parsed.improvements || "Review word choice for tighter conciseness.",
    revisedVersion: parsed.revisedVersion || userResponse,
    revisionRationale: parsed.revisionRationale || "The revision clarifies intent and strengthens action verbs.",
    followUpExercise: parsed.followUpExercise || "Try re-reading the revised version aloud.",
    encouragement: parsed.encouragement || "Great progress! Your communication improves with every deliberate revision."
  };
}

async function callOpenAICommunication({
  apiKey,
  activityTitle,
  promptText,
  guidelines,
  userResponse,
  metrics
}) {
  const url = "https://api.openai.com/v1/chat/completions";

  const systemInstruction = `You are a corporate communication coach for engineering students.
Evaluate the student's text for grammar, clarity, vocabulary, tone, conciseness, and organization.
Return ONLY valid JSON matching: score (0-100), scores: {grammar, clarity, vocabulary, tone, conciseness}, strengths, improvements, revisedVersion, revisionRationale, followUpExercise, encouragement.`;

  const userPrompt = `Activity: ${activityTitle}\nPrompt: ${promptText}\nGuidelines: ${guidelines.join("; ")}\nCandidate Text: ${userResponse}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorText.slice(0, 150)}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return {
    success: true,
    score: parsed.score || 70,
    scores: parsed.scores || { grammar: 75, clarity: 75, vocabulary: 70, tone: 80, conciseness: 75 },
    strengths: parsed.strengths || "",
    improvements: parsed.improvements || "",
    revisedVersion: parsed.revisedVersion || userResponse,
    revisionRationale: parsed.revisionRationale || "",
    followUpExercise: parsed.followUpExercise || "",
    encouragement: parsed.encouragement || ""
  };
}

/**
 * Deterministic Linguistic Rubric Evaluator
 * Used for offline verification, automated test suites, and robust fallback.
 * Analyzes word patterns, sentence structures, informal markers, and grammar flags.
 */
function evaluateCommunicationWithLocalRubric({
  activityId,
  activityTitle,
  promptText,
  guidelines = [],
  userResponse = ""
}) {
  const text = (userResponse || "").trim();
  const metrics = calculateTextMetrics(text);

  if (!text) {
    return {
      success: true,
      evaluationSource: "Local Linguistic Evaluator",
      score: 0,
      scores: { grammar: 0, clarity: 0, vocabulary: 0, tone: 0, conciseness: 0 },
      metrics,
      strengths: "No submission recorded.",
      improvements: "Write a complete response matching the activity instructions.",
      revisedVersion: "Please review the prompt instructions to create your initial draft.",
      revisionRationale: "A complete submission is needed to analyze sentence construction.",
      followUpExercise: "Draft a 2-3 sentence outline of your key points.",
      encouragement: "Take your time. Crafting your response step-by-step builds clarity."
    };
  }

  const lower = text.toLowerCase();

  // Linguistic Checks
  const informalWords = ["gonna", "wanna", "kinda", "stuff", "lots of", "dunno", "yeah", "cool", "super fast"];
  let informalCount = 0;
  for (const iw of informalWords) {
    if (lower.includes(iw)) informalCount++;
  }

  // Grammar markers (e.g. "I done", "me and my", "we was")
  const commonErrors = ["i done", "me and my", "we was", "they was", "alot", "should of", "could of"];
  let grammarErrors = 0;
  for (const ge of commonErrors) {
    if (lower.includes(ge)) grammarErrors++;
  }

  // Professional action verbs
  const strongVerbs = ["engineered", "orchestrated", "spearheaded", "developed", "architected", "optimized", "analyzed", "facilitated", "implemented", "resolved", "prioritized"];
  let strongVerbCount = 0;
  for (const sv of strongVerbs) {
    if (lower.includes(sv)) strongVerbCount++;
  }

  // Base score calculations
  let grammarScore = Math.max(30, 95 - grammarErrors * 25);
  let toneScore = Math.max(35, 90 - informalCount * 18);
  let vocabScore = Math.min(95, Math.max(40, 60 + strongVerbCount * 8 + Math.round(metrics.vocabularyRichnessPct * 0.2)));

  // Conciseness evaluation based on activity requirements
  let concisenessScore = 80;
  if (activityId === "concise_answer") {
    if (metrics.wordCount <= 60 && metrics.sentenceCount <= 3) {
      concisenessScore = 95;
    } else {
      concisenessScore = Math.max(40, 90 - (metrics.wordCount - 60) * 2);
    }
  } else if (metrics.avgWordsPerSentence > 28) {
    concisenessScore = 65; // Run-on sentences
  } else if (metrics.avgWordsPerSentence >= 12 && metrics.avgWordsPerSentence <= 22) {
    concisenessScore = 90; // Optimal sentence length
  }

  // Clarity
  let clarityScore = Math.round((grammarScore * 0.4 + toneScore * 0.3 + concisenessScore * 0.3));

  // Overall aggregate
  const overallScore = Math.round(
    grammarScore * 0.25 +
    clarityScore * 0.25 +
    vocabScore * 0.20 +
    toneScore * 0.15 +
    concisenessScore * 0.15
  );

  // Dynamic feedback elements
  let strengths = "";
  if (strongVerbCount > 0) {
    strengths = `Effective use of decisive action verbs and clear technical grounding. Sentence pacing averages ${metrics.avgWordsPerSentence} words per sentence, creating an organized cadence.`;
  } else if (metrics.wordCount >= 50) {
    strengths = `Solid elaboration with structured paragraph progression. You maintained consistent focus on the prompt.`;
  } else {
    strengths = `You directly addressed the core question prompt without extraneous preamble.`;
  }

  let improvements = "";
  if (grammarErrors > 0) {
    improvements = `Replace colloquial grammar patterns (e.g. 'me and my team' -> 'my team and I') with standard formal constructions.`;
  } else if (informalCount > 0) {
    improvements = `Elevate informal expressions ('lots of', 'stuff') to professional technical terms ('several modules', 'architectural components').`;
  } else if (metrics.avgWordsPerSentence > 26) {
    improvements = `Consider breaking complex compound sentences into shorter, punchy independent clauses to improve readability.`;
  } else {
    improvements = `Incorporate more specific quantitative metrics or domain-specific impact numbers to substantiate your claims.`;
  }

  // Revised version generation: replace informal words and refine phrasing
  let revised = text
    .replace(/\bme and my\b/gi, "my team and I")
    .replace(/\bi done\b/gi, "I developed")
    .replace(/\blots of\b/gi, "extensive")
    .replace(/\bvery fast\b/gi, "highly performant")
    .replace(/\bgonna\b/gi, "going to")
    .replace(/\bwanna\b/gi, "want to");

  if (!revised.endsWith(".")) revised += ".";

  const revisionRationale =
    "The revised version elevates the syntactic precision by substituting conversational idioms with precise industry terminology, enhancing the professional composure and authority of your response.";

  const followUpExercise =
    `Practice delivering your revised response aloud in approximately ${metrics.estimatedDeliverySeconds || 30} seconds to internalize the natural verbal pacing.`;

  const encouragement =
    overallScore >= 75
      ? "Strong articulation! Your communication conveys professional competence and clarity."
      : "Good foundational start! Refining these sentence structures will make your communication stand out in competitive campus rounds.";

  return {
    success: true,
    evaluationSource: "Local Linguistic Evaluator",
    score: overallScore,
    scores: {
      grammar: grammarScore,
      clarity: clarityScore,
      vocabulary: vocabScore,
      tone: toneScore,
      conciseness: concisenessScore
    },
    metrics,
    strengths,
    improvements,
    revisedVersion: revised,
    revisionRationale,
    followUpExercise,
    encouragement
  };
}

module.exports = {
  calculateTextMetrics,
  evaluateCommunication,
  evaluateCommunicationWithLocalRubric
};
