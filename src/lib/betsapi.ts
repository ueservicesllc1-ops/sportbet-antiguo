
'use server'

import { z } from 'zod';

const API_KEY = process.env.BETS_API_TOKEN;
const API_URL = 'https://api.b365api.com/v3';

// Zod schemas for validating API responses.
const EventSchema = z.object({
  id: z.string(),
  sport_id: z.string(),
  time: z.string(),
  time_status: z.string(),
  league: z.object({
    id: z.string(),
    name: z.string(),
  }),
  home: z.object({
    id: z.string(),
    name: z.string(),
  }),
  away: z.object({
    id: z.string(),
    name: z.string(),
  }),
  ss: z.string().nullable().optional(),
  points: z.string().optional(),
  timer: z.any().optional(),
});

const SportSchema = z.object({
    id: z.string(),
    title: z.string(),
});

const SportsResponseSchema = z.object({
    success: z.number(),
    results: z.array(SportSchema),
});

export type BetfairEvent = z.infer<typeof EventSchema>;
export type Sport = z.infer<typeof SportSchema>;

const UpcomingResponseSchema = z.object({
  success: z.number(),
  results: z.array(EventSchema),
});

async function fetchFromBetsAPI(endpoint: string, params: Record<string, string> = {}) {
    if (!API_KEY || API_KEY === 'YOUR_TOKEN' || API_KEY === 'YOUR_TOKEN_HERE') {
        console.error('BetsAPI Error: API Key not configured.');
        return { success: 0, error: 'API Key not configured' };
    }

    const queryString = new URLSearchParams({ token: API_KEY, ...params }).toString();
    const url = `${API_URL}/${endpoint}?${queryString}`;

    try {
        const response = await fetch(url, { next: { revalidate: 60 } });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) { /* Not JSON */ }
            console.error('BetsAPI Error Response:', { status: response.status, data: errorData });
             return { success: 0, error: `API Error: ${errorData?.message || response.statusText}` };
        }

        return await response.json();

    } catch (error) {
        console.error('Failed to fetch from BetsAPI:', error);
         return { success: 0, error: 'Network or parsing error' };
    }
}

export async function getUpcomingEvents(sport_id: string): Promise<BetfairEvent[]> {
    const data = await fetchFromBetsAPI('betfair/ex/upcoming', { sport_id });
    if (data.success === 0) {
        console.error("BetsAPI call failed for getUpcomingEvents:", data.error);
        return [];
    }
    const validatedData = UpcomingResponseSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Zod validation error for getUpcomingEvents:", validatedData.error);
        return [];
    }
    return validatedData.data.results;
}

export async function getInplayEvents(sport_id: string): Promise<BetfairEvent[]> {
    const data = await fetchFromBetsAPI('betfair/ex/inplay', { sport_id });
    if (data.success === 0) {
        console.error("BetsAPI call failed for getInplayEvents:", data.error);
        return [];
    }
    const validatedData = UpcomingResponseSchema.safeParse(data);
    if (!validatedData.success) {
        console.error("Zod validation error for getInplayEvents:", validatedData.error);
        return [];
    }
    return validatedData.data.results;
}

export async function getEventData(event_id: string) {
    const data = await fetchFromBetsAPI('betfair/ex/event', { event_id });
    if (data.success === 0) return null;
    return data.results && data.results.length > 0 ? data.results[0] : null;
}

export async function getEventResult(event_id: string) {
    const data = await fetchFromBetsAPI('betfair/result', { event_id });
    if (data.success === 0) return null;
    return data.results && data.results.length > 0 ? data.results[0] : null;
}

export async function getOddsSummary(event_id: string) {
    const data = await fetchFromBetsAPI('events/odds/summary', { event_id });
    if (data.success === 0) return {};
    return data.results || {};
}

export async function getSports(): Promise<Sport[]> {
    const data = await fetchFromBetsAPI('betfair/sports'); 
    const staticSportsList = [
        { id: '1', title: 'Soccer' },
        { id: '2', title: 'Tennis' },
        { id: '18', title: 'Basketball' },
        { id: '4', title: 'Cricket' },
        { id: '7522', title: 'Horse Racing' },
        { id: '61420', title: 'Esports' },
    ];

    if (data.success === 0 || !SportsResponseSchema.safeParse(data).success) {
        console.warn('API call for sports failed or data is invalid. Falling back to static sports list.');
        if (data.error) console.error("API Error details:", data.error);
        return staticSportsList;
    }

    // Combine and deduplicate
    const apiSports = SportsResponseSchema.safeParse(data).data.results;
    const combinedSports = [...staticSportsList];
    const sportIds = new Set(staticSportsList.map(s => s.id));

    apiSports.forEach(sport => {
        if (!sportIds.has(sport.id)) {
            combinedSports.push(sport);
            sportIds.add(sport.id);
        }
    });

    return combinedSports;
}

export interface League {
    id: string;
    name: string;
}

export async function getLeaguesForSport(sport_id: string): Promise<League[]> {
    const events = await getUpcomingEvents(sport_id);
    if (!events || events.length === 0) return [];

    const leaguesMap = new Map<string, string>();
    events.forEach(event => {
        if (event.league && !leaguesMap.has(event.league.id)) {
            leaguesMap.set(event.league.id, event.league.name);
        }
    });
    const uniqueLeagues: League[] = Array.from(leaguesMap, ([id, name]) => ({ id, name }));
    return uniqueLeagues;
}
