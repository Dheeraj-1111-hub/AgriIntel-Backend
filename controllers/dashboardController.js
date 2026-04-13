import { Scan } from '../models/Scan.js';

export const getDashboard = async (req, res) => {
  try {
    // Get total scans
    const totalScans = await Scan.countDocuments();

    // Get high-risk count
    const highRiskCases = await Scan.countDocuments({ risk: 'High' });

    // Get top disease
    const topDiseaseData = await Scan.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topDisease = topDiseaseData.length > 0 ? topDiseaseData[0]._id : 'None';

    // Get recent scans (last 3)
    const recentScans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Calculate average yield (if numeric)
    const avgYieldData = await Scan.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$confidence' }
        }
      }
    ]);

    const avgConfidence = avgYieldData.length > 0 ? avgYieldData[0].avgConfidence.toFixed(2) : 0;

    // Count by risk level
    const riskCounts = await Scan.aggregate([
      { $group: { _id: '$risk', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalScans,
        highRiskCases,
        topDisease,
        avgConfidence,
        riskCounts,
        recentScans
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};
