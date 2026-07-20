import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

// Helper to sanitize user object (exclude passwordHash)
const sanitizeUser = (user: any) => {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Registration Error',
        message: 'A user with this email address already exists',
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
    });

    // Generate JWT Token
    const token = generateToken(newUser.id);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred during user registration',
    });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT Token
    const token = generateToken(user.id);

    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred during login',
    });
  }
};

// Get Current User Profile (/me)
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request context',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User account not found',
      });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while fetching user profile',
    });
  }
};
