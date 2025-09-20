
"use client";

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getSportIcon } from "@/lib/sport-icons";
import Link from "next/link";
import { getSports, getLeaguesForSport, Sport, League } from '@/lib/betsapi';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Loader2 } from 'lucide-react';

export function SportsSidebar() {
    const [sports, setSports] = useState<Sport[]>([]);
    const [openSport, setOpenSport] = useState<string | null>(null);
    const [leagues, setLeagues] = useState<Record<string, League[]>>({});
    const [loadingLeagues, setLoadingLeagues] = useState<Record<string, boolean>>({});

    useEffect(() => {
        async function fetchSports() {
            const sportsData = await getSports();
            setSports(sportsData);
        }
        fetchSports();
    }, []);

    const toggleSport = async (sportId: string) => {
        const newOpenSport = openSport === sportId ? null : sportId;
        setOpenSport(newOpenSport);

        if (newOpenSport && !leagues[newOpenSport]) {
            setLoadingLeagues(prev => ({ ...prev, [newOpenSport]: true }));
            try {
                const leagueData = await getLeaguesForSport(newOpenSport);
                setLeagues(prev => ({ ...prev, [newOpenSport]: leagueData }));
            } catch (error) {
                console.error(`Failed to fetch leagues for sport ${newOpenSport}:`, error);
                // Optionally, handle the error in the UI
            }
            setLoadingLeagues(prev => ({ ...prev, [newOpenSport]: false }));
        }
    };

    // Helper to create a slug from a sport title
    const createSportSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deportes</CardTitle>
            </CardHeader>
            <CardContent>
                {sports.length > 0 ? (
                    <nav className="flex flex-col space-y-1">
                        {sports.map((sport) => {
                            const Icon = getSportIcon(sport.title);
                            const slug = createSportSlug(sport.title);
                            const isOpen = openSport === sport.id;

                            return (
                                <Collapsible key={sport.id} open={isOpen} onOpenChange={() => toggleSport(sport.id)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="justify-between w-full">
                                            <div className="flex items-center">
                                                <Icon className="mr-2 h-4 w-4" />
                                                <Link href={`#${slug}`}>{sport.title}</Link>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pl-4 pt-1">
                                        {loadingLeagues[sport.id] ? (
                                            <div className="flex items-center justify-center py-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </div>
                                        ) : leagues[sport.id] && leagues[sport.id].length > 0 ? (
                                            <div className="flex flex-col space-y-1">
                                                {leagues[sport.id].map((league) => (
                                                    <Button key={league.id} variant="ghost" className="justify-start h-8 text-sm font-normal" asChild>
                                                        <Link href={`/league/${league.id}`}>
                                                            {league.name}
                                                        </Link>
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : leagues[sport.id] ? (
                                            <p className="text-xs text-muted-foreground px-4 py-2">No hay ligas disponibles.</p>
                                        ) : null}
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </nav>
                ) : (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
