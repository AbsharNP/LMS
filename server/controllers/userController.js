import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ delete_status: '0' })
      .select('-password -token')
      .sort({ created_at: -1 });

    return res.json({ users });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch users',
      error: err.message,
      toast: {
        message: 'Unable to fetch users',
        tone: 'error',
      },
    });
  }
};
