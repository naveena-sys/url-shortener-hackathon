import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    ip: {
      type: String,
      default: 'unknown',
    },
    country: {
      type: String,
      default: 'unknown',
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
    },
    browser: {
      type: String,
      default: 'unknown',
    },
    os: {
      type: String,
      default: 'unknown',
    },
    referer: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for time-sorted analytics queries
visitSchema.index({ urlId: 1, createdAt: -1 });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;