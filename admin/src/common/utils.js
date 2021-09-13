export const URL = 'http:'+ '//' + window.location.host.toString().split(':')[0] + ':3000'

import {verify} from 'jsonwebtoken'
export function verifyToken (token,callback) {

    verify(token,'administrator',callback)
}