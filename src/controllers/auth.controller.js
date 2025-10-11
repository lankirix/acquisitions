import { signupSchema, SignInSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { findUserByEmail } from '#services/user.service.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const signup = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, role, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    // Create user
    const newUser = await createUser({ name, email, role, password });

    const token = jwttoken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    cookies.set(res, 'token', token);

    // Log the registration event
    logger.info(`User registered successfully: ${email}`);

    // Send response
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);
    if (e.message) {
      logger.error(`Error details: ${e.message}`);
    }
    next(e);
  }
};

export const signin = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = SignInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    // Authenticate user
    const user = await authenticateUser(email, password);

    // Generate JWT token
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set secure cookie
    cookies.set(res, 'token', token);

    // Log the signin event
    logger.info(`User signed in successfully: ${email}`);

    // Send response
    return res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signin error', e);

    // Handle specific authentication errors
    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    if (e.message) {
      logger.error(`Error details: ${e.message}`);
    }
    next(e);
  }
};

export const signout = async (req, res, next) => {
  try {
    // Clear the authentication cookie
    cookies.clear(res, 'token');

    // Log the signout event
    logger.info('User signed out successfully');

    // Send response
    return res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    logger.error('Signout error', e);
    if (e.message) {
      logger.error(`Error details: ${e.message}`);
    }
    next(e);
  }
};
