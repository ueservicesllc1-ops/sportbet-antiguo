
'use server';

import { s3Client, B2_BUCKET_NAME } from '@/lib/b2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Función para generar un nombre de archivo único y seguro
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

/**
 * Acción de servidor para subir un archivo a Backblaze B2.
 * Esta es una acción simple y aislada para propósitos de prueba y depuración.
 */
export async function uploadFile(prevState: any, formData: FormData) {
  const file = formData.get('file') as File | null;

  // 1. Validación del archivo
  if (!file || file.size === 0) {
    return { success: false, message: 'Por favor, selecciona un archivo.' };
  }

  try {
    // 2. Preparar el archivo para la subida
    console.log(`[SimpleUploader] Preparando archivo: ${file.name}`);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = generateFileName(); // Nombre único para evitar colisiones
    const fileExtension = file.name.split('.').pop() || 'unknown';
    const fileKey = `simple-uploads/${fileName}.${fileExtension}`;

    // 3. Crear y enviar el comando de subida a B2
    const putCommand = new PutObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    });

    console.log(`[SimpleUploader] Subiendo a B2 con la clave: ${fileKey}`);
    await s3Client.send(putCommand);

    // 4. Construir la URL pública y devolver éxito
    const publicUrl = `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/${fileKey}`;
    console.log(`[SimpleUploader] Archivo subido con éxito: ${publicUrl}`);

    revalidatePath('/'); // Opcional: revalidar la página si se muestra una lista de archivos
    return { success: true, message: `¡Éxito! URL: ${publicUrl}` };

  } catch (error) {
    // 5. Manejo de errores
    console.error('[SimpleUploader] Error en la subida:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
    return { success: false, message: `Error del servidor: ${errorMessage}` };
  }
}
