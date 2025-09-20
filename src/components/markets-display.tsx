
'use client'

import { BetfairMarket } from '@/app/match/[id]/page';
import { Button } from '@/components/ui/button';
import { useBetSlip, Bet } from '@/contexts/bet-slip-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MarketsDisplayProps {
    markets: BetfairMarket[];
    eventName: string;
}

export function MarketsDisplay({ markets, eventName }: MarketsDisplayProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {markets.map((market) => (
                <MarketCard key={market.id} market={market} eventName={eventName} />
            ))}
        </div>
    );
}

function MarketCard({ market, eventName }: { market: BetfairMarket, eventName: string }) {
    const { addBet, bets } = useBetSlip();

    const handleAddBet = (runnerName: string, price: number, type: 'back' | 'lay') => {
        const bet: Bet = {
            id: `${market.id}_${runnerName}`.replace(/\s+/g, ''),
            event: eventName,
            market: market.name,
            selection: runnerName,
            odd: price,
            type: type, // Add the bet type (back or lay)
        };
        addBet(bet);
    };

    const getButtonVariant = (runnerName: string, type: 'back' | 'lay') => {
        const betId = `${market.id}_${runnerName}`.replace(/\s+/g, '');
        return bets.some(b => b.id === betId && b.type === type) ? 'secondary' : 'default';
    }

    return (
        <Card>
            <CardHeader className='pb-2'>
                <CardTitle className='text-base'>{market.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {market.runners.map((runner) => (
                        <li key={runner.id} className="flex justify-between items-center bg-muted/20 p-2 rounded-md">
                            <span className='font-medium text-sm'>{runner.name}</span>
                            <div className="flex items-center gap-2">
                                {/* Back Price Button */}
                                {runner.back && runner.back[0] ? (
                                    <Button 
                                        variant={getButtonVariant(runner.name, 'back')}
                                        size='sm' 
                                        className='bg-blue-500 hover:bg-blue-600 w-[90px] flex-col h-auto'
                                        onClick={() => handleAddBet(runner.name, runner.back![0].price, 'back')}
                                    >
                                        <span className='text-lg font-bold'>{runner.back[0].price}</span>
                                        <span className='text-xs font-light'>${runner.back[0].size.toFixed(2)}</span>
                                    </Button>
                                ) : <div className='w-[90px] h-[44px] bg-blue-500/20 rounded-md'></div>}
                                
                                {/* Lay Price Button */}
                                {runner.lay && runner.lay[0] ? (
                                    <Button 
                                        variant={getButtonVariant(runner.name, 'lay')}
                                        size='sm' 
                                        className='bg-pink-500 hover:bg-pink-600 w-[90px] flex-col h-auto'
                                        onClick={() => handleAddBet(runner.name, runner.lay![0].price, 'lay')}
                                    >
                                        <span className='text-lg font-bold'>{runner.lay[0].price}</span>
                                        <span className='text-xs font-light'>${runner.lay[0].size.toFixed(2)}</span>
                                    </Button>
                                ) : <div className='w-[90px] h-[44px] bg-pink-500/20 rounded-md'></div>}
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
