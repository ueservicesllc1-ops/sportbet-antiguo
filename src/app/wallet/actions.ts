
'use server';

import { db } from '@/lib/firebase-admin'; // Firestore for data
import { s3Client, B2_BUCKET_NAME } from '@/lib/b2'; // B2 for files
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// --- NEW FUNCTION: Get User Balance ---
export async function getUserBalance(uid: string): Promise<{ balance: number }> {
    if (!uid) {
        console.error("Auth Error: UID is required to get balance.");
        return { balance: 0 };
    }

    try {
        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // If the user document doesn't exist, create it with a starting balance of 0
            await userDocRef.set({
                balance: 0,
                createdAt: FieldValue.serverTimestamp(),
            });
            return { balance: 0 };
        }

        const userData = userDoc.data();
        return { balance: userData?.balance || 0 };

    } catch (error) {
        console.error('Error fetching user balance:', error);
        return { balance: 0 }; // Return 0 on error
    }
}

// --- NEW FUNCTION: Update User Balance ---
export async function updateUserBalance(uid: string, amount: number) {
    if (!uid) {
        return { success: false, message: 'Error de autenticación.' };
    }

    if (isNaN(amount) || amount === 0) {
        return { success: false, message: 'El monto debe ser un número válido.' };
    }

    try {
        const userDocRef = db.collection('users').doc(uid);

        // Use a transaction to ensure atomic updates
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (!userDoc.exists) {
                // Optionally create the user doc if it doesn't exist
                 transaction.set(userDocRef, { balance: amount });
                 return;
            }
            
            const currentBalance = userDoc.data()?.balance || 0;
            const newBalance = currentBalance + amount;

            if (newBalance < 0) {
                throw new Error('No tienes fondos suficientes para realizar esta operación.');
            }

            transaction.update(userDocRef, { balance: newBalance });
        });

        revalidatePath('/wallet'); // Revalidate the wallet page to show the new balance
        revalidatePath('/'); // Revalidate home page if balance is shown there
        
        return { success: true, message: `¡Balance actualizado con éxito! Nuevo balance: ${await (await getUserBalance(uid)).balance}` };

    } catch (error) {
        console.error('Error updating balance:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        return { success: false, message: errorMessage };
    }
}


// --- EXISTING FUNCTION: KYC Verification ---
export async function submitVerificationRequest(prevState: unknown, formData: FormData) {
    console.log("--- [DEBUG] Starting Verification Request ---");
    console.log("[DEBUG] B2_BUCKET_NAME:", process.env.B2_BUCKET_NAME);
    console.log("[DEBUG] FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);

    const uid = formData.get('uid') as string | null;
    if (!uid) {
        console.error("[DEBUG] Auth Error: UID is null.");
        return { success: false, message: 'Error de autenticación. Inicia sesión de nuevo.' };
    }

    const idPhoto = formData.get('idPhoto') as File | null;
    if (!idPhoto || idPhoto.size === 0) {
        return { success: false, message: 'La foto de tu documento es requerida.' };
    }

    try {
        console.log("[DEBUG] Preparing file for upload...");
        const fileBuffer = Buffer.from(await idPhoto.arrayBuffer());
        const fileName = generateFileName();
        const fileExtension = idPhoto.name.split('.').pop() || 'jpg';
        const fileKey = `verifications/${uid}/${fileName}.${fileExtension}`;
        console.log("[DEBUG] Generated File Key for B2:", fileKey);

        const putCommand = new PutObjectCommand({
            Bucket: B2_BUCKET_NAME,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: idPhoto.type,
        });

        console.log("--- [DEBUG] Uploading to B2 --- ");
        await s3Client.send(putCommand);
        console.log("--- [DEBUG] B2 Upload Complete ---");

        const publicUrl = `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/${fileKey}`;
        console.log("[DEBUG] Constructed Public URL:", publicUrl);

        const verificationData = {
            userId: uid,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            photoUrl: publicUrl,
            status: 'pending' as const,
            createdAt: FieldValue.serverTimestamp(),
        };

        console.log("--- [DEBUG] Writing to Firestore --- ");
        const verificationRef = db.collection('verifications').doc();
        await verificationRef.set(verificationData);
        console.log("--- [DEBUG] Firestore Write Complete ---");

        const userDocRef = db.collection('users').doc(uid);
        await userDocRef.update({ verificationStatus: 'pending' });

        revalidatePath('/wallet');
        return { success: true, message: '¡Excelente! Tus datos han sido enviados y están en revisión.' };

    } catch (error) {
        console.error('--- [DEBUG] FULL ERROR ---', error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        return { success: false, message: `Error en el servidor: ${errorMessage}` };
    }
}
