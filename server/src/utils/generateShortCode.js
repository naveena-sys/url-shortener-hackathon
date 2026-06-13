import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

/**
 * Generates a unique 6-character alphanumeric short code.
 * Retries up to 10 times to avoid (extremely rare) collisions.
 */
const generateShortCode = async (length = 6) => {
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = nanoid(length);
    const existing = await Url.findOne({ shortCode: code });
    if (!existing) isUnique = true;
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Could not generate a unique short code. Please try again.');
  }

  return code;
};

export default generateShortCode;