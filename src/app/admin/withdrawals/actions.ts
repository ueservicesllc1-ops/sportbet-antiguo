
'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

const WELCOME_BONUS = 100;

export async function requestWithdrawal(userId: string, amount: number) {
    if (!userId || !amount || amount <= 0) {
        throw new Error('Datos de solicitud de retiro inválidos.');
    }

    const userDocRef = db.collection('users').doc(userId);
    const withdrawalRef = db.collection('withdrawals');

    try {
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            throw new Error('Usuario no encontrado.');
        }

        const userData = userDoc.data();
        if (!userData) {
             throw new Error('No se encontraron datos de usuario.');
        }
        const withdrawableBalance = Math.max(0, userData.balance - WELCOME_BONUS);

        if (amount > withdrawableBalance) {
            throw new Error('El monto solicitado excede el saldo retirable.');
        }
        
        await withdrawalRef.add({
            userId: userId,
            userEmail: userData.email,
            amount: amount,
            status: 'pending',
            requestedAt: FieldValue.serverTimestamp(),
        });

        revalidatePath('/admin/withdrawals');
        
        return { success: true };

    } catch(e: unknown) {
        console.error("Error requesting withdrawal:", e);
        if (e instanceof Error) {
            throw e;
        }
        throw new Error('An unexpected error occurred while requesting withdrawal.');
    }
}


export async function processWithdrawal(requestId: string, action: 'approve' | 'reject') {
    if (!requestId || !action) {
        throw new Error('ID de solicitud y acción son requeridos.');
    }
    
    const requestDocRef = db.collection('withdrawals').doc(requestId);

    try {
        await db.runTransaction(async (transaction) => {
            const requestDoc = await transaction.get(requestDocRef);

            if (!requestDoc.exists || requestDoc.data()?.status !== 'pending') {
                throw new Error('La solicitud no existe o ya ha sido procesada.');
            }

            const requestData = requestDoc.data();
            if (!requestData) {
                 throw new Error('No se encontraron datos en la solicitud.');
            }

            const { userId, amount } = requestData;
            const newStatus = action === 'approve' ? 'approved' : 'rejected';

            transaction.update(requestDocRef, {
                status: newStatus,
                processedAt: FieldValue.serverTimestamp(),
            });

            if (action === 'approve') {
                const userDocRef = db.collection('users').doc(userId);
                transaction.update(userDocRef, {
                    balance: FieldValue.increment(-amount)
                });
            }
        });

        revalidatePath('/admin/withdrawals');
        revalidatePath('/wallet');

    } catch (error) {
        console.error("Error processing withdrawal:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('No se pudo procesar la solicitud de retiro.');
    }
}


export async function submitDepositNotification(prevState: unknown, formData: FormData): Promise<{ success: boolean; message: string; }> {
    const userId = formData.get('userId') as string;
    const userEmail = formData.get('userEmail') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const reference = formData.get('reference') as string;
    const notes = formData.get('notes') as string;

    if (!userId || !userEmail || !amount || !reference) {
        return { success: false, message: 'Faltan datos. El monto y la referencia son obligatorios.' };
    }
     if (amount <= 0) {
        return { success: false, message: 'El monto debe ser un número positivo.' };
    }

    try {
        const notificationsRef = db.collection('deposit_notifications');
        await notificationsRef.add({
            userId,
            userEmail,
            amount,
            reference,
            notes,
            status: 'pending',
            createdAt: FieldValue.serverTimestamp()
        });

        revalidatePath('/admin/deposits');
        return { success: true, message: 'Tu notificación ha sido enviada. El administrador la revisará pronto.' };

    } catch (error) {
        console.error('Error submitting deposit notification:', error);
        return { success: false, message: 'Ocurrió un error al enviar la notificación.' };
    }
}
