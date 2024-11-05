import axios from 'axios';
import { URL } from 'url';

class HostRateLimiter {
    constructor(options = {}) {
        this.limiters = new Map();
        this.options = {
            requestsPerSecond: options.requestsPerSecond || 5,
            maxConcurrentRequests: options.maxConcurrentRequests || 10
        };
        this.activeRequests = new Map();
    }

    async acquireToken(url) {
        const hostname = new URL(url).hostname;
        
        // Initialize active requests counter for this host
        if (!this.activeRequests.has(hostname)) {
            this.activeRequests.set(hostname, 0);
        }

        // Wait if we've hit the concurrent request limit
        while (this.activeRequests.get(hostname) >= this.options.maxConcurrentRequests) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Increment active requests
        this.activeRequests.set(hostname, this.activeRequests.get(hostname) + 1);
        
        // Add delay between requests to same host
        const delay = 1000 / this.options.requestsPerSecond;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    releaseToken(url) {
        const hostname = new URL(url).hostname;
        const current = this.activeRequests.get(hostname) || 0;
        if (current > 0) {
            this.activeRequests.set(hostname, current - 1);
        }
    }
}

/**
 * Validates if a URL points to an accessible image
 * @param {string} url - The URL to validate
 * @param {Object} options - Configuration options
 * @returns {Promise<boolean>} - Returns true if URL points to a valid image
 */
async function isValidImageUrl(url, options = {}) {
    const defaults = {
        timeout: 5000,
        debug: false,
        maxRetries: 2,
        requestsPerSecond: 5,
        maxConcurrentRequests: 10
    };

    options = { ...defaults, ...options };

    if (!url || typeof url !== 'string') {
        if (options.debug) console.log('Invalid URL format:', url);
        return false;
    }

    const rateLimiter = new HostRateLimiter(options);
    let retryCount = 0;

    const makeRequest = async () => {
        try {
            await rateLimiter.acquireToken(url);

            const response = await axios({
                method: 'HEAD',  // Only request headers, not the actual image
                url: url,
                timeout: options.timeout,
                maxRedirects: 5,
                headers: {
                    'Accept': 'image/*',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                validateStatus: status => status === 200
            });

            const contentType = response.headers['content-type']?.toLowerCase() || '';
            const isValidContentType = contentType.includes('image/') || 
                                     contentType.includes('application/octet-stream');

            if (options.debug) {
                console.log({
                    url,
                    status: response.status,
                    contentType,
                    isValid: isValidContentType
                });
            }

            return isValidContentType;

        } catch (error) {
            if (options.debug) {
                console.log('Request error:', {
                    url,
                    error: error.message,
                    attempt: retryCount + 1
                });
            }

            // Retry on specific errors
            if (retryCount < options.maxRetries && (
                error.code === 'ECONNABORTED' ||
                error.code === 'ETIMEDOUT' ||
                (error.response && error.response.status >= 500)
            )) {
                retryCount++;
                // Exponential backoff
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return makeRequest();
            }

            return false;
        } finally {
            rateLimiter.releaseToken(url);
        }
    };

    return makeRequest();
}

// Example usage for multiple URLs
async function validateMultipleUrls(urls) {
    const options = {
        debug: true,
        timeout: 5000,
        maxRetries: 2,
        requestsPerSecond: 5,
        maxConcurrentRequests: 10
    };

    const results = await Promise.all(
        urls.map(url => isValidImageUrl(url, options))
    );

    return urls.reduce((acc, url, index) => {
        acc[url] = results[index];
        return acc;
    }, {});
}

export default isValidImageUrl;