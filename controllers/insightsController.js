import { Scan } from '../models/Scan.js';

export const getInsights = async (req, res) => {
  try {
    // Risk distribution
    const riskDistribution = await Scan.aggregate([
      { $group: { _id: '$risk', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Disease trends
    const diseaseTrends = await Scan.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Yield statistics
    const yieldStats = await Scan.aggregate([
      { $group: { _id: '$yield', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Crop type distribution
    const cropDistribution = await Scan.aggregate([
      { $group: { _id: '$cropType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Location distribution
    const locationStats = await Scan.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average metrics
    const avgMetrics = await Scan.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$confidence' },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' }
        }
      }
    ]);

    // Monthly scans (last 6 months)
    const monthlyScan = await Scan.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      data: {
        riskDistribution,
        diseaseTrends,
        yieldStats,
        cropDistribution,
        locationStats,
        avgMetrics: avgMetrics.length > 0 ? avgMetrics[0] : {},
        monthlyScan
      }
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch insights'
    });
  }
};
