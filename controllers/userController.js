import { User } from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    // Get current authenticated user
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user settings',
      message: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, location, preferredCrops, units } = req.body;

    // Update current authenticated user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(location && { location }),
        ...(preferredCrops && { preferredCrops }),
        ...(units && { units }),
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User settings updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user settings',
      message: error.message
    });
  }
};
