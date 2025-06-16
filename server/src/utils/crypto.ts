// src/utils/crypto.ts

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = Buffer.from(process.env.API_KEY_ENCRYPTION_SECRET!, 'hex'); // Ensure this is a 32-byte key
const IV_LENGTH = 16; // For GCM, 16 bytes (128 bits) is standard

if (!process.env.API_KEY_ENCRYPTION_SECRET || SECRET_KEY.length !== 32) {
    throw new Error('Invalid API_KEY_ENCRYPTION_SECRET: Must be a 32-byte (64-character hex) string.');
}

/**
 * Encrypts a plaintext string (like a user ID).
 * The output format is "iv:authTag:encryptedData" in hex encoding.
 * @param text The plaintext to encrypt.
 * @returns The encrypted string, ready to be used as an API key.
 */
export const encryptUserId = (text: string): string => {
    // 1. Generate a unique Initialization Vector for each encryption
    const iv = crypto.randomBytes(IV_LENGTH);

    // 2. Create the cipher
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

    // 3. Encrypt the data
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    // 4. Get the authentication tag (ensures data integrity)
    const authTag = cipher.getAuthTag();

    // 5. Combine iv, authTag, and encrypted data into a single string
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypts an API key to get the original user ID.
 * @param apiKey The encrypted key in the format "iv:authTag:encryptedData".
 * @returns The original decrypted string (user ID).
 */
export const decryptUserId = (apiKey: string): string => {
    try {
        // 1. Split the key into its parts
        const parts = apiKey.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid API key format');
        }
        const [ivHex, authTagHex, encryptedHex] = parts;

        // 2. Convert parts from hex back to buffers
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');

        // 3. Create the decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        
        // 4. Set the authentication tag. This is crucial for verifying data integrity.
        decipher.setAuthTag(authTag);

        // 5. Decrypt the data
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption failed:', error);
        // Throw a specific error to be caught by authentication middleware
        throw new Error('Invalid or tampered API key.');
    }
};