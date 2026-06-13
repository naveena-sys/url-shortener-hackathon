import Url from '../models/Url.js';
import Visit from '../models/Visit.js';
import DailyStat from '../models/DailyStat.js';

// ─── GET /api/analytics/:id ─────────────────────────────────────────────────
export const getUrlAnalytics = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found.' });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const urlObjectId = url._id;

    const [recentVisits, dailyStats, deviceBreakdown, browserBreakdown, osBreakdown] =
      await Promise.all([
        // 20 most recent visits
        Visit.find({ urlId: urlObjectId })
          .sort({ createdAt: -1 })
          .limit(20)
          .select('device browser os ip referer createdAt'),

        // Last 30 days of daily click counts
        DailyStat.find({ urlId: urlObjectId })
          .sort({ date: -1 })
          .limit(30)
          .select('date clickCount -_id'),

        // Device type breakdown
        Visit.aggregate([
          { $match: { urlId: urlObjectId } },
          { $group: { _id: '$device', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        // Browser breakdown (top 10)
        Visit.aggregate([
          { $match: { urlId: urlObjectId } },
          { $group: { _id: '$browser', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // OS breakdown (top 10)
        Visit.aggregate([
          { $match: { urlId: urlObjectId } },
          { $group: { _id: '$os', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

    // Reverse daily stats so chart data flows oldest → newest
    const chartData = [...dailyStats].reverse().map((d) => ({
      date: d.date,
      clicks: d.clickCount,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        url: {
          id: url._id,
          longUrl: url.longUrl,
          shortCode: url.shortCode,
          shortUrl: url.shortUrl,
          totalClicks: url.totalClicks,
          lastClickAt: url.lastClickAt,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
        },
        recentVisits,
        chartData,
        breakdown: {
          devices: deviceBreakdown.map((d) => ({
            name: d._id || 'unknown',
            count: d.count,
          })),
          browsers: browserBreakdown.map((b) => ({
            name: b._id || 'unknown',
            count: b.count,
          })),
          os: osBreakdown.map((o) => ({
            name: o._id || 'unknown',
            count: o.count,
          })),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/overview ────────────────────────────────────────────
export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const urls = await Url.find({ userId }).select(
      '_id totalClicks lastClickAt'
    );

    const urlIds     = urls.map((u) => u._id);
    const totalUrls  = urls.length;
    const totalClicks = urls.reduce((sum, u) => sum + u.totalClicks, 0);

    const lastClickAt = urls
      .filter((u) => u.lastClickAt)
      .sort((a, b) => new Date(b.lastClickAt) - new Date(a.lastClickAt))[0]
      ?.lastClickAt || null;

    // 30-day aggregated daily chart across all user URLs
    const today         = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const dailyAgg = await DailyStat.aggregate([
      {
        $match: {
          urlId: { $in: urlIds },
          date: { $gte: thirtyDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: '$date',
          clicks: { $sum: '$clickCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      overview: {
        totalUrls,
        totalClicks,
        lastClickAt,
        chartData: dailyAgg.map((d) => ({
          date: d._id,
          clicks: d.clicks,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};