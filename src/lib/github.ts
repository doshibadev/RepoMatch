import { Octokit } from '@octokit/rest';
import cacheManager from './cache';

interface SearchOptions {
  perPage?: number;
  page?: number;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
}

interface SearchResult {
  repositories: any[];
  total: number;
  hasMore: boolean;
}

interface RepositoryDetails {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  languages: Record<string, number>;
  topics: string[];
  goodFirstIssues: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  homepage: string;
  license: any;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
}

interface IssueOptions {
  labels?: string;
  state?: 'open' | 'closed' | 'all';
  perPage?: number;
}

class GitHubClient {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Search repositories using multi-strategy approach to find smaller repos
   */
  async searchRepositories(skills: string[], options: SearchOptions = {}): Promise<SearchResult> {
    const {
      perPage = 30,
      page = 1,
      sort = 'stars',
      order = 'desc'
    } = options;

    // Check cache first
    const cacheKey = { skills, perPage, page, sort, order };
    const cachedResult = await cacheManager.getSearchResults(skills, cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // Use multi-strategy search to find diverse repository sizes
      const searchResults = await this.multiStrategySearch(skills, perPage);
      
      const result = {
        repositories: searchResults,
        total: searchResults.length,
        hasMore: searchResults.length === perPage
      };

      // Cache the result
      await cacheManager.setSearchResults(skills, cacheKey, result);

      return result;
    } catch (error: any) {
      console.error('GitHub search error:', error);
      throw new Error(`GitHub search failed: ${error.message}`);
    }
  }

  /**
   * Multi-strategy search to find repositories of different sizes
   */
  private async multiStrategySearch(skills: string[], perPage: number): Promise<any[]> {
    const allRepos = new Map<string, any>();
    
    // Strategy 1: Recent activity search (finds smaller active repos)
    try {
      const recentRepos = await this.searchRecentRepositories(skills, Math.floor(perPage * 0.4));
      recentRepos.forEach(repo => allRepos.set(repo.full_name, repo));
    } catch (error) {
      console.warn('Recent search failed:', error);
    }

    // Strategy 2: Topic-based search with star limits (finds smaller repos with specific topics)
    try {
      const topicRepos = await this.searchTopicRepositories(skills, Math.floor(perPage * 0.3));
      topicRepos.forEach(repo => allRepos.set(repo.full_name, repo));
    } catch (error) {
      console.warn('Topic search failed:', error);
    }

    // Strategy 3: Language search with lower star thresholds (finds smaller language-specific repos)
    try {
      const languageRepos = await this.searchLanguageRepositories(skills, Math.floor(perPage * 0.3));
      languageRepos.forEach(repo => allRepos.set(repo.full_name, repo));
    } catch (error) {
      console.warn('Language search failed:', error);
    }

    // Convert to array and sort by stars (descending) to maintain some popularity balance
    const repos = Array.from(allRepos.values());
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

    return repos.slice(0, perPage);
  }

  /**
   * Search for recently active repositories
   */
  private async searchRecentRepositories(skills: string[], limit: number): Promise<any[]> {
    const languageSkills = skills.filter(skill => this.isLanguage(skill));
    const otherSkills = skills.filter(skill => !this.isLanguage(skill));

    let query = 'is:public';
    
    // Add language filters
    if (languageSkills.length > 0) {
      const languageQuery = languageSkills.map(lang => `language:${lang}`).join(' OR ');
      query += ` (${languageQuery})`;
    }
    
    // Add topic/keyword filters
    if (otherSkills.length > 0) {
      const topicQuery = otherSkills.map(skill => `"${skill}"`).join(' OR ');
      query += ` (${topicQuery})`;
    }

    // Sort by recently updated to find active smaller repos
    const response = await this.octokit.rest.search.repos({
      q: query,
      sort: 'updated',
      order: 'desc',
      per_page: limit * 2, // Get more to filter
    });

    // Filter for "goldilocks" repos - not too big, not too small
    return response.data.items.filter(repo => 
      repo.stargazers_count >= 10 && repo.stargazers_count < 5000
    );
  }

