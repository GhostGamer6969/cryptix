import * as CryptoJS from 'crypto-js';
import { createHash } from 'crypto';

export function encryptPassword(masterhash: string, pass: string, time: number): string {
    const keyInput = masterhash + time.toString();
    const key = CryptoJS.SHA256(keyInput).toString();

    const encrypted = CryptoJS.AES.encrypt(pass, key).toString();
    return encrypted;
}


export function decryptPassword(masterhash: string, encryptedPass: string, time: number): string {
    const keyInput = masterhash + time.toString();
    const key = CryptoJS.SHA256(keyInput).toString();

    const bytes = CryptoJS.AES.decrypt(encryptedPass, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted;
}
