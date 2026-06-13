import Url from '../models/Url.js';
import Visit from '../models/Visit.js';
import DailyStat from '../models/DailyStat.js';
import generateShortCode from '../utils/generateShortCode.js';
import validateUrl from '../utils/validateUrl.js';
import parseUserAgent from '../utils/parseUserAgent.js';
import { generateQRCode } from '../utils/qrGenerator.js';

// ─── POST /api/urls ─────────────────────────────────────────────────────────
export const createUrl = async (req, res, next) => {
  try {
    const { longUrl, customAlias, expiresAt } = req.body;

    // Extra runtime URL check (on top of express-validator)
    if (!validateUrl(longUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL starting with http:// or https://',
      });
    }

    let shortCode;

    if (customAlias) {
      const aliasRegex = /^[a-zA-Z0-9-_]{3,30}$/;
      if (!aliasRegex.test(customAlias)) {
        return res.status(400).json({
          success: false,
          message:
            'Alias must be 3–30 characters: letters, numbers, hyphens, or underscores only.',
        });
      }

      const taken = await Url.findOne({ shortCode: customAlias });
      if (taken) {
        return res.status(409).json({
          success: false,
          message: 'This custom alias is already taken.',
        });
      }

      shortCode = customAlias;
    } else {
      shortCode = await generateShortCode();
    }

    const urlData = {
      userId: req.user._id,
      longUrl: longUrl.trim(),
      shortCode,
      customAlias: customAlias || null,
    };

    if (expiresAt) {
      const expiry = new Date(expiresAt);
      if (isNaN(expiry.getTime()) || expiry <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Expiry date must be a valid date in the future.',
        });
      }
      urlData.expiresAt = expiry;
    }

    const url = await Url.create(urlData);

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully.',
      url,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/urls ──────────────────────────────────────────────────────────
export const getUrls = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [urls, total] = await Promise.all([
      Url.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Url.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      urls,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/urls/:id ──────────────────────────────────────────────────────
export const getUrl = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found.' });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/urls/:id ────────────────────────────────────────────────────
export const updateUrl = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found.' });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { expiresAt } = req.body;

    if (expiresAt !== undefined) {
      if (expiresAt === null || expiresAt === '') {
        url.expiresAt = null;
      } else {
        const expiry = new Date(expiresAt);
        if (isNaN(expiry.getTime()) || expiry <= new Date()) {
          return res.status(400).json({
            success: false,
            message: 'Expiry date must be a valid future date.',
          });
        }
        url.expiresAt = expiry;
      }
    }

    await url.save();

    res.status(200).json({ success: true, message: 'URL updated.', url });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/urls/:id ───────────────────────────────────────────────────
export const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found.' });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Delete URL and all associated data in parallel
    await Promise.all([
      Url.deleteOne({ _id: url._id }),
      Visit.deleteMany({ urlId: url._id }),
      DailyStat.deleteMany({ urlId: url._id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'URL and all associated analytics deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/urls/:id/qr ───────────────────────────────────────────────────
export const getQRCode = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found.' });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
    const qrCode   = await generateQRCode(shortUrl);

    res.status(200).json({
      success: true,
      shortUrl,
      qrCode, // base64 PNG data URL
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /:shortCode (public redirect) ─────────────────────────────────────
export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode, isActive: true });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found.',
      });
    }

    if (url.isExpired()) {
      return res.status(410).json({
        success: false,
        message: 'This link has expired.',
        expiredAt: url.expiresAt,
      });
    }

    // Fire-and-forget visit logging — keeps redirect fast
    logVisit(url, req).catch((err) =>
      console.error('Visit log error:', err.message)
    );

    return res.redirect(302, url.longUrl);
  } catch (error) {
    next(error);
  }
};

// ─── Internal: log visit + update stats ────────────────────────────────────
const logVisit = async (url, req) => {
  const uaString = req.headers['user-agent'] || '';
  const { device, browser, os } = parseUserAgent(uaString);

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const referer =
    req.headers['referer'] || req.headers['referrer'] || null;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await Promise.all([
    Visit.create({ urlId: url._id, ip, device, browser, os, referer }),

    DailyStat.findOneAndUpdate(
      { urlId: url._id, date: today },
      { $inc: { clickCount: 1 } },
      { upsert: true, new: true }
    ),

    Url.findByIdAndUpdate(url._id, {
      $inc: { totalClicks: 1 },
      lastClickAt: new Date(),
    }),
  ]);
};