  /**
   * Search for repositories with specific topics and star limits
   */
  private async searchTopicRepositories(skills: string[], limit: number): Promise<any[]> {
    const otherSkills = skills.filter(skill => !this.isLanguage(skill));
    
    if (otherSkills.length === 0) return [];

    let query = 'is:public';
    
    // Add topic filters
    const topicQuery = otherSkills.map(skill => `topic:${skill}`).join(' OR ');
    query += ` (${topicQuery})`;

    const response = await this.octokit.rest.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit * 2,
    });

    // Filter for "goldilocks" repos with topics
    return response.data.items.filter(repo => 
      repo.stargazers_count >= 20 && repo.stargazers_count < 2000
    );
  }

  /**
   * Search for language-specific repositories with lower star thresholds
   */
  private async searchLanguageRepositories(skills: string[], limit: number): Promise<any[]> {
    const languageSkills = skills.filter(skill => this.isLanguage(skill));
    
    if (languageSkills.length === 0) return [];

    const allRepos = [];
    
    // Search each language separately with star limits
    for (const language of languageSkills.slice(0, 3)) { // Limit to 3 languages to avoid rate limits
      try {
        const query = `language:${language} stars:>50 stars:<2000`; // Focus on "goldilocks" repos
        
        const response = await this.octokit.rest.search.repos({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: Math.floor(limit / languageSkills.length),
        });

        allRepos.push(...response.data.items);
      } catch (error) {
        console.warn(`Language search failed for ${language}:`, error);
      }
    }

    return allRepos;
  }

  /**
   * Get detailed repository information
   */
  async getRepository(owner: string, repo: string): Promise<RepositoryDetails> {
    // Check cache first
    const cachedRepo = await cacheManager.getRepository(owner, repo);
    if (cachedRepo) {
      return cachedRepo;
    }

    try {
      const [repoData, languages, topics, issues] = await Promise.all([
        this.octokit.rest.repos.get({ owner, repo }),
        this.octokit.rest.repos.listLanguages({ owner, repo }),
        this.octokit.rest.repos.getAllTopics({ owner, repo }),
        this.octokit.rest.issues.listForRepo({
          owner,
          repo,
          state: 'open',
          labels: 'good first issue',
          per_page: 10
        })
      ]);

      const result = {
        ...repoData.data,
        languages: languages.data,
        topics: topics.data.names || [],
        goodFirstIssues: issues.data.length
      } as RepositoryDetails;

      // Cache the result
      await cacheManager.setRepository(owner, repo, result);

      return result;
    } catch (error: any) {
      console.error(`Error fetching repository ${owner}/${repo}:`, error);
      throw new Error(`Failed to fetch repository: ${error.message}`);
    }
  }

  /**
   * Search for issues with specific labels and aggregate by repository
   * This helps discover smaller but active repositories
   */
  async searchIssuesBySkills(skills: string[], options: SearchOptions = {}): Promise<SearchResult> {
    const {
      perPage = 30,
      page = 1
    } = options;

    // Check cache first
    const cacheKey = { skills, perPage, page, type: 'issues' };
    const cachedResult = await cacheManager.getSearchResults(skills, cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // Search for issues with good-first-issue or help-wanted labels
      const issueQuery = this.buildIssueSearchQuery(skills);
      
      const response = await this.octokit.rest.search.issuesAndPullRequests({
        q: issueQuery,
        sort: 'updated',
        order: 'desc',
        per_page: Math.min(perPage * 3, 100), // Get more issues to aggregate
        page,
      });

      // Aggregate issues by repository
      const repoMap = new Map<string, any>();
      
      for (const issue of response.data.items) {
        const repoFullName = issue.repository_url.split('/').slice(-2).join('/');
        
        if (!repoMap.has(repoFullName)) {
          // Create a repository object from the issue data
          const repo = {
            id: issue.repository?.id || 0,
            name: issue.repository?.name || '',
            full_name: repoFullName,
            description: issue.repository?.description || '',
            html_url: issue.repository?.html_url || '',
            stargazers_count: issue.repository?.stargazers_count || 0,
            forks_count: issue.repository?.forks_count || 0,
            language: issue.repository?.language || '',
            topics: issue.repository?.topics || [],
            open_issues_count: issue.repository?.open_issues_count || 0,
            updated_at: issue.repository?.updated_at || issue.updated_at,
            pushed_at: issue.repository?.pushed_at || issue.updated_at,
            created_at: issue.repository?.created_at || issue.created_at,
            goodFirstIssues: 0,
            license: issue.repository?.license,
            homepage: issue.repository?.homepage
          };
          
          repoMap.set(repoFullName, repo);
        }
        
        // Count good first issues
        const repo = repoMap.get(repoFullName);
        if (issue.labels.some(label => 
          label.name?.toLowerCase().includes('good-first-issue') ||
          label.name?.toLowerCase().includes('good first issue')
        )) {
          repo.goodFirstIssues++;
        }
      }

      const repositories = Array.from(repoMap.values()).slice(0, perPage);
      
      const result = {
        repositories,
        total: repositories.length,
        hasMore: response.data.items.length === perPage * 3
      };

      // Cache the result
      await cacheManager.setSearchResults(skills, cacheKey, result);

      return result;
    } catch (error: any) {
      console.error('GitHub issue search error:', error);
      throw new Error(`GitHub issue search failed: ${error.message}`);
    }
  }

  /**
   * Build search query for issues
   */
  private buildIssueSearchQuery(skills: string[]): string {
    const languageSkills = skills.filter(skill => this.isLanguage(skill));
    const otherSkills = skills.filter(skill => !this.isLanguage(skill));

    let query = 'is:issue is:open';
    
    // Add label filters
    query += ' label:"good-first-issue" OR label:"good first issue" OR label:"help-wanted"';
    
    // Add language filters
    if (languageSkills.length > 0) {
      const languageQuery = languageSkills.map(lang => `language:${lang}`).join(' OR ');
      query += ` (${languageQuery})`;
    }
    
    // Add topic/keyword filters
    if (otherSkills.length > 0) {
      const topicQuery = otherSkills.map(skill => `"${skill}"`).join(' OR ');
      query += ` (${topicQuery})`;
    }

    return query;
  }

  /**
   * Get trending repositories
   */
  async getTrendingRepositories(language: string = '', since: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<any[]> {
    // Check cache first
    const cachedTrending = await cacheManager.getTrendingRepositories(language, since);
    if (cachedTrending) {
      return cachedTrending;
    }

    const sinceDate = this.getSinceDate(since);
    const query = `created:>${sinceDate}${language ? ` language:${language}` : ''}`;
    
    try {
      const response = await this.octokit.rest.search.repos({
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 30
      });

      const result = response.data.items;

      // Cache the result
      await cacheManager.setTrendingRepositories(language, since, result);

      return result;
    } catch (error: any) {
      console.error('Error fetching trending repositories:', error);
      throw new Error(`Failed to fetch trending repositories: ${error.message}`);
    }
  }

  /**
   * Get repository issues for opportunity scoring
   */
  async getRepositoryIssues(owner: string, repo: string, options: IssueOptions = {}): Promise<any[]> {
    const {
      labels = '',
      state = 'open',
      perPage = 30
    } = options;

    try {
      const response = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state,
        labels,
        per_page: perPage,
        sort: 'created',
        direction: 'desc'
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching issues for ${owner}/${repo}:`, error);
      return []; // Return empty array on error to not break scoring
    }
  }

  /**
   * Get repository contributors for activity analysis
   */
  async getRepositoryContributors(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await this.octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 10
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error);
      return [];
    }
  }

  /**
   * Build search query from skills array
   */
  private buildSearchQuery(skills: string[]): string {
    if (!skills || skills.length === 0) {
      return 'stars:>100';
    }

    // Build language and topic filters
    const languageFilters = skills
      .filter(skill => this.isLanguage(skill))
      .map(lang => `language:${lang}`)
      .join(' ');

    const topicFilters = skills
      .filter(skill => !this.isLanguage(skill))
      .map(topic => `topic:${topic}`)
      .join(' ');

    // Combine filters with quality criteria
    const qualityFilters = 'stars:>10 forks:>0';
    
    return [languageFilters, topicFilters, qualityFilters]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Check if a skill is a programming language
   */
  private isLanguage(skill: string): boolean {
    const languages = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
      'php', 'ruby', 'swift', 'kotlin', 'scala', 'clojure', 'haskell', 'elixir',
      'dart', 'r', 'matlab', 'perl', 'lua', 'shell', 'powershell', 'html', 'css',
      'scss', 'sass', 'less', 'vue', 'react', 'angular', 'svelte'
    ];
    
    return languages.includes(skill.toLowerCase());
  }

  /**
   * Get date string for trending repositories
   */
  private getSinceDate(since: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();
    const days = {
      daily: 1,
      weekly: 7,
      monthly: 30
    };

    const daysAgo = days[since] || 7;
    const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return date.toISOString().split('T')[0];
  }

  /**
   * Check API rate limit status
   */
  async getRateLimit(): Promise<{ remaining: number; limit: number; reset: number }> {
    try {
      const response = await this.octokit.rest.rateLimit.get();
      return {
        remaining: response.data.resources.core.remaining,
        limit: response.data.resources.core.limit,
        reset: response.data.resources.core.reset
      };
    } catch (error: any) {
      console.error('Error fetching rate limit:', error);
      return { remaining: 0, limit: 5000, reset: Date.now() };
    }
  }
}

// Create singleton instance
const githubClient = new GitHubClient();

export default githubClient;
export type { RepositoryDetails, SearchOptions, SearchResult };
