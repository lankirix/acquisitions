import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-please-dont-forget-to-change-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw new Error('Failed to generate token');
        }
    },
    
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            throw new Error('Failed to authenticate token');
        }
    },
    
    decode: (token) => {
        try {
            return jwt.decode(token);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            throw new Error('Failed to decode token');
        }
    }
};