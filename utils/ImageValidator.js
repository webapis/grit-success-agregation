import https from 'https';
import http from 'http';

/**
 * ImageValidator class provides methods to validate image URLs by checking their
 * accessibility and content type. It supports concurrent processing, automatic
 * referer extraction, and retry mechanisms for handling rate limits and timeouts.
 * 
 * @property {Array} #queue - Queue of image validation tasks.
 * @property {number} #processing - Number of currently processing tasks.
 * @property {number} #lastRequestTime - Timestamp of the last request made.
 * @property {string} #userAgent - User-Agent string used for HTTP requests.
 * 
 * @param {Object} [options={}] - Configuration options for the validator.
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds.
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts.
 * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds.
 * @param {number} [options.maxConcurrent=2] - Maximum number of concurrent requests.
 * @param {boolean} [options.autoReferer=true] - Whether to automatically extract referer from URL.
 * 
 * @method validateImage - Validates a single image URL.
 * @method validateMultipleImages - Validates multiple image URLs concurrently.
 * 
 * @private
 * @method #extractReferer - Extracts the referer from a given URL.
 * @method #processQueue - Processes the queue of image validation tasks.
 * @method #checkImage - Checks the validity of an image URL with retry logic.
 */
class ImageValidator {
  #queue = [];
  #processing = 0;
  #lastRequestTime = 0;
  #userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  constructor(options = {}) {
    this.options = {
      timeout: 5000,
      maxRetries: 3,
      retryDelay: 1000,
      maxConcurrent: 2,
      autoReferer: true, // New option to control auto referer
      ...options
    };
  }

  #extractReferer = (url) => {
    try {
      const urlObject = new URL(url);
      return urlObject.origin;
    } catch (error) {
      return ''; // Return empty string if URL parsing fails
    }
  };

  validateImage = async (url, customReferer = '') => {
    // Determine referer: use custom if provided, otherwise extract from URL if autoReferer is enabled
    const referer = customReferer || (this.options.autoReferer ? this.#extractReferer(url) : '');
    
    return new Promise((resolve) => {
      this.#queue.push({ url, referer, resolve });
      this.#processQueue();
    });
  };

  #processQueue = async () => {
    if (this.#processing >= this.options.maxConcurrent || this.#queue.length === 0) {
      return;
    }

    const timeSinceLastRequest = Date.now() - this.#lastRequestTime;
    if (timeSinceLastRequest < 500) {
      setTimeout(() => this.#processQueue(), 500 - timeSinceLastRequest);
      return;
    }

    const { url, referer, resolve } = this.#queue.shift();
    this.#processing++;
    this.#lastRequestTime = Date.now();

    try {
      const result = await this.#checkImage(url, referer);
      resolve(result);
    } catch (error) {
      resolve({ valid: false, error: error.message });
    } finally {
      this.#processing--;
      setTimeout(() => this.#processQueue(), 500);
    }
  };

  #checkImage = async (url, referer, retryCount = 0) => {
    const protocol = url.startsWith('https') ? https : http;
    
    try {
      const result = await new Promise((resolve, reject) => {
        const requestOptions = {
          method: 'GET',
          headers: {
            'User-Agent': this.#userAgent,
            'Range': 'bytes=0-1024',
            'Accept': 'image/*',
            ...(referer && { 'Referer': referer }),
          },
          timeout: this.options.timeout,
        };

        const req = protocol.get(url, requestOptions, (res) => {
          const { statusCode, headers } = res;
          res.destroy();

          if (statusCode === 429 && retryCount < this.options.maxRetries) {
            const delay = this.options.retryDelay * 2 ** retryCount;
            setTimeout(() => {
              resolve(this.#checkImage(url, referer, retryCount + 1));
            }, delay);
            return;
          }

          const contentType = headers['content-type'] ?? '';
          const contentLength = headers['content-length'];

          resolve({
            valid: statusCode === 200 && contentType.startsWith('image/'),
            statusCode,
            contentType,
            contentLength,
            url,
            referer: referer || null // Include used referer in response
          });
        });

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });

      return result;

    } catch (error) {
      if (retryCount < this.options.maxRetries) {
        const delay = this.options.retryDelay * 2 ** retryCount;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.#checkImage(url, referer, retryCount + 1);
      }
      throw error;
    }
  };

  validateMultipleImages = async (urls) => {
    return Promise.all(urls.map(url => this.validateImage(url)));
  };
}

export default ImageValidator;