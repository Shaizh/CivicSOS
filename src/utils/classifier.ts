import { ClassificationResult, HelpCategory, UrgencyLevel } from '../types';

interface RuleDefinition {
  category: HelpCategory;
  defaultUrgency: UrgencyLevel;
  keywords: string[];
}

const RULES: RuleDefinition[] = [
  {
    category: 'medical',
    defaultUrgency: 'high',
    keywords: [
      'bleeding',
      'chest pain',
      'heart',
      'unconscious',
      'stroke',
      'injury',
      'ambulance',
      'breathing',
      'fainted',
      'seizure',
      'wound',
      'pulse',
      'dizzy'
    ],
  },
  {
    category: 'accident',
    defaultUrgency: 'high',
    keywords: [
      'crash',
      'car',
      'hit',
      'collision',
      'fire',
      'road',
      'trapped',
      'bike accident',
      'rollover',
      'smoke',
      'burn'
    ],
  },
  {
    category: 'food_water',
    defaultUrgency: 'medium',
    keywords: [
      'hungry',
      'food',
      'ration',
      'drink',
      'water',
      'supplies',
      'meal',
      'starving',
      'groceries',
      'baby food'
    ],
  },
  {
    category: 'transport',
    defaultUrgency: 'low',
    keywords: [
      'stranded',
      'tire',
      'fuel',
      'petrol',
      'lift',
      'ride',
      'breakdown',
      'puncture',
      'engine stalled',
      'jump start',
      'battery dead'
    ],
  },
  {
    category: 'lost_person',
    defaultUrgency: 'high',
    keywords: [
      'missing',
      'lost',
      'child',
      'senior',
      'dementia',
      'disoriented',
      'kid',
      'wandered',
      'alzheimer',
      'elderly'
    ],
  },
];

export function classifyHelpText(text: string): ClassificationResult | null {
  const trimmed = text.trim().toLowerCase();
  if (trimmed.length < 3) {
    return null;
  }

  const matches: {
    category: HelpCategory;
    urgency: UrgencyLevel;
    matchedKeywords: string[];
    score: number;
  }[] = [];

  for (const rule of RULES) {
    const matchedWords: string[] = [];
    for (const kw of rule.keywords) {
      // match whole word or phrase
      if (kw.includes(' ')) {
        if (trimmed.includes(kw)) {
          matchedWords.push(kw);
        }
      } else {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(trimmed)) {
          matchedWords.push(kw);
        }
      }
    }

    if (matchedWords.length > 0) {
      matches.push({
        category: rule.category,
        urgency: rule.defaultUrgency,
        matchedKeywords: matchedWords,
        score: matchedWords.length * 10 + (rule.defaultUrgency === 'high' ? 5 : 0),
      });
    }
  }

  if (matches.length === 0) {
    // Generic fallback if user typed substantial text but no specific keyword matched
    return {
      category: 'other',
      urgency: 'low',
      confidence: Math.min(55, 30 + Math.floor(trimmed.length / 5)),
      matchedKeywords: [],
      suggestEmergencyDial: false,
    };
  }

  // Sort by highest score
  matches.sort((a, b) => b.score - a.score);
  const best = matches[0];

  // Calculate dynamic confidence (70% - 98%)
  const baseConfidence = 70;
  const keywordBonus = Math.min(22, best.matchedKeywords.length * 8);
  const lengthBonus = Math.min(6, Math.floor(trimmed.length / 15));
  const confidence = Math.min(98, baseConfidence + keywordBonus + lengthBonus);

  // Determine urgency: if multiple high urgency keywords, enforce high
  let urgency = best.urgency;
  if (best.category === 'food_water') {
    if (trimmed.includes('starving') || trimmed.includes('infant') || trimmed.includes('days without')) {
      urgency = 'high';
    } else {
      urgency = 'medium';
    }
  } else if (best.category === 'transport') {
    if (trimmed.includes('highway') || trimmed.includes('night') || trimmed.includes('danger')) {
      urgency = 'medium';
    } else {
      urgency = 'low';
    }
  }

  return {
    category: best.category,
    urgency,
    confidence,
    matchedKeywords: best.matchedKeywords,
    suggestEmergencyDial: urgency === 'high',
  };
}

export const CATEGORY_METADATA: Record<
  HelpCategory,
  {
    name: string;
    icon: string;
    description: string;
    defaultUrgency: UrgencyLevel;
  }
> = {
  medical: {
    name: 'Medical Emergency',
    icon: 'Stethoscope',
    description: 'First aid, CPR, cardiac distress, sudden trauma',
    defaultUrgency: 'high',
  },
  accident: {
    name: 'Accident',
    icon: 'Car',
    description: 'Vehicle collision, road hazard, structural incident',
    defaultUrgency: 'high',
  },
  food_water: {
    name: 'Food / Water',
    icon: 'Utensils',
    description: 'Emergency rations, infant food, clean drinking supply',
    defaultUrgency: 'medium',
  },
  transport: {
    name: 'Transportation',
    icon: 'Bus',
    description: 'Flat tire, jump start, stranded transit assistance',
    defaultUrgency: 'low',
  },
  lost_person: {
    name: 'Lost Person',
    icon: 'Search',
    description: 'Missing senior, disoriented child, search radius',
    defaultUrgency: 'high',
  },
  other: {
    name: 'Other Urgent Need',
    icon: 'LifeBuoy',
    description: 'General community mutual aid and urgent support',
    defaultUrgency: 'medium',
  },
};
