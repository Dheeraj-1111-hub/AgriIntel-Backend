import { Scan } from '../models/Scan.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const scans = await Scan.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history'
    });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const scan = await Scan.findOne({ _id: req.params.id, userId });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      data: scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan details'
    });
  }
};

export const deleteScan = async (req, res) => {
  try {
    const userId = req.user.id;
    const scan = await Scan.findOneAndDelete({ _id: req.params.id, userId });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete scan'
    });
  }
};
