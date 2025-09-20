"use server";

import * as admin from "firebase-admin";
import { getApps, cert } from "firebase-admin/app";
import fs from "fs";
import path from "path";

// This function ensures that Firebase Admin is initialized only once.
export async function getFirebaseAdmin() {
  if (!getApps().length) {
    const serviceAccountPath = path.resolve("./firebase-admin-sdk.json");

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf8")
      );

      try {
        admin.initializeApp({
          credential: cert(serviceAccount),
          storageBucket: "studio-3302383355-1ea39.firebasestorage.app",
        });
      } catch (error) {
        console.error("Firebase admin initialization error", error);
      }
    } else {
      console.error(
        "Firebase service account file not found at",
        serviceAccountPath
      );
      console.log(
        "Please make sure the firebase-admin-sdk.json file exists in the root of your project."
      );
    }
  }
  return admin;
}