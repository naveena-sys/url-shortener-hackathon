import { UAParser } from 'ua-parser-js';

/**
 * Parses a User-Agent string and returns device, browser, and OS.
 */
const parseUserAgent = (uaString = '') => {
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  let device = 'desktop';
  if (result.device.type === 'mobile') device = 'mobile';
  else if (result.device.type === 'tablet') device = 'tablet';
  else if (!result.device.type) device = 'desktop';
  else device = 'unknown';

  return {
    device,
    browser: result.browser.name || 'unknown',
    os: result.os.name || 'unknown',
  };
};

export default parseUserAgent;