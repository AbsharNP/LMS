import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
};

const buildUserResponse = (user, token = user.token) => {
  const name = user.name || [user.f_name, user.l_name].filter(Boolean).join(' ');

  return {
    id: user._id,
    name,
    f_name: user.f_name,
    l_name: user.l_name,
    email: user.email,
    role: user.role,
    token,
    created_at: user.created_at,
    created_by: user.created_by,
    delete_status: user.delete_status,
  };
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, role, created_by } = req.body;
    const nameParts = name?.trim().split(/\s+/) || [];
    const f_name = firstName || nameParts[0] || '';
    const l_name = lastName || nameParts.slice(1).join(' ') || '';
    const fullName = [f_name, l_name].filter(Boolean).join(' ');

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      f_name,
      l_name,
      email,
      password: hashedPassword,
      role,
      created_by,
    });
    const token = generateToken(user);

    user.token = token;
    await user.save();

    return res.status(201).json({
      message: 'User created successfully',
      success: true,
      token,
      user: buildUserResponse(user, token),
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to create user',
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email, delete_status: '0' });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isHashedPassword = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    const isPasswordValid = isHashedPassword
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (!isHashedPassword) {
      user.password = await bcrypt.hash(password, 10);
    }

    const token = generateToken(user);
    user.token = token;
    await user.save();

    return res.json({
      message: 'Login successful',
      success: true,
      token,
      user: buildUserResponse(user, token),
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to login',
      error: err.message,
    });
  }
};
