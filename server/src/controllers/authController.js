import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// ─── POST /api/auth/signup ──────────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // passwordHash field — pre-save hook will bcrypt this
    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user,
    });
  } catch (error) {
  console.error('SIGNUP ERROR:', error);

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack
  });
}
};

// ─── POST /api/auth/login ───────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Must explicitly select passwordHash — it has select:false
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: user.toJSON(), // strips passwordHash
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};