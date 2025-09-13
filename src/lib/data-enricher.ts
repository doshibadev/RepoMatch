/**
 * Data enrichment system for repositories
 * Enhances basic GitHub data with detailed analysis
 */

import { Octokit } from '@octokit/rest';
import cacheManager from './cache';

interface CommitAnalysis {
  frequency: number; // commits per week
  recency: number; // days since last commit
  contributorDistribution: number; // how evenly distributed commits are
  averageCommitSize: number; // lines changed per commit
  commitMessageQuality: number; // quality of commit messages
  branchActivity: number; // activity across branches
}

interface IssueAnalysis {
  responseTime: number; // average response time in hours
  resolutionRate: number; // percentage of issues resolved
  maintainerActivity: number; // maintainer response rate
  communityEngagement: number; // community participation
  issueQuality: number; // quality of issue descriptions
  labelUsage: number; // proper use of labels
}

interface DependencyAnalysis {
  healthScore: number; // overall package health
  securityScore: number; // security vulnerabilities
  updateFrequency: number; // how often dependencies are updated
  dependencyCount: number; // total number of dependencies
  outdatedDependencies: number; // count of outdated packages
  licenseCompatibility: number; // license compatibility score
}

interface ReadmeAnalysis {
  contentQuality: number; // quality of documentation
  skillKeywords: string[]; // skills mentioned in README
  projectType: string; // detected project type
  complexity: number; // estimated complexity
  learningResources: number; // tutorials, examples, etc.
  setupDifficulty: number; // ease of setup
}

interface EnrichedRepositoryData {
  commitAnalysis: CommitAnalysis;
  issueAnalysis: IssueAnalysis;
  dependencyAnalysis: DependencyAnalysis;
  readmeAnalysis: ReadmeAnalysis;
}

class DataEnricher {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Enrich repository with detailed analysis
   */
  async enrichRepository(
    owner: string,
    repo: string,
    basicData: any
  ): Promise<EnrichedRepositoryData> {
    // Check cache first - we'll use a simple key-based approach
    const cacheKey = `enriched_${owner}_${repo}`;
    try {
      const cached = await cacheManager.getRepository(owner, repo);
      if (cached?.enrichedData) {
        return cached.enrichedData;
      }
    } catch (error) {
      // Cache miss or error, continue with enrichment
    }

    try {
      const [
        commitAnalysis,
        issueAnalysis,
        dependencyAnalysis,
        readmeAnalysis
      ] = await Promise.all([
        this.analyzeCommits(owner, repo),
        this.analyzeIssues(owner, repo),
        this.analyzeDependencies(owner, repo),
        this.analyzeReadme(owner, repo)
      ]);

      const enrichedData = {
        commitAnalysis,
        issueAnalysis,
        dependencyAnalysis,
        readmeAnalysis
      };

      // Cache will be handled by the repository caching in github.ts
      return enrichedData;
    } catch (error) {
      console.error(`Error enriching repository ${owner}/${repo}:`, error);
      // Return default values on error
      return this.getDefaultEnrichedData();
    }
  }

  /**
   * Analyze commit history and patterns
   */
  private async analyzeCommits(owner: string, repo: string): Promise<CommitAnalysis> {
    try {
      const commits = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 100,
        sort: 'committer-date',
        order: 'desc'
      });

      if (!commits.data || commits.data.length === 0) {
        return this.getDefaultCommitAnalysis();
      }

      const now = new Date();
      const commitData = commits.data;
      
      // Calculate frequency (commits per week)
      const firstCommit = new Date(commitData[commitData.length - 1].commit.committer?.date || now);
      const weeksSinceFirst = Math.max(1, (now.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24 * 7));
      const frequency = commitData.length / weeksSinceFirst;

