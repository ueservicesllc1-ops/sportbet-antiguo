
'use client';

import { useEffect, useState } from 'react';
import { getUpcomingEvents, BetfairEvent } from '@/lib/betsapi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';

const FEATURED_SPORT_ID = '1'; // Soccer

export function FeaturedMatches() {
    const [events, setEvents] = useState<BetfairEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedEvents() {
            try {
                setLoading(true);
                const upcomingEvents = await getUpcomingEvents(FEATURED_SPORT_ID);
                // Take the first 10 upcoming events as featured
                setEvents(upcomingEvents.slice(0, 10));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                console.error('Failed to fetch featured events:', errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error al Cargar Partidos Destacados</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
        );
    }

    if (events.length === 0) {
        return null; // Don't render the component if there are no events
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Partidos Destacados
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                        {events.map((event) => (
                            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                                <FeaturedMatchCard event={event} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-2" />
                    <CarouselNext className="-right-2" />
                </Carousel>
            </CardContent>
        </Card>
    );
}

function FeaturedMatchCard({ event }: { event: BetfairEvent }) {
    const eventDate = new Date(parseInt(event.time) * 1000);
    const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = eventDate.toLocaleDateString([], { day: '2-digit', month: 'short' });

    return (
        <Link href={`/match/${event.id}`} className="block p-1">
            <div className="rounded-lg border bg-card p-4 transition-all hover:bg-muted/50">
                <p className="text-xs text-muted-foreground">{event.league.name}</p>
                <div className="my-3 space-y-2 text-center">
                    <p className="font-bold">{event.home.name}</p>
                    <p className="text-sm font-semibold text-primary">VS</p>
                    <p className="font-bold">{event.away.name}</p>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                    <span>{formattedDate} - {formattedTime}</span>
                </div>
            </div>
        </Link>
    );
}
