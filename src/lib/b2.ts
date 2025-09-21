
import { S3Client } from '@aws-sdk/client-s3';

// 1. Read environment variables for Backblaze B2 connection.
const endpointUrl = process.env.B2_ENDPOINT_URL;
const region = process.env.B2_REGION || 'us-east-005';
const accessKeyId = process.env.B2_ACCESS_KEY_ID;
const secretAccessKey = process.env.B2_SECRET_ACCESS_KEY;

// 2. Validate that all necessary credentials are provided.
if (!endpointUrl || !accessKeyId || !secretAccessKey) {
  throw new Error(
    'B2/S3 credentials (endpoint, access key, secret key) are not fully set in environment variables. Please check your .env.local file.'
  );
}

// 3. **CRITICAL FIX**: Ensure the endpoint URL includes the protocol.
// The AWS S3 client requires a full URL (e.g., 'https://s3.us-east-005.backblazeb2.com').
// This prevents the 'Invalid URL' error.
const fullEndpoint = endpointUrl.startsWith('http') ? endpointUrl : `https://${endpointUrl}`;

// 4. Initialize the S3 client with the corrected endpoint and credentials.
export const s3Client = new S3Client({
  endpoint: fullEndpoint,
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// 5. Export the bucket name for use in server actions.
export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

if (!B2_BUCKET_NAME) {
  throw new Error('B2_BUCKET_NAME is not set in environment variables.');
}
