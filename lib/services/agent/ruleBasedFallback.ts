/**
 * Rule-based intent fallback — works with ZERO API calls.
 * Used when all Gemini keys, Groq, and OpenRouter are exhausted.
 * Supports Hindi + Hinglish input for 12 farmer voice intents.
 */

export interface IntentResult {
  intent: string;
  params: Record<string, unknown>;
  confidence: number;
}

// ── Crop name mapping (Hindi/Hinglish → English) ──────────────────────────
const CROP_MAP: Record<string, string> = {
  // Romanized Hindi / Hinglish
  gehun: 'Wheat', gehu: 'Wheat', wheat: 'Wheat',
  pyaz: 'Onion', pyaaz: 'Onion', onion: 'Onion',
  tamatar: 'Tomato', tomato: 'Tomato',
  aalu: 'Potato', aalo: 'Potato', potato: 'Potato',
  chawal: 'Rice', rice: 'Rice', paddy: 'Rice', dhan: 'Rice',
  makka: 'Maize', maize: 'Maize', corn: 'Maize', bhutta: 'Maize',
  mirch: 'Chili', chili: 'Chili', chilli: 'Chili',
  sarson: 'Mustard', mustard: 'Mustard',
  jau: 'Barley', barley: 'Barley',
  soyabean: 'Soybean', soya: 'Soybean',
  kapas: 'Cotton', cotton: 'Cotton',
  ganna: 'Sugarcane', sugarcane: 'Sugarcane',
  haldi: 'Turmeric', turmeric: 'Turmeric',
  // Devanagari Hindi (from Web Speech API with lang='hi-IN')
  'गेहूं': 'Wheat', 'गेहू': 'Wheat', 'गेहुं': 'Wheat',
  'प्याज': 'Onion', 'प्याज़': 'Onion',
  'टमाटर': 'Tomato',
  'आलू': 'Potato',
  'चावल': 'Rice', 'धान': 'Rice',
  'मक्का': 'Maize', 'भुट्टा': 'Maize',
  'मिर्च': 'Chili', 'मिर्ची': 'Chili',
  'सरसों': 'Mustard',
  'जौ': 'Barley',
  'सोयाबीन': 'Soybean', 'कपास': 'Cotton', 'गन्ना': 'Sugarcane',
  'हल्दी': 'Turmeric',
};

// ── Hindi number words ─────────────────────────────────────────────────────
const HINDI_NUMBERS: Record<string, number> = {
  ek: 1, do: 2, teen: 3, char: 4, paanch: 5,
  chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  bees: 20, tees: 30, chalis: 40, pachas: 50,
  saath: 70, assi: 80, nabbe: 90,
  sau: 100, hazaar: 1000,
};

function parseNumber(text: string): number | null {
  // Convert Devanagari digits (०-९) to Arabic (0-9)
  const normalized = text.replace(/[०-९]/g, (d) =>
    String('०१२३४५६७८९'.indexOf(d))
  );

  // Check digit numbers first
  const digitMatch = normalized.match(/\d+(\.\d+)?/);
  if (digitMatch) return parseFloat(digitMatch[0]);

  // Check Hindi words (romanized + Devanagari)
  for (const [word, value] of Object.entries(HINDI_NUMBERS)) {
    if (text.includes(word)) return value;
  }
  return null;
}

