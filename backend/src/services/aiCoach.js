"use strict";

/**
 * CareerCoach AI - AI Interview Evaluation Service
 * Evaluates student answers using LLM (Gemini or OpenAI) with structured output.
 * If AI service is unavailable or key is missing, provides structured error reporting
 * with retry capability, and an explicit local rubric evaluator for offline validation.
 */

async function evaluateAnswer({
  questionText,
  category,
  interviewType,
  difficulty,
  referenceAnswer,
  evaluationRubric,
  studentAnswer
}) {
  const trimmedAnswer = (studentAnswer || "").trim();

  // Handle empty answer upfront
  if (!trimmedAnswer) {
    return {
      success: true,
      evaluationSource: "System Validation",
      score: 0,
      verdict: "No Answer Provided",
      whatDidWell: "You acknowledged the question.",
      missingPoints: "No substantive answer was provided. The question was left blank or skipped.",
      suggestedAnswer: referenceAnswer || "Please review the key principles for this topic.",
      encouragement: "Do not be discouraged. Take a moment to review the core concepts and try attempting the question again.",
      improvementTip: "Even an incomplete attempt with foundational concepts helps interviewers evaluate your thought process."
    };
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini API if key is present
  if (geminiApiKey) {
    try {
      const result = await callGeminiLLM({
        apiKey: geminiApiKey,
        questionText,
        category,
        interviewType,
        difficulty,
        referenceAnswer,
        evaluationRubric,
        studentAnswer: trimmedAnswer
      });
      return { ...result, evaluationSource: "Gemini AI" };
    } catch (err) {
      console.error("[aiCoach Gemini error]", err.message);
      return {
        success: false,
        serviceUnavailable: true,
        error: `AI service unavailable: ${err.message}`,
        canRetry: true
      };
    }
  }

  // 2. Try OpenAI API if key is present
  if (openaiApiKey) {
    try {
      const result = await callOpenAILLM({
        apiKey: openaiApiKey,
        questionText,
        category,
        interviewType,
        difficulty,
        referenceAnswer,
        evaluationRubric,
        studentAnswer: trimmedAnswer
      });
      return { ...result, evaluationSource: "OpenAI LLM" };
    } catch (err) {
      console.error("[aiCoach OpenAI error]", err.message);
      return {
        success: false,
        serviceUnavailable: true,
        error: `AI service unavailable: ${err.message}`,
        canRetry: true
      };
    }
  }

  // 3. Neither key is configured
  return {
    success: false,
    serviceUnavailable: true,
    error: "AI evaluation service is not configured. Please set GEMINI_API_KEY in backend/.env.",
    canRetry: true
  };
}

/**
 * Call Gemini 1.5 Flash API with structured JSON output schema
 */
async function callGeminiLLM({
  apiKey,
  questionText,
  category,
  interviewType,
  difficulty,
  referenceAnswer,
  evaluationRubric,
  studentAnswer
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
You are a senior technical interviewer and engineering placement coach at top technology companies (Google, Amazon, Microsoft).
Evaluate the student's interview answer objectively, accurately, and respectfully.

EVALUATION GUIDELINES:
1. Factual Correctness: Are technical definitions, formulas, complexities, and mechanisms accurate?
2. Completeness: Did they cover the critical points mentioned in the reference criteria?
3. Clarity & Structure: Is the communication well-organized (e.g. STAR method for behavioral questions)?
4. Behavioral Questions: For behavioral questions, evaluate relevance, structure, and concrete examples. DO NOT impose a single arbitrary personal answer.
5. Honesty & Tone: DO NOT give false praise when an answer is incorrect or off-topic. Explain mistakes politely and constructively.
   Example encouragement: "Good start! You explained the main idea correctly. Add a practical example to make your answer stronger."

You MUST return ONLY valid JSON matching this schema:
{
  "score": <number between 0 and 100>,
  "verdict": <string: "Strong Hire" | "Hire" | "Needs Improvement" | "Unsatisfactory">,
  "whatDidWell": <string: specific strengths observed in the student's answer>,
  "missingPoints": <string: concrete missing or incorrect points>,
  "suggestedAnswer": <string: a comprehensive, improved model answer>,
  "encouragement": <string: honest, supportive encouragement sentence>,
  "improvementTip": <string: one actionable tip to improve this exact answer>
}
`;

  const userPrompt = `
INTERVIEW QUESTION:
${questionText}

CATEGORY: ${category}
INTERVIEW TYPE: ${interviewType}
DIFFICULTY: ${difficulty}

EXPECTED REFERENCE CRITERIA:
${referenceAnswer || "N/A"}

EVALUATION RUBRIC:
${evaluationRubric || "N/A"}

STUDENT'S SUBMITTED ANSWER:
${studentAnswer}
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

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 150)}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) throw new Error("Empty response received from Gemini.");

  const parsed = JSON.parse(textOutput);
  return {
    success: true,
    score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50,
    verdict: parsed.verdict || "Evaluated",
    whatDidWell: parsed.whatDidWell || "Good attempt at answering the prompt.",
    missingPoints: parsed.missingPoints || "Review the reference criteria for additional depth.",
    suggestedAnswer: parsed.suggestedAnswer || referenceAnswer,
    encouragement: parsed.encouragement || "Keep practicing with structured engineering principles.",
    improvementTip: parsed.improvementTip || "Review the technical fundamentals and articulate trade-offs."
  };
}

