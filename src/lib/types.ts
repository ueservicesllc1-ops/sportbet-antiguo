
// This file contains TypeScript interfaces for the data structures
// returned by the BetsAPI.

// Based on the `upcoming.json` and `inplay.json` samples
export interface SportEvent {
    id: string;
    sport_id: string;
    time: string;       // This is a timestamp, can be converted to a Date object
    time_status: string;
    league: League;
    home: Team;
    away: Team;
    ss: string | null;  // Score, e.g., "1-0"
    our_event_id?: number;
}

export interface League {
    id: string;
    name: string;
    cc: string; // Country code, e.g., "GB"
}

export interface Team {
    id: string;
    name: string;
    image_id?: string;
    cc?: string;
}

// Based on the `event_odds_summary.json` sample
export interface Odds {
    // The structure of odds can be quite complex and variable.
    // This is a simplified version. We can expand it as needed.
    [key: string]: {
        // Market name, e.g., '1x2_1'
        home_od: string;
        draw_od?: string; // Optional, not all markets have a draw
        away_od: string;
        ss: string | null;
        time_str: string | null;
        add_time: string;
    };
}

export interface EventOdds {
    event_id: string;
    odds: Odds;
}

export interface Bet {
    id: string;
    match: SportEvent;
    market: string;
    selection: string;
    odds: number;
    stake: number;
}