function normalizeCrop(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(CROP_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

// ── All quintal spelling variants ─────────────────────────────────────────
const QUINTAL_PATTERN = /quintal|quintl|quintle|kuntal|क्विंटल|क्विन्टल|कुंतल|कुन्तल|कुंटल|क़ुंतल|क़्विंटल/;
const QUINTAL_RE_SRC = 'quintal|quintl|quintle|kuntal|क्विंटल|क्विन्टल|कुंतल|कुन्तल|कुंटल|क़ुंतल|क़्विंटल';

// ── Main rule-based parser ─────────────────────────────────────────────────
export function ruleBasedIntent(input: string): IntentResult {
  const text = input.toLowerCase().trim();

  if (!text) {
    return { intent: 'HELP', params: {}, confidence: 0 };
  }

  // ── CREATE_LISTING ────────────────────────────────────────────────────────
  const isListing =
    text.includes('bech') ||
    text.includes('bach') ||  // voice misrecognition of bechna
    text.includes('sell') ||
    text.includes('sale') ||
    text.includes('listing') ||
    text.includes('daalna') ||
    text.includes('upload') ||
    // Devanagari
    text.includes('बेच') ||
    text.includes('बच') ||   // voice often hears बचना instead of बेचना
    text.includes('बिक्री') ||
    text.includes('डालना') ||
    text.includes('लिस्टिंग') ||
    // Quantity + crop often implies listing even without "sell" keyword
    text.includes('भाव') ||  // bhav = price/rate
    text.includes('दाम') ||  // daam = price
    text.includes('रेट');    // rate

  if (isListing) {
    const crop = normalizeCrop(text);
    const qtyKg = extractQuantityKg(text);
    const pricePerKg = extractPricePerKg(text);

    return {
      intent: 'CREATE_LISTING',
      params: {
        crop_name: crop ?? undefined,
        quantity_kg: qtyKg ?? undefined,
        price_per_kg: pricePerKg ?? undefined,
      },
      confidence: crop ? 0.85 : 0.6,
    };
  }

  // ── CHECK_MANDI_PRICE ─────────────────────────────────────────────────────
  const isMandi =
    text.includes('mandi') ||
    text.includes('bhav') ||
    text.includes('rate') ||
    text.includes('daam') ||
    text.includes('price') ||
    text.includes('kitne ka') ||
    // Devanagari
    text.includes('मंडी') ||
    text.includes('कितने का');

  if (isMandi) {
    const crop = normalizeCrop(text);
    return {
      intent: 'CHECK_MANDI_PRICE',
      params: { crop_name: crop ?? undefined },
      confidence: crop ? 0.9 : 0.7,
    };
  }

  // ── VIEW_ORDERS ───────────────────────────────────────────────────────────
  if (
    text.includes('order') ||
    text.includes('kharida') ||
    text.includes('booking') ||
    // Devanagari
    text.includes('ऑर्डर') ||
    text.includes('आर्डर') ||
    text.includes('खरीदा') ||
    text.includes('बुकिंग')
  ) {
    return { intent: 'VIEW_ORDERS', params: {}, confidence: 0.85 };
  }

  // ── MARK_OUT_FOR_DELIVERY ─────────────────────────────────────────────────
  if (
    text.includes('nikal') ||
    text.includes('delivery') ||
    text.includes('pahunch') ||
    text.includes('ja raha')
  ) {
    return { intent: 'MARK_OUT_FOR_DELIVERY', params: {}, confidence: 0.8 };
  }

  // ── VIEW_INCOME ───────────────────────────────────────────────────────────
  if (
    text.includes('kamai') ||
    text.includes('income') ||
    text.includes('kamaya') ||
    text.includes('paise') ||
    text.includes('earnings') ||
    // Devanagari
    text.includes('कमाई') ||
    text.includes('पैसे') ||
    text.includes('आमदनी')
  ) {
    return { intent: 'VIEW_INCOME', params: {}, confidence: 0.85 };
  }

  // ── VIEW_SCORE ────────────────────────────────────────────────────────────
  if (
    text.includes('score') ||
    text.includes('rating') ||
    text.includes('review') ||
    // Devanagari
    text.includes('स्कोर') ||
    text.includes('रेटिंग')
  ) {
    return { intent: 'VIEW_SCORE', params: {}, confidence: 0.85 };
  }

  // ── PAUSE_LISTING ─────────────────────────────────────────────────────────
  if (text.includes('band') || text.includes('pause') || text.includes('rok')) {
    return { intent: 'PAUSE_LISTING', params: {}, confidence: 0.75 };
  }

  // ── RESUME_LISTING ────────────────────────────────────────────────────────
  if (text.includes('shuru') || text.includes('resume') || text.includes('chalu')) {
    return { intent: 'RESUME_LISTING', params: {}, confidence: 0.75 };
  }

  // ── EDIT_PRICE ────────────────────────────────────────────────────────────
  if (
    (text.includes('price') || text.includes('rate') || text.includes('daam')) &&
    (text.includes('change') || text.includes('badal') || text.includes('update'))
  ) {
    const price = extractPricePerKg(text);
    const crop = normalizeCrop(text);
    return {
      intent: 'EDIT_PRICE',
      params: { crop_name: crop ?? undefined, price_per_kg: price ?? undefined },
      confidence: 0.75,
    };
  }

  // ── DEFAULT: Guess CREATE_LISTING if crop or quantity present ────────────
  const crop = normalizeCrop(text);
  const qtyKg = extractQuantityKg(text);
  const pricePerKg = extractPricePerKg(text);

  if (crop || qtyKg || pricePerKg) {
    return {
      intent: 'CREATE_LISTING',
      params: {
        crop_name: crop ?? undefined,
        quantity_kg: qtyKg ?? undefined,
        price_per_kg: pricePerKg ?? undefined,
      },
      confidence: crop ? 0.7 : 0.5,
    };
  }

  // ── HELP (default) ────────────────────────────────────────────────────────
  return { intent: 'HELP', params: {}, confidence: 0.2 };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function normalizeDigits(text: string): string {
  return text.replace(/[०-९]/g, (d) =>
    String('०१२३४५६७८९'.indexOf(d))
  );
}

function extractQuantityKg(text: string): number | null {
  const norm = normalizeDigits(text);

  // Strip ₹-prefixed numbers so "₹100 किलो" doesn't match as 100 kg
  const safe = norm.replace(/₹\s*\d+(\.\d+)?/g, '___PRICE___');

  // quintal → kg (all spelling variants)
  const quintalMatch = safe.match(new RegExp('(\\d+|[a-z]+)\\s*(' + QUINTAL_RE_SRC + ')'));
  if (quintalMatch) {
    const num = parseNumber(quintalMatch[1]);
    return num !== null ? num * 100 : null;
  }

  // bori/katta → 50 kg
  const boriMatch = safe.match(/(\d+|[a-z]+)\s*(bori|बोरी|katta|कट्टा)/);
  if (boriMatch) {
    const num = parseNumber(boriMatch[1]);
    return num !== null ? num * 50 : null;
  }

  // peti → 20 kg
  const petiMatch = safe.match(/(\d+|[a-z]+)\s*(peti|पेटी)/);
  if (petiMatch) {
    const num = parseNumber(petiMatch[1]);
    return num !== null ? num * 20 : null;
  }

  // Direct kg
  const kgMatch = safe.match(/(\d+(\.\d+)?)\s*(kg|kilo|kilogram|किलो|किलोग्राम)/);
  if (kgMatch) return parseFloat(kgMatch[1]);

  // Hindi number + kilo
  for (const [word, value] of Object.entries(HINDI_NUMBERS)) {
    if (text.includes(`${word} kilo`) || text.includes(`${word} kg`) || text.includes(`${word} किलो`)) {
      return value;
    }
  }

  return null;
}

function extractPricePerKg(text: string): number | null {
  const norm = normalizeDigits(text);

  // ── Per-quintal price → divide by 100 to get per-kg ────────────────────
  // REQUIRES a currency marker or "per/प्रति" to distinguish from quantity.
  // Without this, "2 क्विंटल" (quantity) would be misread as price=0.02.

  // Pattern 1: NUMBER + CURRENCY_WORD + (per/प्रति)? + QUINTAL
  //   "2000 रुपए प्रति क्विंटल", "2100 rupye quintal"
  const qp1 = norm.match(new RegExp('(\\d+)\\s*(?:rupay|rupye|rs\\.?|rupe|rupees?|रुपए|रुपये)\\s*(?:per|प्रति|preti)?\\s*(?:' + QUINTAL_RE_SRC + ')'));
  if (qp1) return parseFloat(qp1[1]) / 100;

  // Pattern 2: ₹NUMBER + (per/प्रति)? + QUINTAL
  //   "₹2100 क्विंटल", "₹2100 प्रति कुंतल"
  const qp2 = norm.match(new RegExp('₹\\s*(\\d+)\\s*(?:per|प्रति|preti)?\\s*(?:' + QUINTAL_RE_SRC + ')'));
  if (qp2) return parseFloat(qp2[1]) / 100;

  // Pattern 3: NUMBER + "per/प्रति" + QUINTAL (no currency, but explicit "per")
  //   "2100 per quintal", "2100 प्रति कुंतल"
  const qp3 = norm.match(new RegExp('(\\d+)\\s+(?:per|प्रति)\\s+(?:' + QUINTAL_RE_SRC + ')'));
  if (qp3) return parseFloat(qp3[1]) / 100;

  // ── Per-kg price with ₹ symbol ────────────────────────────────────────
  //   "₹100 किलो के भाव", "₹30 per kilo", "₹25"
  const rupeeMatch = norm.match(/₹\s*(\d+(\.\d+)?)/);
  if (rupeeMatch) return parseFloat(rupeeMatch[1]);

  // ── Per-kg price with currency word ───────────────────────────────────
  //   "30 rupees per kilo", "25 रुपए"
  //   Guard: if followed by quintal word, divide by 100
  const currMatch = norm.match(/(\d+(\.\d+)?)\s*(?:rupay|rupye|rs\.?|rupe|rupees?|रुपए|रुपये)/);
  if (currMatch) {
    const after = norm.slice(norm.indexOf(currMatch[0]) + currMatch[0].length);
    if (new RegExp('^\\s*(?:per|प्रति|preti)?\\s*(?:' + QUINTAL_RE_SRC + ')').test(after)) {
      return parseFloat(currMatch[1]) / 100;
    }
    return parseFloat(currMatch[1]);
  }

  // ── Per-kg with explicit "per kg" / "किलो के भाव" ─────────────────────
  const pkMatch = norm.match(/(\d+(\.\d+)?)\s*(?:per kilo|per kg|\/kg|\/kilo|प्रति किलो|किलो के भाव|किलो भाव)/i);
  if (pkMatch) return parseFloat(pkMatch[1]);

  return null;
}