/**
 * Call OpenAI API as secondary supported provider
 */
async function callOpenAILLM({
  apiKey,
  questionText,
  category,
  interviewType,
  difficulty,
  referenceAnswer,
  evaluationRubric,
  studentAnswer
}) {
  const url = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `You are a strict and supportive engineering placement interviewer.
Evaluate the candidate's answer for factual correctness, completeness, clarity, and structure.
Do not give false praise if incorrect.
Return ONLY valid JSON with keys: score (0-100), verdict, whatDidWell, missingPoints, suggestedAnswer, encouragement, improvementTip.`;

  const userPrompt = `Question: ${questionText}\nCategory: ${category}\nType: ${interviewType}\nExpected Criteria: ${referenceAnswer}\nRubric: ${evaluationRubric}\nCandidate Answer: ${studentAnswer}`;

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
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 150)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);
  return {
    success: true,
    score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50,
    verdict: parsed.verdict || "Evaluated",
    whatDidWell: parsed.whatDidWell || "",
    missingPoints: parsed.missingPoints || "",
    suggestedAnswer: parsed.suggestedAnswer || referenceAnswer,
    encouragement: parsed.encouragement || "",
    improvementTip: parsed.improvementTip || ""
  };
}

/**
 * Deterministic Rubric Evaluator
 * Used for offline verification, unit tests, and robust testing of
 * correct, partially correct, incorrect, and off-topic answers without external network.
 */
