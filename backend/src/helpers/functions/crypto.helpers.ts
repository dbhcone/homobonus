import config from 'config';
const aes256 = require('aes256');

const key = config.get('PASSPHRASE');
const cipher = aes256.createCipher(key);

const encryptedPlainText = (plainText: string): string => {
    return cipher.encrypt(plainText);
};

const decryptedPlainText = (encryptedPlainText: string): string => {
    return cipher.decrypt(encryptedPlainText);
};

const encryptedBuffer = (plainText: string) => {
    const buffer = Buffer.from(plainText);
    return cipher.encrypt(buffer);
};

const decryptedBuffer = (encryptedBuffer: Buffer): Buffer => {
    return cipher.decrypt(encryptedBuffer);
};

const decryptedBufferPlain = (encryptedBuffer: Buffer) => {
    const decrypted_buffer = decryptedBuffer(encryptedBuffer);
    return decrypted_buffer.toString('utf8');
};

export {
    encryptedBuffer,
    encryptedPlainText,
    decryptedBuffer,
    decryptedBufferPlain,
    decryptedPlainText,
};
