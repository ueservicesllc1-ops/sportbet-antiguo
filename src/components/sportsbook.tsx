
import { SportSection } from "./sport-section";

// Use the same curated list of sports as the sidebar to ensure consistency.
const staticSports = [
    { id: '1', title: 'Soccer' },
    { id: '2', title: 'Tennis' },
    { id: '4', title: 'Cricket' },
    { id: '7522', title: 'Horse Racing' },
    { id: '4339', title: 'Greyhound Racing' },
    { id: '61420', title: 'Esports' },
    { id: '3503', title: 'Darts' },
    { id: '26420387', title: 'Special Bets' },
    { id: '27454571', title: 'Politics' },
];

// Helper to create a slug from a sport title, identical to the one in the sidebar
const createSportSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-');
}

export function Sportsbook() {
    const sports = staticSports;

    if (sports.length === 0) {
        return <div className="text-center text-muted-foreground">No hay deportes disponibles en este momento.</div>;
    }

    return (
        <div className="space-y-8">
            {sports.map((sport) => (
                // Each sport section gets an ID that matches the anchor link from the sidebar
                <section key={sport.id} id={createSportSlug(sport.title)} className="scroll-m-20">
                    <SportSection sportId={sport.id} sportTitle={sport.title} />
                </section>
            ))}
        </div>
    );
}
