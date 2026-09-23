const logger = require('../utils/logger.js');

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
    const headers = {
      'User-Agent': 'Kaizen-AI-Resume-Optimizer',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });

      if (userRes.status === 404) {
        throw new Error(`GitHub user "@${cleanUser}" not found.`);
      }

      if (!userRes.ok) {
        throw new Error(`GitHub API error (HTTP ${userRes.status}: ${userRes.statusText})`);
      }

      const userData = await userRes.json();

      // 2. Fetch user repositories (sorted by stars or update time)
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=pushed&per_page=20&type=owner`,
        {
          headers,
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!reposRes.ok) {
        throw new Error(`Failed to fetch repositories for @${cleanUser}`);
      }

      const reposData = await reposRes.json();

      // Filter and map repos
      const repositories = reposData
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

      return {
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
    } catch (err) {
      logger.error('GitHub Service Error:', err);
      throw new Error(err.message || 'Failed to fetch GitHub data');
    }
  }
}

module.exports = new GitHubService();
