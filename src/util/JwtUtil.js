import * as jose from 'jose'

const header = { alg: 'HS256', enc: 'A128CBC-HS256' }
const expirationTime = '48h'

function encodeText(text) {
    return new TextEncoder().encode(text)
}

export async function encode(jsonObject, secret) {
    return new jose.SignJWT(jsonObject)
        .setProtectedHeader(header)
        .setExpirationTime(expirationTime)
        .sign(encodeText(secret))
}

export async function decrypt(jwt, secret) {
    const {payload} = await jose.jwtDecrypt(jwt, encodeText(secret))
    return payload
}

export async function verify(jwt, secret) {
    const { payload } = await jose.jwtVerify(jwt, encodeText(secret))
    return payload
}