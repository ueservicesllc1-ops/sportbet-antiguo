
import { getInplayEvents, getUpcomingEvents, BetfairEvent } from "@/lib/betsapi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MatchList } from "./match-list";
import { getSportIcon } from "@/lib/sport-icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface SportSectionProps {
    sportId: string;
    sportTitle: string;
}

export async function SportSection({ sportId, sportTitle }: SportSectionProps) {
    const Icon = getSportIcon(sportTitle);

    let inplayEvents: BetfairEvent[] = [];
    let upcomingEvents: BetfairEvent[] = [];
    let error: string | null = null;

    try {
        [inplayEvents, upcomingEvents] = await Promise.all([
            getInplayEvents(sportId),
            getUpcomingEvents(sportId),
        ]);
    } catch (e) {
        console.error(`Failed to fetch events for sport ${sportId}:`, e);
        error = e instanceof Error ? e.message : "An unknown error occurred while fetching events.";
    }

    if (!error && inplayEvents.length === 0 && upcomingEvents.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Icon className="h-5 w-5" />
                    {sportTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {!error && inplayEvents.length > 0 && (
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-primary">En Vivo</h3>
                        <MatchList events={inplayEvents} isUpcoming={false} />
                    </div>
                )}

                {!error && upcomingEvents.length > 0 && (
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Próximos Partidos</h3>
                        <MatchList events={upcomingEvents} isUpcoming={true} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
