import jwt from 'jsonwebtoken';

import { validateToken } from './client';

describe('validateToken', () => {
    test('non expired date returns true', () => {
        const token = jwt.sign({data: 'foobar'}, 'foo', { expiresIn: 60 * 60 });
        const actual = validateToken(token);
        expect(actual).toBeTruthy();
    });

    test('expired date returns false', () => {
        const token = jwt.sign({data: 'foobar'}, 'foo', { expiresIn: -60 * 60 });
        const actual = validateToken(token);
        expect(actual).toBeFalsy();
    });  
 
    test('invalid token returns false', () => {
        const token = 'suspicious'
        const actual = validateToken(token);
        expect(actual).toBeFalsy();
    }); 
})


