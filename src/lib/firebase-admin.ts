
import admin from 'firebase-admin';

// Reading environment variables for Firebase credentials
const projectId = process.env.FIREBASE_PROJECT_ID;

// Correctly parsing the private key by replacing an escaped backslash followed by 'n' with a single newline character.
// This is necessary because the .env file stores the private key with '\\n' instead of '\n'.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// Check if all necessary Firebase credentials are set
if (!projectId || !privateKey || !clientEmail) {
  throw new Error(
    "Firebase environment variables are not set. Please check your .env.local file."
  );
}

// Initialize the Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  });
}

// Export the initialized Firestore database instance and the admin SDK itself
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