      // Calculate recency (days since last commit)
      const lastCommit = new Date(commitData[0].commit.committer?.date || now);
      const recency = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24);

      // Calculate contributor distribution
      const contributors = new Map<string, number>();
      commitData.forEach(commit => {
        const author = commit.commit.author?.name || 'unknown';
        contributors.set(author, (contributors.get(author) || 0) + 1);
      });
      
      const contributorCount = contributors.size;
      const totalCommits = commitData.length;
      const distribution = contributorCount > 1 ? 
        Math.min(1, contributorCount / Math.sqrt(totalCommits)) : 0;

      // Calculate average commit size (simplified)
      const averageCommitSize = Math.min(100, totalCommits / commitData.length);

      // Calculate commit message quality
      const messageQuality = this.calculateMessageQuality(commitData);

      // Calculate branch activity
      const branchActivity = await this.calculateBranchActivity(owner, repo);

      return {
        frequency: Math.min(10, frequency), // Cap at 10 commits per week
        recency: Math.min(365, recency), // Cap at 365 days
        contributorDistribution: distribution,
        averageCommitSize,
        commitMessageQuality: messageQuality,
        branchActivity
      };
    } catch (error) {
      console.error(`Error analyzing commits for ${owner}/${repo}:`, error);
      return this.getDefaultCommitAnalysis();
    }
  }

  /**
   * Analyze issues and community engagement
   */
  private async analyzeIssues(owner: string, repo: string): Promise<IssueAnalysis> {
    try {
      const [openIssues, closedIssues] = await Promise.all([
        this.octokit.rest.issues.listForRepo({
          owner,
          repo,
          state: 'open',
          per_page: 100
        }),
        this.octokit.rest.issues.listForRepo({
          owner,
          repo,
          state: 'closed',
          per_page: 100
        })
      ]);

      const allIssues = [...openIssues.data, ...closedIssues.data];
      
      if (allIssues.length === 0) {
        return this.getDefaultIssueAnalysis();
      }

      // Calculate response time
      const responseTimes: number[] = [];
      allIssues.forEach(issue => {
        if (issue.comments > 0 && issue.created_at) {
          // Simplified: assume first comment is response
          const created = new Date(issue.created_at);
          const responseTime = (Date.now() - created.getTime()) / (1000 * 60 * 60); // hours
          responseTimes.push(responseTime);
        }
      });

      const avgResponseTime = responseTimes.length > 0 ? 
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;

      // Calculate resolution rate
      const resolutionRate = closedIssues.data.length / allIssues.length;

      // Calculate maintainer activity
      const maintainerComments = allIssues.filter(issue => 
        issue.comments > 0 && issue.user?.type === 'User'
      ).length;
      const maintainerActivity = maintainerComments / allIssues.length;

      // Calculate community engagement
      const communityEngagement = allIssues.filter(issue => 
        issue.comments > 1
      ).length / allIssues.length;

      // Calculate issue quality
      const issueQuality = this.calculateIssueQuality(allIssues);

      // Calculate label usage
      const labeledIssues = allIssues.filter(issue => 
        issue.labels && issue.labels.length > 0
      ).length;
      const labelUsage = labeledIssues / allIssues.length;

      return {
        responseTime: Math.min(168, avgResponseTime), // Cap at 1 week
        resolutionRate: Math.min(1, resolutionRate),
        maintainerActivity: Math.min(1, maintainerActivity),
        communityEngagement: Math.min(1, communityEngagement),
        issueQuality: Math.min(1, issueQuality),
        labelUsage: Math.min(1, labelUsage)
      };
    } catch (error) {
      console.error(`Error analyzing issues for ${owner}/${repo}:`, error);
      return this.getDefaultIssueAnalysis();
    }
  }

  /**
   * Analyze dependencies and package health
   */
  private async analyzeDependencies(owner: string, repo: string): Promise<DependencyAnalysis> {
    try {
      // Try to get package.json for Node.js projects
      let packageJson: any = null;
      try {
        const packageFile = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'package.json'
        });
        
        if (packageFile.data && 'content' in packageFile.data) {
          const content = Buffer.from(packageFile.data.content, 'base64').toString();
          packageJson = JSON.parse(content);
        }
      } catch (error) {
        // Not a Node.js project or no package.json
      }

      if (!packageJson || !packageJson.dependencies) {
        return this.getDefaultDependencyAnalysis();
      }

      const dependencies = Object.keys(packageJson.dependencies);
      const dependencyCount = dependencies.length;

      // Simplified health scoring based on common patterns
      const healthScore = this.calculatePackageHealth(packageJson);
      
      // Simplified security scoring (would need actual security scanning)
      const securityScore = this.calculateSecurityScore(packageJson);

      // Calculate update frequency (simplified)
      const updateFrequency = this.calculateUpdateFrequency(packageJson);

      // Count outdated dependencies (simplified)
      const outdatedDependencies = this.countOutdatedDependencies(packageJson);

      // License compatibility
      const licenseCompatibility = this.calculateLicenseCompatibility(packageJson);

      return {
        healthScore: Math.min(1, healthScore),
        securityScore: Math.min(1, securityScore),
        updateFrequency: Math.min(1, updateFrequency),
        dependencyCount,
        outdatedDependencies,
        licenseCompatibility: Math.min(1, licenseCompatibility)
      };
    } catch (error) {
      console.error(`Error analyzing dependencies for ${owner}/${repo}:`, error);
      return this.getDefaultDependencyAnalysis();
    }
  }

  /**
   * Analyze README content and quality
   */
  private async analyzeReadme(owner: string, repo: string): Promise<ReadmeAnalysis> {
    try {
      const readmeFile = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'README.md'
      });

      if (!readmeFile.data || !('content' in readmeFile.data)) {
        return this.getDefaultReadmeAnalysis();
      }

      const content = Buffer.from(readmeFile.data.content, 'base64').toString();
      
      // Calculate content quality
      const contentQuality = this.calculateContentQuality(content);
      
      // Extract skill keywords
      const skillKeywords = this.extractSkillKeywords(content);
      
      // Detect project type
      const projectType = this.detectProjectType(content);
      
      // Estimate complexity
      const complexity = this.estimateComplexity(content);
      
      // Count learning resources
      const learningResources = this.countLearningResources(content);
      
      // Assess setup difficulty
      const setupDifficulty = this.assessSetupDifficulty(content);

      return {
        contentQuality: Math.min(1, contentQuality),
        skillKeywords,
        projectType,
        complexity: Math.min(1, complexity),
        learningResources: Math.min(10, learningResources),
        setupDifficulty: Math.min(1, setupDifficulty)
      };
    } catch (error) {
      console.error(`Error analyzing README for ${owner}/${repo}:`, error);
      return this.getDefaultReadmeAnalysis();
    }
  }

  // Helper methods for calculations
  private calculateMessageQuality(commits: any[]): number {
    let qualityScore = 0;
    commits.forEach(commit => {
      const message = commit.commit.message || '';
      if (message.length > 10 && message.length < 100) qualityScore += 0.1;
      if (message.includes('fix') || message.includes('feat') || message.includes('refactor')) qualityScore += 0.1;
      if (!message.includes('Merge') && !message.includes('merge')) qualityScore += 0.1;
    });
    return Math.min(1, qualityScore / commits.length);
  }

  private async calculateBranchActivity(owner: string, repo: string): Promise<number> {
    try {
      const branches = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 10
      });
      return Math.min(1, branches.data.length / 10);
    } catch {
      return 0;
    }
  }

  private calculateIssueQuality(issues: any[]): number {
    let qualityScore = 0;
    issues.forEach(issue => {
      const body = issue.body || '';
      if (body.length > 50) qualityScore += 0.1;
      if (body.includes('steps to reproduce') || body.includes('expected behavior')) qualityScore += 0.1;
      if (issue.labels && issue.labels.length > 0) qualityScore += 0.1;
    });
    return Math.min(1, qualityScore / issues.length);
  }

  private calculatePackageHealth(packageJson: any): number {
    let healthScore = 0.5; // Base score
    
    // Check for common good practices
    if (packageJson.scripts && packageJson.scripts.test) healthScore += 0.1;
    if (packageJson.scripts && packageJson.scripts.build) healthScore += 0.1;
    if (packageJson.engines) healthScore += 0.1;
    if (packageJson.keywords && packageJson.keywords.length > 0) healthScore += 0.1;
    if (packageJson.description && packageJson.description.length > 10) healthScore += 0.1;
    
    return healthScore;
  }

  private calculateSecurityScore(packageJson: any): number {
    // Simplified security scoring
    let securityScore = 0.8; // Base score
    
    // Check for common security issues
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    // Check for known problematic packages (simplified)
    const problematicPackages = ['request', 'moment', 'lodash'];
    const allDeps = { ...dependencies, ...devDependencies };
    
    for (const pkg of problematicPackages) {
      if (allDeps[pkg]) {
        securityScore -= 0.1;
      }
    }
    
    return Math.max(0, securityScore);
  }

  private calculateUpdateFrequency(packageJson: any): number {
    // Simplified: assume more dependencies = more updates needed
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    return Math.min(1, depCount / 20); // Normalize to 20 dependencies
  }

  private countOutdatedDependencies(packageJson: any): number {
    // Simplified: assume some percentage are outdated
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    return Math.floor(depCount * 0.3); // Assume 30% are outdated
  }

  private calculateLicenseCompatibility(packageJson: any): number {
    const license = packageJson.license;
    if (!license) return 0.5;
    
    const compatibleLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC'];
    return compatibleLicenses.includes(license) ? 1.0 : 0.7;
  }

  private calculateContentQuality(content: string): number {
    let qualityScore = 0;
    
    // Check for common quality indicators
    if (content.includes('# ')) qualityScore += 0.1; // Has headers
    if (content.includes('## ')) qualityScore += 0.1; // Has subheaders
    if (content.includes('```')) qualityScore += 0.1; // Has code blocks
    if (content.includes('Installation') || content.includes('Install')) qualityScore += 0.1;
    if (content.includes('Usage') || content.includes('Example')) qualityScore += 0.1;
    if (content.includes('Contributing')) qualityScore += 0.1;
    if (content.includes('License')) qualityScore += 0.1;
    if (content.length > 500) qualityScore += 0.1; // Substantial content
    if (content.includes('![') || content.includes('http')) qualityScore += 0.1; // Has images/links
    
    return Math.min(1, qualityScore);
  }

  private extractSkillKeywords(content: string): string[] {
    const skillKeywords: string[] = [];
    const contentLower = content.toLowerCase();
    
    // Common technology keywords
    const techKeywords = [
      'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt',
      'nodejs', 'express', 'fastify', 'koa',
      'python', 'django', 'flask', 'fastapi',
      'java', 'spring', 'maven', 'gradle',
      'go', 'rust', 'c++', 'c#', 'php', 'ruby',
      'typescript', 'javascript', 'html', 'css',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp',
      'mongodb', 'postgresql', 'mysql', 'redis',
      'tensorflow', 'pytorch', 'machine learning', 'ai',
      'webpack', 'vite', 'babel', 'eslint'
    ];
    
    techKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        skillKeywords.push(keyword);
      }
    });
    
    return [...new Set(skillKeywords)]; // Remove duplicates
  }

  private detectProjectType(content: string): string {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('web') || contentLower.includes('frontend') || contentLower.includes('ui')) {
      return 'web-frontend';
    }
    if (contentLower.includes('api') || contentLower.includes('backend') || contentLower.includes('server')) {
      return 'web-backend';
    }
    if (contentLower.includes('mobile') || contentLower.includes('ios') || contentLower.includes('android')) {
      return 'mobile';
    }
    if (contentLower.includes('machine learning') || contentLower.includes('ai') || contentLower.includes('data science')) {
      return 'data-science';
    }
    if (contentLower.includes('library') || contentLower.includes('package') || contentLower.includes('npm')) {
      return 'library';
    }
    if (contentLower.includes('cli') || contentLower.includes('command line')) {
      return 'cli-tool';
    }
    
    return 'general';
  }

  private estimateComplexity(content: string): number {
    let complexity = 0.3; // Base complexity
    
    // Indicators of higher complexity
    if (content.includes('architecture') || content.includes('microservices')) complexity += 0.2;
    if (content.includes('distributed') || content.includes('scalable')) complexity += 0.2;
    if (content.includes('algorithm') || content.includes('optimization')) complexity += 0.2;
    if (content.includes('machine learning') || content.includes('ai')) complexity += 0.2;
    if (content.includes('real-time') || content.includes('streaming')) complexity += 0.1;
    
    return Math.min(1, complexity);
  }

  private countLearningResources(content: string): number {
    let resources = 0;
    
    // Count various learning resources
    if (content.includes('tutorial')) resources++;
    if (content.includes('example')) resources++;
    if (content.includes('demo')) resources++;
    if (content.includes('guide')) resources++;
    if (content.includes('documentation')) resources++;
    if (content.includes('wiki')) resources++;
    if (content.includes('blog')) resources++;
    if (content.includes('video')) resources++;
    if (content.includes('course')) resources++;
    if (content.includes('workshop')) resources++;
    
    return resources;
  }

  private assessSetupDifficulty(content: string): number {
    let difficulty = 0.5; // Base difficulty
    
    // Indicators of higher difficulty
    if (content.includes('docker') || content.includes('kubernetes')) difficulty += 0.2;
    if (content.includes('environment') || content.includes('configuration')) difficulty += 0.1;
    if (content.includes('database') || content.includes('migration')) difficulty += 0.1;
    if (content.includes('api key') || content.includes('credentials')) difficulty += 0.1;
    if (content.includes('install') && content.includes('multiple')) difficulty += 0.1;
    
    return Math.min(1, difficulty);
  }

  // Default values for error cases
  private getDefaultEnrichedData(): EnrichedRepositoryData {
    return {
      commitAnalysis: this.getDefaultCommitAnalysis(),
      issueAnalysis: this.getDefaultIssueAnalysis(),
      dependencyAnalysis: this.getDefaultDependencyAnalysis(),
      readmeAnalysis: this.getDefaultReadmeAnalysis()
    };
  }

  private getDefaultCommitAnalysis(): CommitAnalysis {
    return {
      frequency: 0,
      recency: 365,
      contributorDistribution: 0,
      averageCommitSize: 0,
      commitMessageQuality: 0,
      branchActivity: 0
    };
  }

  private getDefaultIssueAnalysis(): IssueAnalysis {
    return {
      responseTime: 168, // 1 week
      resolutionRate: 0,
      maintainerActivity: 0,
      communityEngagement: 0,
      issueQuality: 0,
      labelUsage: 0
    };
  }

  private getDefaultDependencyAnalysis(): DependencyAnalysis {
    return {
      healthScore: 0,
      securityScore: 0,
      updateFrequency: 0,
      dependencyCount: 0,
      outdatedDependencies: 0,
      licenseCompatibility: 0
    };
  }

  private getDefaultReadmeAnalysis(): ReadmeAnalysis {
    return {
      contentQuality: 0,
      skillKeywords: [],
      projectType: 'general',
      complexity: 0,
      learningResources: 0,
      setupDifficulty: 0
    };
  }
}

export default new DataEnricher();