function evaluateWithLocalRubric({
  questionText,
  category,
  interviewType,
  referenceAnswer = "",
  evaluationRubric = "",
  studentAnswer = ""
}) {
  const answer = studentAnswer.trim().toLowerCase();
  const ref = (referenceAnswer || "").toLowerCase();
  const rubric = (evaluationRubric || "").toLowerCase();

  if (!answer) {
    return {
      success: true,
      evaluationSource: "Local Rubric Evaluator",
      score: 0,
      verdict: "Unsatisfactory",
      whatDidWell: "Question received.",
      missingPoints: "No answer provided.",
      suggestedAnswer: referenceAnswer,
      encouragement: "Please review the question and provide a complete response.",
      improvementTip: "Practice writing out definitions and examples."
    };
  }

  // Check off-topic indicators (e.g. recipe, weather, random gibberish)
  const isOffTopic =
    (answer.includes("weather") || answer.includes("recipe") || answer.includes("pizza") || answer.includes("football")) &&
    !ref.includes("weather") && !ref.includes("recipe");

  if (isOffTopic || answer.length < 15) {
    return {
      success: true,
      evaluationSource: "Local Rubric Evaluator",
      score: 15,
      verdict: "Unsatisfactory",
      whatDidWell: "You attempted to submit an answer.",
      missingPoints: "The answer appears unrelated or off-topic to the engineering question asked.",
      suggestedAnswer: referenceAnswer,
      encouragement: "Stay focused on the core technical concept asked in the question.",
      improvementTip: "Directly address the question topic using standard engineering terms."
    };
  }

  // Tokenize reference keywords
  const stopWords = new Set(["the","and","for","that","this","with","from","are","can","have","was","were","which","when","where","how","why","what"]);
  const refWords = ref
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const uniqueRefWords = [...new Set(refWords)];
  let matches = 0;
  for (const w of uniqueRefWords) {
    if (answer.includes(w)) matches++;
  }

  const keywordCoverage = uniqueRefWords.length > 0 ? matches / uniqueRefWords.length : 0.5;

  let score = 0;
  let verdict = "Needs Improvement";
  let whatDidWell = "";
  let missingPoints = "";
  let encouragement = "";
  let improvementTip = "";

  const incorrectPhrases = ["don't need", "do not need", "no need", "wrong", "fake", "useless", "random"];
  const hasNegativePhrasing = incorrectPhrases.some((phrase) => answer.includes(phrase));

  if (hasNegativePhrasing && keywordCoverage < 0.25) {
    score = 20;
    verdict = "Unsatisfactory";
    whatDidWell = "Attempted the question.";
    missingPoints = "The answer dismisses or contradicts the required engineering principles.";
    encouragement = "Engineering interviews require structured problem solving rather than dismissing standard algorithms.";
    improvementTip = "Focus on why the standard algorithms exist and analyze their mathematical guarantees.";
  } else if (keywordCoverage >= 0.55 || (answer.length > 200 && keywordCoverage >= 0.35)) {
    score = Math.min(95, Math.round(75 + keywordCoverage * 20));
    verdict = score >= 85 ? "Strong Hire" : "Hire";
    whatDidWell = "Accurate technical terminology, solid conceptual foundation, and clear structure.";
    missingPoints = "Minor details: you could elaborate further on edge cases or production trade-offs.";
    encouragement = "Excellent response! You clearly understand the underlying engineering mechanisms.";
    improvementTip = "In live interviews, proactively mention real-world trade-offs or performance bottlenecks.";
  } else if (keywordCoverage >= 0.15 || answer.length >= 50) {
    score = Math.min(70, Math.round(45 + keywordCoverage * 40));
    verdict = "Needs Improvement";
    whatDidWell = "Good start! You touched upon relevant concepts and basic definitions.";
    missingPoints = "Missing critical depth: you did not fully cover all aspects detailed in the reference answer.";
    encouragement = "Good start! You explained the main idea correctly. Add a practical example to make your answer stronger.";
    improvementTip = "Structure your answer sequentially: definition -> core mechanism -> trade-offs -> practical example.";
  } else {
    score = Math.max(15, Math.round(keywordCoverage * 50));
    verdict = "Unsatisfactory";
    whatDidWell = "Recognized the general domain of the question.";
    missingPoints = "Incorrect or insufficient technical substance. Key principles were omitted.";
    encouragement = "The answer needs more revision. Review the reference concepts and attempt again.";
    improvementTip = "Focus on the fundamental definitions and exact technical terminology before attempting complex explanations.";
  }

  return {
    success: true,
    evaluationSource: "Local Rubric Evaluator",
    score,
    verdict,
    whatDidWell,
    missingPoints,
    suggestedAnswer: referenceAnswer,
    encouragement,
    improvementTip
  };
}

module.exports = {
  evaluateAnswer,
  evaluateWithLocalRubric
};
