
'use client';

import { Button } from "@/components/ui/button";

interface Odd {
    id: string;
    odds: string;
    header: string;
}

interface OddsGroup {
    [key: string]: {
        name: string;
        odds: Odd[];
    };
}

interface OddsDisplayProps {
    odds: OddsGroup;
}

// Finds the odds for Match Winner (commonly identified by these names)
const findMatchWinnerOdds = (odds: OddsGroup) => {
    const keys = Object.keys(odds);
    const winnerMarketKey = keys.find(key => 
        odds[key].name.toLowerCase().includes('match odds') || 
        odds[key].name.toLowerCase().includes('moneyline') ||
        odds[key].name.toLowerCase().includes('to win')
    );
    if (!winnerMarketKey) return null;

    const market = odds[winnerMarketKey];
    const home = market.odds.find(o => o.header?.toLowerCase() === 'home' || o.header?.toLowerCase() === '1');
    const draw = market.odds.find(o => o.header?.toLowerCase() === 'draw' || o.header?.toLowerCase() === 'x');
    const away = market.odds.find(o => o.header?.toLowerCase() === 'away' || o.header?.toLowerCase() === '2');

    return { home, draw, away };
};

export function OddsDisplay({ odds }: OddsDisplayProps) {
    if (!odds || Object.keys(odds).length === 0) {
        return <div className="flex items-center justify-center text-xs text-muted-foreground col-span-3">No disponible</div>;
    }

    const matchWinnerOdds = findMatchWinnerOdds(odds);

    if (!matchWinnerOdds) {
        return <div className="flex items-center justify-center text-xs text-muted-foreground col-span-3">No disponible</div>;
    }

    const { home, draw, away } = matchWinnerOdds;

    return (
        <div className="grid grid-cols-3 gap-1.5">
            {home ? (
                <Button variant="outline" size="sm" className="h-auto py-1 px-2 flex-col">
                    <span className="text-xs text-muted-foreground">1</span>
                    <span className="font-bold text-sm">{home.odds}</span>
                </Button>
            ) : <div />}
            {draw ? (
                <Button variant="outline" size="sm" className="h-auto py-1 px-2 flex-col">
                    <span className="text-xs text-muted-foreground">X</span>
                    <span className="font-bold text-sm">{draw.odds}</span>
                </Button>
            ) : <div />}
            {away ? (
                <Button variant="outline" size="sm" className="h-auto py-1 px-2 flex-col">
                    <span className="text-xs text-muted-foreground">2</span>
                    <span className="font-bold text-sm">{away.odds}</span>
                </Button>
            ) : <div />}
        </div>
    );
}
