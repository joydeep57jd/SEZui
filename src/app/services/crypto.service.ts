import { Injectable } from '@angular/core';
import { AES, enc, } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  readonly SECRET_KEY = enc.Utf8.parse('1234567890123456');
  readonly iv = enc.Utf8.parse('1234567890123456');

  encrypt<T>(message: string | number | T[] | Record<string, T>) {
    const cipherText = AES.encrypt(JSON.stringify(message), this.SECRET_KEY, {
      iv: this.iv,
    }).toString();
    return cipherText;
  }

  decrypt(cipherText: string) {
    var bytes = AES.decrypt(cipherText, this.SECRET_KEY, {
      iv: this.iv,
    });
    var decryptedData = JSON.parse(bytes.toString(enc.Utf8));
    return decryptedData;
  }
}
