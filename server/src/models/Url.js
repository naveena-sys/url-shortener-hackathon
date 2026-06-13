import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    longUrl: {
      type: String,
      required: [true, 'Long URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customAlias: {
      type: String,
      default: null,
      trim: true,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    lastClickAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index: list a user's URLs sorted by creation date
urlSchema.index({ userId: 1, createdAt: -1 });

// Virtual: full short URL string
urlSchema.virtual('shortUrl').get(function () {
  return `${process.env.BASE_URL}/${this.shortCode}`;
});

// Instance method: check expiry
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

const Url = mongoose.model('Url', urlSchema);
export default Url;