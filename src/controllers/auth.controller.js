import { signupSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import { findUserByEmail, createUser } from '#services/user.service.js';
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

    const user = await createUser({ name, email, role, password,role });

    const token = jwttoken.sign({ id: newUser.id, email: newUser.email,role: newUser.role });

    cookies.set(res,'token',token);

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