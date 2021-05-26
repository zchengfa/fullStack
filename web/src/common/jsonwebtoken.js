import jwt from 'jsonwebtoken'

export function verify(token,callback) {
    jwt.verify(token,'user',callback)
}
