/**
 * Maps voice intents to navigation actions.
 * Returns a path with optional query params for form prefill.
 */

import type { IntentResult } from './ruleBasedFallback';

export interface VoiceAction {
  type: 'navigate' | 'show_help';
  path?: string;
}

export function getIntentAction(result: IntentResult): VoiceAction {
  const { intent, params } = result;

  switch (intent) {
    case 'CREATE_LISTING': {
      const qp = new URLSearchParams();
      if (params.crop_name) qp.set('crop', String(params.crop_name));
      if (params.quantity_kg) qp.set('qty', String(params.quantity_kg));
      if (params.price_per_kg) qp.set('price', String(params.price_per_kg));
      const qs = qp.toString();
      return { type: 'navigate', path: `/farmer/listings/new${qs ? `?${qs}` : ''}` };
    }

    case 'CHECK_MANDI_PRICE':
      return { type: 'navigate', path: '/mandi' };

    case 'VIEW_ORDERS':
      return { type: 'navigate', path: '/farmer/orders' };

    case 'MARK_OUT_FOR_DELIVERY':
      return { type: 'navigate', path: '/farmer/orders' };

    case 'VIEW_INCOME':
      return { type: 'navigate', path: '/farmer/income' };

    case 'VIEW_SCORE':
      return { type: 'navigate', path: '/farmer/score' };

    case 'PAUSE_LISTING':
      return { type: 'navigate', path: '/farmer/listings' };

    case 'RESUME_LISTING':
      return { type: 'navigate', path: '/farmer/listings' };

    case 'EDIT_PRICE':
      return { type: 'navigate', path: '/farmer/listings' };

    case 'HELP':
    default:
      return { type: 'show_help' };
  }
}
