// slopSniffer.js

// Split on sentence-ending punctuation + optional whitespace + capital letter, or newlines
const SENTENCE_SPLIT_REGEX = /(?<=[.:!?•…])\s*(?=[A-Z"'])|\n+/;

const emDash = '—';

const otherDashes = [
  '-', // hyphen-minus
  '‐', // hyphen
  '‑', // non-breaking hyphen
  '‒', // figure dash
  '–', // en dash
  '―', // horizontal bar
  '−'  // minus sign
];

const dashRegex = new RegExp(`(\\s[${otherDashes.join('')}](?=\\s)|${emDash}|\\s--(?=\\s))`);

const apostrophe = "['’]";

const negations = [
  `\\bit${apostrophe}s not\\b`,
  `\\cannot\\b`,
  `\\bcan${apostrophe}t\\b`,
  `\\bwon${apostrophe}t\\b`,
  `\\bdoesn${apostrophe}t\\b`,
  `\\bdidn${apostrophe}t\\b`,
  `\\bhasn${apostrophe}t\\b`,
  `\\bhaven${apostrophe}t\\b`,
  `\\bhadn${apostrophe}t\\b`,
  `\\baren${apostrophe}t\\b`,
  `\\bisn${apostrophe}t\\b`,
  `\\bwasn${apostrophe}t\\b`,
  `\\bweren${apostrophe}t\\b`,
  `\\bshouldn${apostrophe}t\\b`,
  `\\bcouldn${apostrophe}t\\b`,
  `\\bwouldn${apostrophe}t\\b`,
  `\\bmustn${apostrophe}t\\b`,
  `\\bneedn${apostrophe}t\\b`,
  `\\bain${apostrophe}t\\b`
];

const negationRegex = new RegExp(negations.join('|'), 'i');

function splitSentences(text) {
  return text.trim().split(SENTENCE_SPLIT_REGEX);
}

// Heuristic 1: Contrast Framing w/ Dash
function sniffContrastFramingInline(text) {
  if (!dashRegex.test(text)) return { detected: false };

  const sentences = splitSentences(text);
  const offenders = sentences.filter((sentence) => dashRegex.test(sentence))
    .map((sentence) => sentence.split(dashRegex)[0].trim());

  const isDetected = offenders.some((s) => negationRegex.test(s));

  return {
    detected: isDetected,
    reason: isDetected ? "Contrast Framing (Inline)" : null,
    heuristic: "contrast_framing_inline"
  };
}

// Heuristic 2: Contrast Framing across sentences
function sniffContrastFramingSequential(text) {
  const sentences = text
    .trim()
    .split(SENTENCE_SPLIT_REGEX)
    .map(s => s.trim())
    .map(s => s.replace(/["“”]/g, ''))
    .filter(Boolean);

  const startsWithPhrase = (sentence, phrase) => {
    const escapedPhrase = phrase.replace(/'/g, "['’]");
    return new RegExp(`^${escapedPhrase}`, 'i').test(sentence);
  };

  for (let i = 0; i < sentences.length - 1; i++) {
    const first = sentences[i];
    const second = sentences[i + 1];

    if (startsWithPhrase(first, 'Not because ') && startsWithPhrase(second, 'Because ')) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (startsWithPhrase(first, 'Not because ') && startsWithPhrase(second, 'But because ')) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (
      startsWithPhrase(first, 'Sometimes ') &&
      negationRegex.test(first) &&
      startsWithPhrase(second, "It's")
    ) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (startsWithPhrase(first, "This isn't") && startsWithPhrase(second, "It's")) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (negationRegex.test(first) && startsWithPhrase(second, "It's")) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (negationRegex.test(first) && startsWithPhrase(second, "It was")) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (startsWithPhrase(first, "I'm not ") && startsWithPhrase(second, "I'm ")) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }

    if (startsWithPhrase(first, "You're not ") && startsWithPhrase(second, "You're ")) {
      return { detected: true, reason: "Contrast Framing (Sequential)", heuristic: "contrast_framing_sequential" };
    }
  }

  return { detected: false };
}

// Heuristic 3: Negative Tricolon
function sniffNegativeTricolon(text) {
  const negationCount = (text.match(/\b(?:No|Not)\b/gi) || []).length;
  if (negationCount < 2) {
    return { detected: false };
  }

  const sentences = text
    .trim()
    .split(SENTENCE_SPLIT_REGEX)
    .map(s => s.trim())
    .filter(Boolean);

  const startsWithWord = (sentence, word) =>
    new RegExp(`^${word}`, 'i').test(sentence);

  for (let i = 0; i <= sentences.length - 3; i++) {
    const first = sentences[i];
    const second = sentences[i + 1];
    const third = sentences[i + 2];

    let negWord = null;
    if (startsWithWord(first, 'No ') && startsWithWord(second, 'No ')) {
      negWord = 'No ';
    } else if (startsWithWord(first, 'Not ') && startsWithWord(second, 'Not ')) {
      negWord = 'Not ';
    }

    if (negWord) {
      if (startsWithWord(third, negWord)) {
        return { detected: true, reason: "Negative Tricolon", heuristic: "negative_tricolon" };
      }
      if (startsWithWord(third, 'Just ')) {
        return { detected: true, reason: "Negative Tricolon", heuristic: "negative_tricolon" };
      }
      continue;
    }

    if (
      startsWithWord(first, 'Not for ') &&
      startsWithWord(second, 'Not for ') &&
      startsWithWord(third, 'For ')
    ) {
      return { detected: true, reason: "Negative Tricolon", heuristic: "negative_tricolon" };
    }
  }

  return { detected: false };
}

function sniff(text) {
  const heuristics = [
    sniffContrastFramingInline,
    sniffContrastFramingSequential,
    sniffNegativeTricolon
  ];

  for (const heuristic of heuristics) {
    const result = heuristic(text);
    if (result.detected) {
      return result;
    }
  }

  return { detected: false };
}

module.exports = {
  sniff,
  sniffContrastFramingInline,
  sniffContrastFramingSequential,
  sniffNegativeTricolon
};
