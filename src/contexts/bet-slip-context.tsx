
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// The Bet type now includes an optional 'type' to distinguish between 'back' and 'lay' bets.
export interface Bet {
  id: string; 
  event: string;
  market: string;
  selection: string;
  odd: number;
  type?: 'back' | 'lay'; // Optional 'back' or 'lay' type
}

interface BetSlipContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);
  const { toast } = useToast();
  const previousBetsRef = useRef<Bet[]>([]);

  useEffect(() => {
    const newBets = bets;
    const oldBets = previousBetsRef.current;

    if (newBets.length > oldBets.length) {
      const addedBet = newBets.find(nb => !oldBets.some(ob => ob.id === nb.id));
      if (addedBet) {
        toast({
          title: 'Apuesta añadida',
          description: `${addedBet.selection} @ ${addedBet.odd.toFixed(2)}`,
        });
      }
    } else if (newBets.length < oldBets.length) {
      const removedBet = oldBets.find(ob => !newBets.some(nb => nb.id === ob.id));
       if (removedBet) {
        toast({
            variant: 'destructive',
            title: 'Apuesta eliminada',
            description: `${removedBet.selection}`,
        });
      }
    }

    previousBetsRef.current = bets;
  }, [bets, toast]);


  const addBet = (newBet: Bet) => {
    setBets((prevBets) => {
      // Check if a bet with the same ID already exists
      const existingBetIndex = prevBets.findIndex((bet) => bet.id === newBet.id);

      if (existingBetIndex !== -1) {
        // If it exists, remove it (deselect)
        return prevBets.filter((bet) => bet.id !== newBet.id);
      } else {
        // If a bet for the same market but different selection exists, replace it.
        const sameMarketIndex = prevBets.findIndex(
          (bet) => bet.event === newBet.event && bet.market === newBet.market
        );
        if (sameMarketIndex !== -1) {
            const updatedBets = prevBets.filter((_, index) => index !== sameMarketIndex);
            updatedBets.push(newBet);
            return updatedBets;
        } else {
            // Otherwise, just add the new bet.
            return [...prevBets, newBet];
        }
      }
    });
  };

  const removeBet = (betId: string) => {
    setBets((prevBets) => prevBets.filter((bet) => bet.id !== betId));
  };
  
  const clearBets = () => {
    setBets([]);
  }

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, clearBets }}>
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error('useBetSlip must be used within a BetSlipProvider');
  }
  return context;
}
