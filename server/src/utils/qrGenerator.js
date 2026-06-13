import QRCode from 'qrcode';

/**
 * Generates a base64 PNG data URL for the given text.
 */
const generateQRCode = async (text, options = {}) => {
  const opts = {
    type: 'image/png',
    quality: 0.92,
    margin: 2,
    width: 256,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    ...options,
  };

  try {
    return await QRCode.toDataURL(text, opts);
  } catch (err) {
    throw new Error(`QR generation failed: ${err.message}`);
  }
};

/**
 * Generates an SVG string for the given text.
 */
const generateQRCodeSVG = async (text) => {
  try {
    return await QRCode.toString(text, { type: 'svg' });
  } catch (err) {
    throw new Error(`QR SVG generation failed: ${err.message}`);
  }
};

export { generateQRCode, generateQRCodeSVG };