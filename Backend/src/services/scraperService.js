const logger = require('../utils/logger.js');

class ScraperService {
  /**
   * Scrape and extract text content from a job posting URL
   * @param {string} targetUrl - URL of the job posting
   * @returns {Promise<{ text: string, title?: string, company?: string, url: string }>}
   */
  async scrapeJobUrl(targetUrl) {
    if (!targetUrl || typeof targetUrl !== 'string') {
      throw new Error('A valid URL is required.');
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid URL protocol. Must start with http:// or https://');
      }
    } catch {
      throw new Error('Invalid URL format provided.');
    }

    try {
      const response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000), // 10-second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page (HTTP ${response.status}: ${response.statusText})`);
      }

      const html = await response.text();

      // Attempt parsing using cheerio if available, or regex fallback
      let cleanText = '';
      let pageTitle = '';
      let company = '';

      try {
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);

        // Remove scripts, styles, noscript, svg, nav, footer, ads
        $('script, style, noscript, svg, nav, footer, header, iframe, [role="banner"], [role="navigation"]').remove();

        // Try to extract title
        pageTitle = $('meta[property="og:title"]').attr('content') ||
          $('meta[name="twitter:title"]').attr('content') ||
          $('title').text().trim() || '';

        // Try to extract company/site name
        company = $('meta[property="og:site_name"]').attr('content') ||
          $('meta[name="author"]').attr('content') || '';

        // Look for common job description containers
        const jobSelectors = [
          '[data-automation="jobDescription"]',
          '.job-description',
          '#job-description',
          '.description',
          '.show-more-less-html__markup', // LinkedIn public
          '#jobDescriptionText', // Indeed
          '.job__description',
          '[class*="jobDescription"]',
          '[class*="job-details"]',
          'article',
          'main',
          'body'
        ];

        for (const selector of jobSelectors) {
          const el = $(selector);
          if (el.length > 0) {
            const extracted = el.text().trim();
            if (extracted.length > 200) {
              cleanText = extracted;
              break;
            }
          }
        }

        if (!cleanText) {
          cleanText = $('body').text().trim();
        }
      } catch (cheerioErr) {
        // Fallback regex cleaning
        cleanText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ');
      }

      // Collapse extra whitespaces and newlines
      cleanText = cleanText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n')
        .replace(/[ \t]+/g, ' ');

      if (cleanText.length < 50) {
        throw new Error(
          'Could not extract meaningful job text from this URL. The page might require authentication or JavaScript rendering. Please paste the job description manually.'
        );
      }

      // Cap text to avoid overwhelming AI context window (max ~8000 chars is plenty for JD)
      if (cleanText.length > 8000) {
        cleanText = cleanText.substring(0, 8000) + '...';
      }

      return {
        text: cleanText,
        title: pageTitle.replace(/\s*[-–|].*$/, '').trim() || 'Scraped Role',
        company: company || '',
        url: targetUrl,
      };
    } catch (err) {
      logger.error('Scraper Service Error:', err);
      throw new Error(`Failed to scrape job URL: ${err.message}`);
    }
  }
}

module.exports = new ScraperService();
