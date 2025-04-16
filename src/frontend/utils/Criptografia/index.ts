import { setCookie } from 'cookies-next';
import crypto from 'crypto';

const KEY_COOKIES = `${process.env.NEXT_PUBLIC_KEY_COOKIES}`; // 64 caracteres hexadecimais (32 bytes)
const IV_LENGTH = 16; // Para aes-256-cbc, o IV deve ter 16 bytes

// Função para gerar um IV aleatório
function generateIv() {
    return crypto.randomBytes(IV_LENGTH);
}

// Função para criptografar dados
export function encrypt(data: object): string {
    const jsonData = JSON.stringify(data);
    const iv = generateIv(); // Gerar um IV aleatório

    // Corrigido: convertendo a chave corretamente para um Buffer (base hex)
    const keyBuffer = Buffer.from(KEY_COOKIES, 'hex');

    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv); // Usando o IV gerado


    let encrypted = cipher.update(jsonData, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Concatenar o IV com os dados criptografados para que possamos usar o mesmo IV para a descriptografia
    return iv.toString('hex') + ':' + encrypted;
}

// Função para descriptografar dados
export function decrypt(encryptedData: string): object {
    // Separar o IV dos dados criptografados
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    // Corrigido: convertendo a chave corretamente para um Buffer (base hex)
    const keyBuffer = Buffer.from(KEY_COOKIES, 'hex');

    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
}

export function setEncryptedCookie(name: string, data: any) {
    const encryptedData = encrypt(data);  // Criptografa os dados
    setCookie(name, encryptedData);    // Define o cookie com dados criptografados por 1 dia
}
