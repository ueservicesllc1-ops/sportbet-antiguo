
import { getEventData } from '@/lib/betsapi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Home, Shield, Swords, Calendar, Clock, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketsDisplay } from '@/components/markets-display';
import { z } from 'zod';

// Zod schema for a single runner in a market
const RunnerSchema = z.object({
    id: z.string(),
    name: z.string(),
    back: z.array(z.object({ price: z.number(), size: z.number() })).optional(),
    lay: z.array(z.object({ price: z.number(), size: z.number() })).optional(),
});

// Zod schema for a single market
const MarketSchema = z.object({
    id: z.string(),
    name: z.string(),
    runners: z.array(RunnerSchema),
});

// Zod schema for the main event data structure from the API
const EventDataSchema = z.object({
    id: z.string(),
    sport_id: z.string(),
    time: z.string(),
    time_status: z.string(),
    league: z.object({ id: z.string(), name: z.string() }),
    home: z.object({ id: z.string(), name: z.string() }),
    away: z.object({ id: z.string(), name: z.string() }),
    ss: z.string().nullable(),
    timer: z.any().optional(),
    markets: z.array(MarketSchema).optional(),
});

export type BetfairMarket = z.infer<typeof MarketSchema>;

interface MatchDetailsPageProps {
    params: {
        id: string;
    }
}

// Helper to format Unix timestamp
const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return {
        date: date.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' }),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
};

export default async function MatchDetailsPage({ params }: MatchDetailsPageProps) {
    const eventData = await getEventData(params.id);

    if (!eventData) {
        return (
            <main className="container mx-auto max-w-4xl py-8">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>No se pudieron cargar los detalles del evento. Es posible que el evento ya no esté disponible.</AlertDescription>
                </Alert>
            </main>
        );
    }
    
    const validation = EventDataSchema.safeParse(eventData);

    if (!validation.success) {
        console.error("Zod Validation Error for Event Data:", validation.error);
        return (
            <main className="container mx-auto max-w-4xl py-8">
                <Alert variant="destructive">
                    <AlertTitle>Error de Datos</AlertTitle>
                    <AlertDescription>La estructura de los datos recibidos de la API no es la esperada.</AlertDescription>
                </Alert>
            </main>
        );
    }

    const event = validation.data;
    const { date, time } = formatTime(event.time);
    const isLive = event.time_status === '1';

    return (
        <main className="container mx-auto max-w-5xl py-8 space-y-6">
            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                        <div className='flex-1'>
                             <CardDescription className='flex items-center gap-2 text-sm'>
                                <Home className='h-4 w-4'/> {event.league.name}
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold mt-1">
                                {event.home.name} vs {event.away.name}
                            </CardTitle>
                        </div>
                        {isLive && event.ss && (
                             <Badge variant="destructive" className='text-2xl font-bold px-4 py-2 mt-4 md:mt-0'>
                                {event.ss}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" /> {date}</div>
                        <div className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {time}</div>
                        {isLive && <Badge className='bg-red-500 hover:bg-red-600'>En Vivo</Badge>}
                    </div>
                </CardContent>
            </Card>

            <div>
                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5"/>
                    Mercados Disponibles
                </h2>
                {event.markets && event.markets.length > 0 ? (
                    <MarketsDisplay markets={event.markets} eventName={`${event.home.name} vs ${event.away.name}`} />
                ) : (
                    <p className='text-muted-foreground'>No hay mercados de apuestas disponibles para este evento en este momento.</p>
                )}
            </div>
        </main>
    );
}
