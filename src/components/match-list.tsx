
'use client';

import { useState, useEffect } from 'react';
import type { BetfairEvent } from "@/lib/betsapi";
import { getOddsSummary } from '@/app/actions';
import Link from "next/link";
import { Clock, Radio, Loader2 } from "lucide-react";
import { Button } from './ui/button';
import { OddsDisplay } from './odds-display';

interface MatchListProps {
    events: BetfairEvent[];
    isUpcoming: boolean;
}

const INITIAL_VISIBLE_COUNT = 4;

export function MatchList({ events, isUpcoming }: MatchListProps) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [oddsMap, setOddsMap] = useState<Record<string, any>>({});
    const [loadingOdds, setLoadingOdds] = useState<Record<string, boolean>>({});

    const visibleEvents = events.slice(0, visibleCount);

    useEffect(() => {
        const fetchAllVisibleOdds = async () => {
            for (const event of visibleEvents) {
                if (!oddsMap[event.id]) {
                    setLoadingOdds(prev => ({ ...prev, [event.id]: true }));
                    try {
                        const fetchedOdds = await getOddsSummary(event.id);
                        setOddsMap(prev => ({ ...prev, [event.id]: fetchedOdds || null }));
                    } catch (error) {
                        console.error(`Failed to fetch odds for event ${event.id}:`, error);
                        setOddsMap(prev => ({ ...prev, [event.id]: null }));
                    } finally {
                        setLoadingOdds(prev => ({ ...prev, [event.id]: false }));
                    }
                }
            }
        };

        fetchAllVisibleOdds();
    }, [visibleCount, events, oddsMap]);

    const showMore = () => {
        setVisibleCount(prevCount => prevCount + 4);
    };

    const hasMore = visibleCount < events.length;

    if (!events || events.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay partidos disponibles en esta sección.</p>;
    }

    return (
        <div className="space-y-3">
            {visibleEvents.map((event) => (
                <MatchListItem 
                    key={event.id} 
                    event={event} 
                    odds={oddsMap[event.id]} 
                    isLoading={loadingOdds[event.id] ?? false} 
                    isUpcoming={isUpcoming}
                />
            ))}
            {hasMore && (
                <div className="pt-2 text-center">
                    <Button variant="outline" onClick={showMore}>
                        Mostrar más
                    </Button>
                </div>
            )}
        </div>
    );
}

function MatchListItem({ event, odds, isLoading, isUpcoming }: { event: BetfairEvent, odds: any, isLoading: boolean, isUpcoming: boolean }) {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        if (isUpcoming) {
            const eventDate = new Date(parseInt(event.time) * 1000);
            setFormattedTime(eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
    }, [event.time, isUpcoming]);

    const renderLiveInfo = () => {
        const timer = event.timer;
        const score = event.ss || '0 - 0';
        if (!timer) return <span>{score}</span>;
        const minutes = Math.floor(timer.tm / 60);
        const phase = timer.q > 2 ? ' (Descanso)' : `'`;
        return (
            <div className='flex items-center gap-2'>
                <span className='font-bold text-primary'>{score}</span>
                <span className='text-xs text-muted-foreground'>{minutes}{phase}</span>
            </div>
        );
    };

    return (
        <div className="block rounded-md border bg-card p-3 transition-all">
            <div className="grid grid-cols-12 items-center gap-2 text-sm">
                
                <div className="col-span-12 md:col-span-7">
                     <Link href={`/match/${event.id}`} className="space-y-1 group">
                        <div className="font-semibold truncate group-hover:underline">
                           <span>1. {event.home.name}</span> vs <span>2. {event.away.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <p className="truncate">{event.league.name}</p>
                            {isUpcoming ? (
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span>{formattedTime || '...'}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 font-bold text-primary animate-pulse flex-shrink-0">
                                    <Radio className="h-3 w-3" />
                                    {renderLiveInfo()}
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="col-span-12 md:col-span-5 mt-2 md:mt-0">
                   {isLoading ? (
                       <div className="flex items-center justify-center col-span-3 h-full min-h-[50px]">
                           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                       </div>
                   ) : (
                       <OddsDisplay odds={odds} />
                   )}
                </div>
            </div>
        </div>
    );
}
