import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const findUserByEmail = async (email) => {
    try {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database query failed');
    }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        const result = await db.insert(users).values({
            name,
            email,
            password,
            role,
        }).returning();
        
        return result[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
};

export const findUserById = async (id) => {
    try {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Error finding user by id:', error);
        throw new Error('Database query failed');
    }
};
