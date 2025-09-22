
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AssetUploadForm } from "./_components/asset-upload-form";
import { getPenaltyGameAssets, getLobbyAssets, getMinesGameAssets } from "./actions";
import { LobbyAssetsForm } from "./_components/lobby-assets-form";

const penaltyAssets = [
    { key: 'background', title: 'Imagen de Fondo/Portería', description: 'La imagen principal de la portería y el campo.' },
    { key: 'ball', title: 'Imagen del Balón', description: 'La pelota que se patea.' },
    { key: 'keeper_standing', title: 'Portero (parado inicial)', description: 'El portero en su posición inicial antes del disparo.' },
    { key: 'keeper_flying', title: 'Portero (volando y atajando)', description: 'Imagen del portero cuando ataja el balón.' },
    { key: 'keeper_miss', title: 'Portero (volando sin atajar)', description: 'Imagen del portero cuando se lanza pero no ataja (gol).' },
];

const minesAssets = [
    { key: 'gem', title: 'Imagen de la Gema', description: 'La imagen que aparece al encontrar una casilla segura.' },
    { key: 'mine', title: 'Imagen de la Mina', description: 'La imagen de la bomba que termina el juego.' },
];

// Helper function to ensure only serializable string values are passed from Server to Client Components
const sanitizeAssets = (assets: Record<string, unknown>): Record<string, string> => {
    const sanitized: Record<string, string> = {};
    for (const key in assets) {
        if (typeof assets[key] === 'string') {
            sanitized[key] = assets[key] as string;
        }
    }
    return sanitized;
};

export default async function AdminGameAssetsPage() {
    const currentPenaltyAssetsData = await getPenaltyGameAssets();
    const currentMinesAssetsData = await getMinesGameAssets();
    const lobbyAssetsData = await getLobbyAssets();

    const currentPenaltyAssets = sanitizeAssets(currentPenaltyAssetsData);
    const currentMinesAssets = sanitizeAssets(currentMinesAssetsData);
    const sanitizedLobbyAssets = sanitizeAssets(lobbyAssetsData);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Recursos de Juegos</h1>

            <LobbyAssetsForm currentImages={sanitizedLobbyAssets} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Juego: Tanda de Penales</CardTitle>
                    <CardDescription>
                       Gestiona las imágenes utilizadas en el juego de penales. Sube archivos PNG con fondo transparente para mejores resultados.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {penaltyAssets.map(asset => (
                        <AssetUploadForm 
                            key={asset.key}
                            assetKey={asset.key}
                            gameType="penalty_shootout"
                            title={asset.title}
                            description={asset.description}
                            currentImageUrl={currentPenaltyAssets[asset.key] || null}
                        />
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Juego: Campo Minado</CardTitle>
                    <CardDescription>
                       Gestiona las imágenes para el juego de minas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {minesAssets.map(asset => (
                        <AssetUploadForm 
                            key={asset.key}
                            assetKey={asset.key}
                            gameType="mines"
                            title={asset.title}
                            description={asset.description}
                            currentImageUrl={currentMinesAssets[asset.key] || null}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
