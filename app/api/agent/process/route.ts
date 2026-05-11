/**
 * POST /api/agent/process
 * Accepts { transcript: string, language?: string }
 * Returns AgentResponse with source field.
 */

import { processAgentRequest } from '@/lib/services/agent/geminiRotation';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { transcript?: string; language?: string };

    if (!body.transcript?.trim()) {
      return Response.json(
        { intent: 'HELP', confidence: 0, params: {}, response_hi: 'कुछ बोलें।', source: 'rule-based' },
        { status: 400 }
      );
    }

    const result = await processAgentRequest(body.transcript, body.language ?? 'hi');
    return Response.json(result);

  } catch (err: unknown) {
    console.error('[Agent API] Error:', err instanceof Error ? err.message : err);
    return Response.json(
      { intent: 'HELP', confidence: 0, params: {}, response_hi: 'Server error. Try again.', source: 'error' },
      { status: 500 }
    );
  }
}
