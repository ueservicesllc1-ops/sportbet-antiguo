
'use server';

import { db, storage } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

const ASSET_COLLECTION = 'game_assets';
const PENALTY_SHOOTOUT_DOC = 'penalty_shootout';
const CASINO_LOBBY_DOC = 'casino_lobby';
const MINES_DOC = 'mines';

export interface FormState {
    success: boolean;
    message: string;
    imageUrl?: string;
}

// --- GETTERS ---

async function getAssetsForGame(docId: string): Promise<Record<string, unknown>> {
    try {
        const docRef = doc(db, ASSET_COLLECTION, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return {};
    } catch (error) {
        console.error(`Error getting game assets for ${docId}:`, error);
        return {};
    }
}

export const getPenaltyGameAssets = async () => getAssetsForGame(PENALTY_SHOOTOUT_DOC);
export const getMinesGameAssets = async () => getAssetsForGame(MINES_DOC);
export const getLobbyAssets = async () => getAssetsForGame(CASINO_LOBBY_DOC);


// --- ACTIONS ---

export async function uploadGameAsset(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const assetKey = formData.get('assetKey') as string | null;
    const gameType = formData.get('gameType') as 'penalty_shootout' | 'mines';
    const imageFile = formData.get('assetImageFile') as File | null;

    if (!assetKey || !gameType) {
        return { success: false, message: 'Falta la clave del recurso (assetKey) o el tipo de juego (gameType).' };
    }
    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: 'No se proporcionó ningún archivo de imagen.' };
    }

    const documentMap: Record<typeof gameType, string> = {
        penalty_shootout: PENALTY_SHOOTOUT_DOC,
        mines: MINES_DOC,
    };
    const docId = documentMap[gameType];
    const storagePath = `game_assets/${gameType}/${assetKey}.png`;

    try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, imageFile, { contentType: imageFile.type });
        const downloadURL = await getDownloadURL(storageRef);

        // Save URL to Firestore
        const docRef = doc(db, ASSET_COLLECTION, docId);
        await setDoc(docRef, {
            [assetKey]: downloadURL,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        // Revalidate paths
        revalidatePath('/admin/game-assets');
        if (gameType === 'penalty_shootout') revalidatePath('/casino/penalty-shootout');
        if (gameType === 'mines') revalidatePath('/casino/mines');

        return {
            success: true,
            message: 'El recurso del juego se ha actualizado correctamente.',
            imageUrl: downloadURL,
        };

    } catch (error) {
        console.error('Error updating game asset:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `No se pudo actualizar el recurso: ${errorMessage}` };
    }
}

export async function updateLobbyAssets(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
    const urls: Record<string, string> = {};
    const assetsToUpdate = ['penalty_shootout', 'ruleta', 'speedrun', 'mines'];

    assetsToUpdate.forEach(key => {
        const url = formData.get(key) as string | null;
        if (url && url.startsWith('http')) {
            urls[key] = url;
        }
    });

    if (Object.keys(urls).length === 0) {
        return { success: false, message: 'No se proporcionaron URLs de imagen válidas para actualizar.' };
    }

    try {
        const docRef = doc(db, ASSET_COLLECTION, CASINO_LOBBY_DOC);
        await setDoc(docRef, { ...urls, lastUpdated: serverTimestamp() }, { merge: true });

        revalidatePath('/admin/game-assets');
        revalidatePath('/casino');
        
        return { success: true, message: 'Las imágenes del lobby se han actualizado.' };

    } catch (error) {
        console.error('Error updating lobby assets:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `No se pudo actualizar la imagen: ${errorMessage}` };
    }
}
