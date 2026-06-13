import mongoose from 'mongoose';

const dailyStatSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
    },
    // Stored as YYYY-MM-DD string for simple range queries
    date: {
      type: String,
      required: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One document per URL per day
dailyStatSchema.index({ urlId: 1, date: 1 }, { unique: true });

const DailyStat = mongoose.model('DailyStat', dailyStatSchema);
export default DailyStat;