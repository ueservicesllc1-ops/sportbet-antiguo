
import { Flame, Footprints, Zap, Dices, Shield, Swords, Ghost, Landmark, Trophy, HelpCircle, type LucideIcon, icons, Basketball } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    "Soccer": icons.Footprints,
    "Tennis": icons.Zap,
    "Cricket": icons.Shield,
    "Horse Racing": icons.Flame,
    "Greyhound Racing": icons.Footprints, // Using Footprints as a fallback
    "Esports": icons.Dices,
    "Special Bets": icons.Ghost,
    "Politics": icons.Landmark,
    "Basketball": icons.Basketball,
};

export const getSportIcon = (sportTitle: string): LucideIcon => {
    return iconMap[sportTitle] || HelpCircle;
};
