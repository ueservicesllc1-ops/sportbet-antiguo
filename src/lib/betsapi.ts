
'use server';

import { z } from 'zod';

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

export type BetfairEvent = z.infer<typeof EventSchema>;
export type Sport = z.infer<typeof SportSchema>;

export async function getUpcomingEvents(sport_id: string): Promise<BetfairEvent[]> {
    console.log("BetsAPI: getUpcomingEvents is mocked. Returning empty array.");
    return [];
}

export async function getInplayEvents(sport_id: string): Promise<BetfairEvent[]> {
    console.log("BetsAPI: getInplayEvents is mocked. Returning empty array.");
    return [];
}

export async function getEventData(event_id: string) {
    console.log("BetsAPI: getEventData is mocked. Returning null.");
    return null;
}

export async function getEventResult(event_id: string) {
    console.log("BetsAPI: getEventResult is mocked. Returning null.");
    return null;
}

export async function getOddsSummary(event_id: string) {
    console.log("BetsAPI: getOddsSummary is mocked. Returning empty object.");
    return {};
}

export async function getSports(): Promise<Sport[]> {
    console.log("BetsAPI: getSports is mocked. Returning static sport list.");
    const staticSportsList = [
        { id: '1', title: 'Soccer' },
        { id: '2', title: 'Tennis' },
        { id: '18', title: 'Basketball' },
        { id: '4', title: 'Cricket' },
        { id: '7522', title: 'Horse Racing' },
        { id: '61420', title: 'Esports' },
    ];
    return staticSportsList;
}

export interface League {
    id: string;
    name: string;
}

export async function getLeaguesForSport(sport_id: string): Promise<League[]> {
    console.log("BetsAPI: getLeaguesForSport is mocked. Returning empty array.");
    return [];
}
