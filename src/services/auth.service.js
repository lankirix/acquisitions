import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing password: ${e}`);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error('Error comparing password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info(`User ${newUser[0].email} created successfully`);
    return newUser[0];
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw e;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    // Find user by email
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      throw new Error('User not found');
    }

    const user = result[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    logger.info(`User ${user.email} authenticated successfully`);
    return userWithoutPassword;
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw e;
  }
};
