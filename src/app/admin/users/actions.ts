
'use server';

import { db } from '@/lib/firebase';
import { collection, doc, getDocs, orderBy, query, updateDoc, Timestamp, writeBatch, increment } from 'firebase/firestore';
import type { UserProfile, UserRole } from '@/contexts/auth-context';
import { revalidatePath } from 'next/cache';

export async function getUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  
  try {
    const snapshot = await getDocs(q);
    const users: UserProfile[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt;

      // Convert Timestamp to a plain object
      let serializableCreatedAt: { seconds: number; nanoseconds: number; } | null = null;
      if (createdAt instanceof Timestamp) {
        serializableCreatedAt = {
          seconds: createdAt.seconds,
          nanoseconds: createdAt.nanoseconds,
        };
      } else if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt && 'nanoseconds' in createdAt) {
        serializableCreatedAt = createdAt as { seconds: number; nanoseconds: number; };
      }
      
      users.push({
        ...data,
        createdAt: serializableCreatedAt,
      } as UserProfile);
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}


export async function updateUserRole(userId: string, newRole: UserRole) {
    if (!userId || !newRole) {
        throw new Error('ID de usuario y nuevo rol son requeridos.');
    }
    
    // This should also be protected by Firestore security rules.

    const userDocRef = doc(db, 'users', userId);

    try {
        await updateDoc(userDocRef, {
            role: newRole
        });
        revalidatePath('/admin/users');
        return { success: true, message: 'Rol de usuario actualizado correctamente.' };
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error('No se pudo actualizar el rol del usuario.');
    }
}

export async function addBalanceToUser(userId: string, amount: number) {
    if (!userId || !amount) {
        throw new Error('El ID de usuario y el monto son requeridos.');
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('El monto debe ser un número positivo.');
    }

    const userDocRef = doc(db, 'users', userId);
    // Create a new document in a 'manual_deposits' collection for tracking
    const depositDocRef = doc(collection(db, 'manual_deposits'));

    // Use a batch to ensure both operations succeed or fail together
    const batch = writeBatch(db);

    batch.update(userDocRef, {
        balance: increment(parsedAmount)
    });

    batch.set(depositDocRef, {
        userId: userId,
        amount: parsedAmount,
        createdAt: Timestamp.now(),
        status: 'completed',
        type: 'manual_deposit',
        adminId: 'current_admin_id', // placeholder - in a real app you'd get the current admin's ID
    });

    try {
        await batch.commit();
        revalidatePath('/admin/users');
        revalidatePath('/wallet'); // Also revalidate user's wallet page
        return { success: true, message: `Se agregaron ${parsedAmount} al saldo del usuario.` };
    } catch (error) {
        console.error("Error adding balance to user:", error);
        throw new Error('No se pudo agregar el saldo al usuario.');
    }
}
