
'use server';

import { getOddsSummary as getOddsSummaryFromApi } from '@/lib/betsapi';

/**
 * Server Action to safely fetch odds summary for a given event ID.
 * This function runs exclusively on the server and can safely use API keys.
 * @param eventId The ID of the event to fetch odds for.
 * @returns The odds summary or null if an error occurs.
 */
export async function getOddsSummary(eventId: string) {
    try {
        const odds = await getOddsSummaryFromApi(eventId);
        // The result from the API call is already a serializable object, so we can return it directly.
        return odds;
    } catch (error) {
        console.error(`[Server Action] Failed to fetch odds for event ${eventId}:`, error);
        // Return null or a specific error object that is safe to be sent to the client.
        return null;
    }
}
