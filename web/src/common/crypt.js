// import CryptoJS from 'crypto-js/crypto-js'
//
// /**
//  * iv 是密钥偏移量，这个一般是接口返回的，或者前后端协定一致。
//  *由于对称解密使用的算法是 AES-128-CBC算法，数据采用 PKCS#7 填充 ， 因此这里的 key 需要为16位
//  */
// //16位16进制数作为密钥
// const KEY = CryptoJS.enc.Utf8.parse('1234123412ABCDEF')
// const IV = CryptoJS.enc.Utf8.parse('ABCDEF1234123412')
// /**
//  * AES加密 ：字符串 key iv  返回base64
//  */
// export function encrypt(word) {
//     let key = KEY
//     let iv = IV
//     const srcs = CryptoJS.enc.Utf8.parse(word)
//     let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding
//     })
//     return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
// }
// /**
//  * AES 解密 ：字符串 key iv  返回base64
//  *
//  */
// export function decrypt(word) {
//     let key = KEY
//     let iv = IV
//     const base64 = CryptoJS.enc.Base64.parse(word)
//     const src = CryptoJS.enc.Base64.stringify(base64)
//     let decrypt = CryptoJS.AES.decrypt(src, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding
//     })
//     let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
//     return decryptedStr.toString()
// }
//
import cryptoJs from 'crypto-js/crypto-js'

const key = cryptoJs.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = cryptoJs.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

//密码加密
export function encrypt(password) {
    let string = cryptoJs.enc.Utf8.parse(password);
    let encrypted = cryptoJs.AES.encrypt(string, key, { iv: iv, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

//密码解密
export function decrypt(password) {
    let encryptedHexStr = cryptoJs.enc.Hex.parse(password);
    let string = cryptoJs.enc.Base64.stringify(encryptedHexStr);
    let decrypt = cryptoJs.AES.decrypt(string, key, { iv: iv, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(cryptoJs.enc.Utf8);
    return decryptedStr.toString();
}
