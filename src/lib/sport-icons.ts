
import { type LucideIcon, icons, HelpCircle } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    'Soccer': icons.Footprints,
    'Tennis': icons.Zap,
    'Cricket': icons.Shield,
    'Horse Racing': icons.Flame,
    'Greyhound Racing': icons.Footprints,
    'Esports': icons.Dices,
    'Special Bets': icons.Ghost,
    'Politics': icons.Landmark,
    'Basketball': icons.Basketball,
};

export const getSportIcon = (sportTitle: string): LucideIcon => {
    // Note: The key in iconMap must exist, otherwise it will return undefined.
    // We are using a fallback to HelpCircle to prevent crashes.
    return iconMap[sportTitle] || HelpCircle;
};
