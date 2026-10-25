const logger = require('../utils/logger.js');

// Fast in-memory cache to avoid consuming GitHub API limits for repeated requests
const userCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

class GitHubService {
  /**
   * Fetch GitHub public user profile and repositories
   * @param {string} username - GitHub username
   * @returns {Promise<{ profile: object, repositories: Array }>}
   */
  async fetchUserRepos(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('GitHub username is required.');
    }

    const cleanUser = username.trim().replace(/^@/, '');
    if (!cleanUser || !/^[a-zA-Z0-9\-_]+$/.test(cleanUser)) {
      throw new Error('Invalid GitHub username format. Use letters, numbers, and hyphens only.');
    }

    // 1. Check in-memory cache
    const cacheKey = cleanUser.toLowerCase();
    const cached = userCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      logger.info(`Serving GitHub data for @${cleanUser} from in-memory cache`);
      return cached.data;
    }

    const headers = {
      'User-Agent': 'Kaizen-AI-Resume-Optimizer',
      Accept: 'application/vnd.github.v3+json',
    };

    const token = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : '';
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') || token.startsWith('token ')
        ? token
        : `token ${token}`;
    }

    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });

      if (userRes.status === 404) {
        throw new Error(`GitHub user "@${cleanUser}" not found.`);
      }

      if (!userRes.ok) {
        const errorJson = await userRes.json().catch(() => ({}));
        const rateLimitRemaining = userRes.headers.get('x-ratelimit-remaining');
        const isRateLimited =
          userRes.status === 403 ||
          userRes.status === 429 ||
          rateLimitRemaining === '0' ||
          (errorJson.message && errorJson.message.toLowerCase().includes('rate limit'));

        if (isRateLimited) {
          if (!token) {
            throw new Error(
              `GitHub API rate limit exceeded on the server IP (60 requests/hour unauthenticated limit shared across cloud hosting). To fix this permanently, add a free GitHub Personal Access Token (GITHUB_TOKEN) in Backend/.env to unlock 5,000 requests/hour.`
            );
          } else {
            throw new Error(
              `GitHub API rate limit exceeded for the configured GITHUB_TOKEN. Please wait until the hourly quota resets or use a different token.`
            );
          }
        }

        throw new Error(errorJson.message || `GitHub API error (HTTP ${userRes.status}: ${userRes.statusText})`);
      }

      const userData = await userRes.json();

      // 2. Fetch user repositories (sorted by update time or stars)
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=pushed&per_page=30&type=owner`,
        {
          headers,
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!reposRes.ok) {
        const errorJson = await reposRes.json().catch(() => ({}));
        if (reposRes.status === 403 || reposRes.status === 429) {
          throw new Error(
            `GitHub repository rate limit reached. Please configure a free GITHUB_TOKEN in Backend/.env to raise your limit to 5,000 requests/hr.`
          );
        }
        throw new Error(errorJson.message || `Failed to fetch repositories for @${cleanUser}`);
      }

      const reposData = await reposRes.json();

      // Filter and map repos
      const repositories = (Array.isArray(reposData) ? reposData : [])
        .filter((repo) => !repo.fork) // prioritize original work
        .map((repo) => ({
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'No description provided',
          url: repo.html_url,
          homepage: repo.homepage || '',
          language: repo.language || 'Code',
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          topics: repo.topics || [],
          updatedAt: repo.pushed_at || repo.updated_at,
          defaultBranch: repo.default_branch,
        }))
        .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt) - new Date(a.updatedAt));

      const result = {
        profile: {
          username: userData.login,
          name: userData.name || userData.login,
          avatarUrl: userData.avatar_url,
          bio: userData.bio || '',
          publicRepos: userData.public_repos,
          followers: userData.followers,
          githubUrl: userData.html_url,
          location: userData.location || '',
        },
        repositories,
      };

      // Cache result for 30 minutes
      userCache.set(cacheKey, { timestamp: Date.now(), data: result });

      return result;
    } catch (err) {
      logger.error('GitHub Service Error:', err);
      throw new Error(err.message || 'Failed to fetch GitHub data');
    }
  }
}

module.exports = new GitHubService();
