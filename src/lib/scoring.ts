/**
 * Repository scoring algorithm
 * Calculates multi-dimensional scores for repository ranking
 */

import type { RepositoryDetails } from './github';
import type { NormalizedSkill } from './skills';

interface ScoringWeights {
  relevance: number;
  quality: number;
  opportunity: number;
}

interface RepositoryScore {
  relevance: number;
  quality: number;
  opportunity: number;
  final: number;
  breakdown: {
    languageMatch: number;
    topicMatch: number;
    readmeMatch: number;
    starsScore: number;
    activityScore: number;
    documentationScore: number;
    issueScore: number;
    contributorScore: number;
    // Enhanced breakdown
    commitActivityScore: number;
    issueResponseScore: number;
    dependencyHealthScore: number;
    readmeQualityScore: number;
    skillMatchScore: number;
  };
}

interface ScoringOptions {
  mode?: 'profile-building' | 'learning' | 'quick-wins';
  weights?: Partial<ScoringWeights>;
  minStars?: number;
  maxStars?: number;
}

class RepositoryScorer {
  private defaultWeights: ScoringWeights = {
    relevance: 0.5,  // 50%
    quality: 0.3,    // 30%
    opportunity: 0.2 // 20%
  };

  private getModeWeights(mode: 'profile-building' | 'learning' | 'quick-wins'): ScoringWeights {
    switch (mode) {
      case 'learning':
        return {
          relevance: 0.3,   // 30% - More flexible skill matching for learning
          quality: 0.5,     // 50% - Documentation and community matter most
          opportunity: 0.2  // 20% - Still important for hands-on learning
        };
      case 'quick-wins':
        return {
          relevance: 0.2,   // 20% - Skill match less important for quick wins
          quality: 0.1,     // 10% - Quality matters least for quick wins
          opportunity: 0.7  // 70% - Contribution opportunities are everything
        };
      case 'profile-building':
      default:
        return {
          relevance: 0.6,   // 60% - Exact skill match matters most
          quality: 0.3,     // 30% - Good projects matter
          opportunity: 0.1  // 10% - Contribution opportunities less important
        };
    }
  }

  /**
   * Score a repository based on user skills and preferences
   * @param repo - Repository details from GitHub
   * @param skills - Normalized user skills
   * @param options - Scoring options and preferences
   * @returns Comprehensive scoring breakdown
   */
  scoreRepository(
    repo: RepositoryDetails,
    skills: NormalizedSkill[],
    options: ScoringOptions = {}
  ): RepositoryScore {
    // Get mode-specific weights, then apply any custom overrides
    const modeWeights = this.getModeWeights(options.mode || 'profile-building');
    const weights = { ...modeWeights, ...options.weights };
    
    // Calculate individual dimension scores with mode-specific logic
    const relevanceScore = this.calculateRelevanceScore(repo, skills, options);
    const qualityScore = this.calculateQualityScore(repo, options);
    const opportunityScore = this.calculateOpportunityScore(repo, options);

    // Calculate final weighted score
    let finalScore = (
      relevanceScore * weights.relevance +
      qualityScore * weights.quality +
      opportunityScore * weights.opportunity
    );

    // Apply mode-specific bonuses/penalties
    finalScore = this.applyModeBonuses(finalScore, repo, options);

    // Apply aggressive freshness boost (1.2x multiplier for recent activity)
    finalScore = this.applyFreshnessBoost(finalScore, repo);

    return {
      relevance: relevanceScore,
      quality: qualityScore,
      opportunity: opportunityScore,
      final: finalScore,
      breakdown: {
        languageMatch: this.calculateLanguageMatch(repo, skills),
        topicMatch: this.calculateTopicMatch(repo, skills),
        readmeMatch: this.calculateReadmeMatch(repo, skills),
        starsScore: this.calculateStarsScore(repo.stargazers_count),
        activityScore: this.calculateActivityScore(repo),
        documentationScore: this.calculateDocumentationScore(repo),
        issueScore: this.calculateIssueScore(repo),
        contributorScore: this.calculateContributorScore(repo),
        // Enhanced breakdown using enriched data
        commitActivityScore: this.calculateCommitActivityScore(repo),
        issueResponseScore: this.calculateIssueResponseScore(repo),
        dependencyHealthScore: this.calculateDependencyHealthScore(repo),
        readmeQualityScore: this.calculateReadmeQualityScore(repo),
        skillMatchScore: this.calculateSkillMatchScore(repo, skills)
      }
    };
  }

  /**
   * Calculate relevance score
   * Based on language, topics, and README keyword matching
   * Mode-specific adjustments for skill matching strictness
   */
  private calculateRelevanceScore(repo: RepositoryDetails, skills: NormalizedSkill[], options: ScoringOptions): number {
    const languageMatch = this.calculateLanguageMatch(repo, skills);
    const topicMatch = this.calculateTopicMatch(repo, skills);
    const readmeMatch = this.calculateReadmeMatch(repo, skills);
    const skillMatchScore = this.calculateSkillMatchScore(repo, skills);

    // Mode-specific weighting for relevance factors
    let weights = { language: 0.3, topic: 0.3, readme: 0.2, skillMatch: 0.2 };
    
    if (options.mode === 'learning') {
      // Learning mode: More flexible matching, focus on educational content
      weights = { language: 0.2, topic: 0.4, readme: 0.2, skillMatch: 0.2 };
    } else if (options.mode === 'quick-wins') {
      // Quick wins: Less strict matching, focus on broad appeal
      weights = { language: 0.2, topic: 0.2, readme: 0.3, skillMatch: 0.3 };
    }

    return (
      languageMatch * weights.language +
      topicMatch * weights.topic +
      readmeMatch * weights.readme +
      skillMatchScore * weights.skillMatch
    );
  }

  /**
   * Calculate quality score with community validation boost
   * Based on stars, activity, and documentation health
   * Mode-specific adjustments for what "quality" means
   */
  private calculateQualityScore(repo: RepositoryDetails, options: ScoringOptions): number {
    const starsScore = this.calculateStarsScore(repo.stargazers_count);
    const activityScore = this.calculateActivityScore(repo);
    const documentationScore = this.calculateDocumentationScore(repo);
    const commitActivityScore = this.calculateCommitActivityScore(repo);
    const dependencyHealthScore = this.calculateDependencyHealthScore(repo);
    const readmeQualityScore = this.calculateReadmeQualityScore(repo);

    // Mode-specific weighting for quality factors
    let weights = { stars: 0.3, activity: 0.2, documentation: 0.15, commitActivity: 0.15, dependencyHealth: 0.1, readmeQuality: 0.1 };
    
    if (options.mode === 'learning') {
      // Learning mode: Prioritize documentation and README quality
      weights = { stars: 0.25, activity: 0.15, documentation: 0.25, commitActivity: 0.15, dependencyHealth: 0.1, readmeQuality: 0.1 };
    } else if (options.mode === 'quick-wins') {
      // Quick wins: Prioritize activity and stars (popularity)
      weights = { stars: 0.4, activity: 0.25, documentation: 0.1, commitActivity: 0.15, dependencyHealth: 0.05, readmeQuality: 0.05 };
    } else if (options.mode === 'profile-building') {
      // Profile building: Balanced approach with emphasis on stars and dependency health
      weights = { stars: 0.3, activity: 0.2, documentation: 0.15, commitActivity: 0.15, dependencyHealth: 0.1, readmeQuality: 0.1 };
    }

    let qualityScore = (
      starsScore * weights.stars +
      activityScore * weights.activity +
      documentationScore * weights.documentation +
      commitActivityScore * weights.commitActivity +
      dependencyHealthScore * weights.dependencyHealth +
      readmeQualityScore * weights.readmeQuality
    );

    // Boost for repos with some community validation (50-500 stars = sweet spot)
    if (repo.stargazers_count >= 50 && repo.stargazers_count <= 500) {
      qualityScore += 0.1; // 10% boost for "goldilocks" repos
    }

    // Additional boost for repos with forks (indicates contribution activity)
    if (repo.forks_count > 0) {
      qualityScore += Math.min(repo.forks_count / 20, 0.05); // Up to 5% boost
    }

    return Math.min(qualityScore, 1.0);
  }

  /**
   * Calculate opportunity score
   * Based on open issues, contributor activity, and contribution opportunities
   * Mode-specific adjustments for what constitutes "opportunity"
   */
  private calculateOpportunityScore(repo: RepositoryDetails, options: ScoringOptions): number {
    const issueScore = this.calculateIssueScore(repo);
    const contributorScore = this.calculateContributorScore(repo);
    const issueResponseScore = this.calculateIssueResponseScore(repo);

    // Mode-specific weighting for opportunity factors
    let weights = { issues: 0.5, contributors: 0.3, response: 0.2 };
    
    if (options.mode === 'learning') {
      // Learning mode: Focus on good first issues and community
      weights = { issues: 0.6, contributors: 0.2, response: 0.2 };
    } else if (options.mode === 'quick-wins') {
      // Quick wins: Focus heavily on issues and response time
      weights = { issues: 0.6, contributors: 0.1, response: 0.3 };
    } else if (options.mode === 'profile-building') {
      // Profile building: Balanced approach
      weights = { issues: 0.5, contributors: 0.3, response: 0.2 };
    }

    return (
      issueScore * weights.issues +
      contributorScore * weights.contributors +
      issueResponseScore * weights.response
    );
  }

  /**
   * Calculate language matching score
   */
  private calculateLanguageMatch(repo: RepositoryDetails, skills: NormalizedSkill[]): number {
    if (!repo.language || !skills.length) return 0;

    const repoLanguage = repo.language.toLowerCase();
    const skillLanguages = skills
      .filter(skill => skill.category === 'language')
      .map(skill => skill.normalized.toLowerCase());

    // Direct language match
    if (skillLanguages.includes(repoLanguage)) {
      return 1.0;
    }

    // Check expanded skills for language matches
    const expandedLanguages = skills
      .flatMap(skill => skill.expanded)
      .filter(expanded => this.isLanguage(expanded))
      .map(lang => lang.toLowerCase());

    if (expandedLanguages.includes(repoLanguage)) {
      return 0.8;
    }

    // Check if any skill is related to this language
    const relatedLanguages = skills
      .flatMap(skill => skill.expanded)
      .filter(expanded => 
        expanded.includes(repoLanguage) || 
        repoLanguage.includes(expanded)
      );

    return relatedLanguages.length > 0 ? 0.6 : 0;
  }

  /**
   * Calculate topic matching score
   */
  private calculateTopicMatch(repo: RepositoryDetails, skills: NormalizedSkill[]): number {
    if (!repo.topics || !repo.topics.length || !skills.length) return 0;

    const repoTopics = repo.topics.map(topic => topic.toLowerCase());
    const skillTopics = skills
      .flatMap(skill => [skill.normalized, ...skill.expanded])
      .map(topic => topic.toLowerCase());

    // Calculate intersection
    const matches = repoTopics.filter(topic => 
      skillTopics.some(skillTopic => 
        topic === skillTopic || 
        topic.includes(skillTopic) || 
        skillTopic.includes(topic)
      )
    );

    // Score based on match ratio
    const matchRatio = matches.length / Math.max(repoTopics.length, 1);
    return Math.min(matchRatio * 2, 1.0); // Cap at 1.0, boost for good matches
  }

  /**
   * Calculate README keyword matching score
   */
  private calculateReadmeMatch(repo: RepositoryDetails, skills: NormalizedSkill[]): number {
    if (!repo.description || !skills.length) return 0;

    const description = repo.description.toLowerCase();
    const skillKeywords = skills
      .flatMap(skill => [skill.normalized, ...skill.expanded])
      .map(keyword => keyword.toLowerCase());

    // Count keyword matches in description
    const matches = skillKeywords.filter(keyword => 
      description.includes(keyword)
    );

    // Score based on number of matches
    const matchRatio = matches.length / skillKeywords.length;
    return Math.min(matchRatio * 3, 1.0); // Boost for good matches, cap at 1.0
  }

  /**
   * Calculate stars score with hard caps to force small/medium repos to compete
   */
  private calculateStarsScore(stars: number): number {
    if (stars === 0) return 0;
    
    // Hard cap tiers to prevent huge repos from dominating
    if (stars > 20000) return 0.5;  // Massive repos capped at 50%
    if (stars > 5000) return 0.6;   // Very popular repos capped at 60%
    if (stars > 1000) return 0.7;  // Popular repos capped at 70%
    
    // Linear scaling up to 1000 stars (max 0.7)
    return Math.min(stars / 1000, 0.7);
  }

  /**
   * Calculate activity score based on recent updates with stronger freshness weighting
   */
  private calculateActivityScore(repo: RepositoryDetails): number {
    const now = new Date();
    const updatedAt = new Date(repo.updated_at);
    const pushedAt = new Date(repo.pushed_at);
    
    // Use the more recent of updated_at and pushed_at
    const lastActivity = new Date(Math.max(updatedAt.getTime(), pushedAt.getTime()));
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    // Enhanced scoring with stronger freshness weighting
    let baseScore = 0;
    if (daysSinceActivity <= 1) baseScore = 1.0;      // Very recent (within 24h)
    else if (daysSinceActivity <= 7) baseScore = 0.95;   // Very active (within week)
    else if (daysSinceActivity <= 30) baseScore = 0.8;    // Active (within month)
    else if (daysSinceActivity <= 90) baseScore = 0.6;    // Moderately active (within quarter)
    else if (daysSinceActivity <= 365) baseScore = 0.3;   // Somewhat active (within year)
    else baseScore = 0.1; // Inactive

    // Bonus for very recent activity (promote freshness over prestige)
    if (daysSinceActivity <= 3) {
      baseScore += 0.05; // Small bonus for very fresh repos
    }

    return Math.min(baseScore, 1.0);
  }

  /**
   * Calculate documentation score
   */
  private calculateDocumentationScore(repo: RepositoryDetails): number {
    let score = 0;

    // Has description
    if (repo.description && repo.description.length > 20) {
      score += 0.3;
    }

    // Has homepage
    if (repo.homepage) {
      score += 0.2;
    }

    // Has license
    if (repo.license && repo.license.name !== 'Other') {
      score += 0.2;
    }

    // Has topics (indicates good categorization)
    if (repo.topics && repo.topics.length > 0) {
      score += 0.1;
    }

    // Has good first issues (indicates contributor-friendly)
    if (repo.goodFirstIssues > 0) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate issue score based on issue density (good-first-issues ÷ open-issues)
   */
  private calculateIssueScore(repo: RepositoryDetails): number {
    const totalIssues = repo.open_issues_count;
    const goodFirstIssues = repo.goodFirstIssues;

    if (totalIssues === 0) return 0.5; // No issues might mean well-maintained or abandoned

    // Calculate issue density (good-first-issues ÷ open-issues)
    const issueDensity = goodFirstIssues / totalIssues;
    
    // Score based on density, not raw counts
    // Higher density = better opportunities for contributors
    let baseScore = 0;
    
    if (issueDensity >= 0.1) baseScore = 1.0;      // 10%+ good first issues = excellent
    else if (issueDensity >= 0.05) baseScore = 0.8; // 5%+ good first issues = very good
    else if (issueDensity >= 0.02) baseScore = 0.6; // 2%+ good first issues = good
    else if (issueDensity > 0) baseScore = 0.4;     // Some good first issues = okay
    else baseScore = 0.2;                          // No good first issues = poor
    
    // Small bonus for having some issues (shows activity)
    const activityBonus = Math.min(totalIssues / 20, 0.1); // Max 10% bonus
    
    return Math.min(baseScore + activityBonus, 1.0);
  }

  /**
   * Calculate contributor score (placeholder - would need contributor data)
   */
  private calculateContributorScore(repo: RepositoryDetails): number {
    // This would ideally use contributor data from GitHub API
    // For now, we'll use a heuristic based on forks and stars
    
    const forks = repo.forks_count;
    const stars = repo.stargazers_count;
    
    // More forks generally indicate more contributors
    const forkScore = Math.min(forks / 100, 1.0) * 0.6;
    
    // Stars indicate community interest
    const starScore = Math.min(stars / 1000, 1.0) * 0.4;
    
    return forkScore + starScore;
  }

  /**
   * Apply mode-specific bonuses and penalties to the final score
   */
  private applyModeBonuses(baseScore: number, repo: RepositoryDetails, options: ScoringOptions): number {
    let bonus = 0;
    let penalty = 0;

    // Apply "too big to matter" penalties first
    penalty += this.calculateSizePenalty(repo);

    // Apply mode-specific negative filters
    penalty += this.calculateModePenalties(repo, options);

    switch (options.mode) {
      case 'learning':
        // Learning mode bonuses - Focus on educational value
        if (repo.goodFirstIssues > 10) bonus += 0.3; // Many good first issues
        else if (repo.goodFirstIssues > 5) bonus += 0.2; // Good number of learning opportunities
        else if (repo.goodFirstIssues > 0) bonus += 0.1; // Some learning opportunities
        
        if (repo.description && repo.description.toLowerCase().includes('tutorial')) bonus += 0.15;
        if (repo.description && repo.description.toLowerCase().includes('example')) bonus += 0.15;
        if (repo.description && repo.description.toLowerCase().includes('learn')) bonus += 0.1;
        if (repo.description && repo.description.toLowerCase().includes('beginner')) bonus += 0.1;
        
        if (repo.topics && repo.topics.some(topic => 
          ['tutorial', 'example', 'learning', 'beginner', 'documentation', 'education'].includes(topic.toLowerCase())
        )) bonus += 0.2;
        
        // Bonus for well-documented repos
        if (repo.description && repo.description.length > 100) bonus += 0.1;
        break;

      case 'quick-wins':
        // Quick wins bonuses - Focus on contribution opportunities
        if (repo.goodFirstIssues > 0) bonus += 0.4; // Any good first issues is huge
        if (repo.open_issues_count >= 5 && repo.open_issues_count <= 50) bonus += 0.3; // Perfect issue count
        else if (repo.open_issues_count > 50 && repo.open_issues_count <= 100) bonus += 0.2; // Still manageable
        else if (repo.open_issues_count > 100 && repo.open_issues_count <= 200) bonus += 0.1; // Getting large
        
        if (repo.stargazers_count >= 50 && repo.stargazers_count <= 2000) bonus += 0.2; // Sweet spot for quick wins
        else if (repo.stargazers_count > 2000 && repo.stargazers_count <= 5000) bonus += 0.1; // Still good
        
        if (repo.topics && repo.topics.some(topic => 
          ['good-first-issue', 'help-wanted', 'hacktoberfest', 'contribution'].includes(topic.toLowerCase())
        )) bonus += 0.3;
        
        // Bonus for recently active repos (easier to get responses)
        const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate <= 7) bonus += 0.2; // Very recent activity
        else if (daysSinceUpdate <= 30) bonus += 0.1; // Recent activity
        break;

      case 'profile-building':
        // Profile building bonuses - Focus on high-impact projects
        if (repo.stargazers_count > 5000) bonus += 0.4; // Very high visibility
        else if (repo.stargazers_count > 1000) bonus += 0.3; // High visibility
        else if (repo.stargazers_count > 500) bonus += 0.2; // Good visibility
        else if (repo.stargazers_count > 100) bonus += 0.1; // Some visibility
        
        if (repo.topics && repo.topics.some(topic => 
          ['popular', 'trending', 'awesome', 'production', 'enterprise'].includes(topic.toLowerCase())
        )) bonus += 0.2;
        
        if (repo.description && repo.description.toLowerCase().includes('production')) bonus += 0.15;
        if (repo.description && repo.description.toLowerCase().includes('enterprise')) bonus += 0.15;
        if (repo.description && repo.description.toLowerCase().includes('framework')) bonus += 0.1;
        if (repo.description && repo.description.toLowerCase().includes('library')) bonus += 0.1;
        
        // Bonus for mature projects
        const daysSinceCreated = (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated > 365) bonus += 0.1; // Mature project
        break;
    }

    return Math.max(0, Math.min(baseScore + bonus - penalty, 1.0)); // Cap between 0 and 1.0
  }

  /**
   * Calculate penalties for repos that are "too big to matter"
   */
  private calculateSizePenalty(repo: RepositoryDetails): number {
    let penalty = 0;

    // Penalty for massive issue counts (signal noise)
    if (repo.open_issues_count > 5000) {
      penalty += 0.3; // Heavy penalty for overwhelming repos
    } else if (repo.open_issues_count > 1000) {
      penalty += 0.15; // Moderate penalty for very large repos
    }

    // Aggressive logarithmic decay function for "too famous" repos
    // This hits Vue/React/Redux much harder than mid-sized repos
    if (repo.stargazers_count > 1000) {
      penalty += Math.log10(repo.stargazers_count) * 0.08; // Increased from 0.05 to 0.08
    }
    
    // Additional penalty for extremely popular repos
    if (repo.stargazers_count > 10000) {
      penalty += 0.15; // Extra 15% penalty for mega-popular repos
    }

    return penalty;
  }

  /**
   * Calculate mode-specific negative filters
   */
  private calculateModePenalties(repo: RepositoryDetails, options: ScoringOptions): number {
    let penalty = 0;

    // Universal penalty for repos with very few stars (unknown repos)
    if (repo.stargazers_count < 10) {
      penalty += 0.3; // Heavy penalty for completely unknown repos
    } else if (repo.stargazers_count < 20) {
      penalty += 0.15; // Moderate penalty for barely known repos
    }

    switch (options.mode) {
      case 'learning':
        // Learning mode: heavily penalize repos with no learning opportunities
        if (repo.goodFirstIssues === 0) {
          penalty += 0.5; // Massive penalty for no learning opportunities
        }
        
        // Penalize repos with poor documentation
        if (!repo.description || repo.description.length < 50) {
          penalty += 0.3; // Heavy penalty for poor documentation
        }
        
        // Penalize very old repos (might be outdated)
        const daysSinceUpdateLearning = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdateLearning > 365) {
          penalty += 0.2; // Penalty for stale repos
        }
        break;

      case 'quick-wins':
        // Quick wins: heavily penalize overwhelming repos
        if (repo.open_issues_count > 500) {
          penalty += 0.6; // Massive penalty for overwhelming repos
        } else if (repo.open_issues_count > 200) {
          penalty += 0.4; // Heavy penalty for large repos
        } else if (repo.open_issues_count > 100) {
          penalty += 0.2; // Moderate penalty for medium repos
        }
        
        // Penalize repos with no open issues (nothing to contribute to)
        if (repo.open_issues_count === 0) {
          penalty += 0.5; // Massive penalty for no contribution opportunities
        }
        
        // Penalize very popular repos (too competitive)
        if (repo.stargazers_count > 10000) {
          penalty += 0.3; // Heavy penalty for overly popular repos
        }
        
        // Penalize stale repos (maintainers might not respond)
        const daysSinceUpdateQuickWins = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdateQuickWins > 180) {
          penalty += 0.3; // Heavy penalty for stale repos
        }
        break;

      case 'profile-building':
        // Profile building: penalize low-visibility repos
        if (repo.stargazers_count < 50) {
          penalty += 0.5; // Massive penalty for low visibility
        } else if (repo.stargazers_count < 100) {
          penalty += 0.3; // Heavy penalty for low visibility
        } else if (repo.stargazers_count < 200) {
          penalty += 0.1; // Moderate penalty for low visibility
        }
        
        // Penalize very new repos (might not be established)
        const daysSinceCreated = (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 30) {
          penalty += 0.3; // Heavy penalty for very new repos
        } else if (daysSinceCreated < 90) {
          penalty += 0.1; // Moderate penalty for new repos
        }
        
        // Apply diversity penalty for extremely popular repos (but less aggressive)
        if (repo.stargazers_count > 50000) {
          penalty += 0.2; // Moderate penalty to promote diversity
        }
        break;
    }

    return penalty;
  }

  /**
   * Apply aggressive freshness boost to make smaller but active repos jump over stale giants
   */
  private applyFreshnessBoost(baseScore: number, repo: RepositoryDetails): number {
    const now = new Date();
    const updatedAt = new Date(repo.updated_at);
    const pushedAt = new Date(repo.pushed_at);
    
    // Use the more recent of updated_at and pushed_at
    const lastActivity = new Date(Math.max(updatedAt.getTime(), pushedAt.getTime()));
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    // Apply 1.2x multiplier for activity within 1-7 days
    if (daysSinceActivity <= 7) {
      return baseScore * 1.2;
    }

    return baseScore;
  }

  /**
   * Check if a string represents a programming language
   */
  private isLanguage(str: string): boolean {
    const languages = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
      'php', 'ruby', 'swift', 'kotlin', 'scala', 'clojure', 'haskell', 'elixir',
      'dart', 'r', 'matlab', 'perl', 'lua', 'shell', 'powershell', 'html', 'css',
      'scss', 'sass', 'less', 'vue', 'react', 'angular', 'svelte'
    ];
    
    return languages.includes(str.toLowerCase());
  }

  /**
   * Score multiple repositories and return sorted results with diversity tiers
   */
  scoreRepositories(
    repos: RepositoryDetails[],
    skills: NormalizedSkill[],
    options: ScoringOptions = {}
  ): Array<{ repo: RepositoryDetails; score: RepositoryScore }> {
    const scoredRepos = repos.map(repo => ({
      repo,
      score: this.scoreRepository(repo, skills, options)
    }));

    // Apply diversity tiers and randomization
    return this.applyDiversityAndRandomization(scoredRepos);
  }

  /**
   * Apply diversity tiers and randomization for close scores
   */
  private applyDiversityAndRandomization(
    scoredRepos: Array<{ repo: RepositoryDetails; score: RepositoryScore }>
  ): Array<{ repo: RepositoryDetails; score: RepositoryScore }> {
    // First, sort by score
    scoredRepos.sort((a, b) => b.score.final - a.score.final);

    // Apply randomization for close scores (±3%)
    const randomizedRepos = this.randomizeCloseScores(scoredRepos);

    // Apply diversity tiers
    return this.applyDiversityTiers(randomizedRepos);
  }

  /**
   * Randomize repositories with scores within ±3% of each other
   */
  private randomizeCloseScores(
    scoredRepos: Array<{ repo: RepositoryDetails; score: RepositoryScore }>
  ): Array<{ repo: RepositoryDetails; score: RepositoryScore }> {
    const result = [];
    let i = 0;

    while (i < scoredRepos.length) {
      const currentScore = scoredRepos[i].score.final;
      const closeGroup = [scoredRepos[i]];
      
      // Find all repos with scores within ±3%
      let j = i + 1;
      while (j < scoredRepos.length) {
        const scoreDiff = Math.abs(scoredRepos[j].score.final - currentScore);
        const percentDiff = scoreDiff / currentScore;
        
        if (percentDiff <= 0.03) { // Within 3%
          closeGroup.push(scoredRepos[j]);
          j++;
        } else {
          break;
        }
      }

      // Shuffle the close group
      const shuffledGroup = closeGroup.sort(() => Math.random() - 0.5);
      result.push(...shuffledGroup);
      
      i = j;
    }

    return result;
  }

  /**
   * Apply aggressive diversity tiers with heavy bias toward smaller repos
   */
  private applyDiversityTiers(
    scoredRepos: Array<{ repo: RepositoryDetails; score: RepositoryScore }>
  ): Array<{ repo: RepositoryDetails; score: RepositoryScore }> {
    // Categorize repos by size with "goldilocks" thresholds
    const smallRepos = scoredRepos.filter(({ repo }) => 
      repo.stargazers_count >= 50 && repo.stargazers_count < 500
    );
    const mediumRepos = scoredRepos.filter(({ repo }) => 
      repo.stargazers_count >= 500 && repo.stargazers_count < 2000
    );
    const largeRepos = scoredRepos.filter(({ repo }) => repo.stargazers_count >= 2000);

    const result = [];
    const maxResults = Math.min(scoredRepos.length, 50); // Limit for performance
    
    // Aggressive interleaving: [small, small, medium, small, small, large, small, small, medium...]
    // This heavily favors smaller repos
    let smallIndex = 0, mediumIndex = 0, largeIndex = 0;
    
    for (let i = 0; i < maxResults; i++) {
      const cycle = i % 4; // 4-step cycle: small, small, medium, large
      
      if ((cycle === 0 || cycle === 1) && smallIndex < smallRepos.length) {
        result.push(smallRepos[smallIndex++]);
      } else if (cycle === 2 && mediumIndex < mediumRepos.length) {
        result.push(mediumRepos[mediumIndex++]);
      } else if (cycle === 3 && largeIndex < largeRepos.length) {
        result.push(largeRepos[largeIndex++]);
      } else {
        // If one tier is exhausted, prioritize smaller repos
        if (smallIndex < smallRepos.length) {
          result.push(smallRepos[smallIndex++]);
        } else if (mediumIndex < mediumRepos.length) {
          result.push(mediumRepos[mediumIndex++]);
        } else if (largeIndex < largeRepos.length) {
          result.push(largeRepos[largeIndex++]);
        } else {
          break; // All tiers exhausted
        }
      }
    }

    return result;
  }

  /**
   * Get scoring explanation for a repository
   */
  getScoringExplanation(repo: RepositoryDetails, score: RepositoryScore): string {
    const explanations = [];

    if (score.breakdown.languageMatch > 0.5) {
      explanations.push(`Strong language match (${Math.round(score.breakdown.languageMatch * 100)}%)`);
    }

    if (score.breakdown.topicMatch > 0.5) {
      explanations.push(`Good topic alignment (${Math.round(score.breakdown.topicMatch * 100)}%)`);
    }

    if (score.breakdown.starsScore > 0.7) {
      explanations.push(`High community interest (${repo.stargazers_count} stars)`);
    }

    if (score.breakdown.activityScore > 0.7) {
      explanations.push('Recently active');
    }

    if (score.breakdown.issueScore > 0.6) {
      explanations.push(`Good contribution opportunities (${repo.goodFirstIssues} good first issues)`);
    }

    return explanations.join(', ') || 'Standard repository metrics';
  }

  /**
   * Calculate commit activity score using enriched data
   */
  private calculateCommitActivityScore(repo: RepositoryDetails): number {
    if (!repo.enrichedData?.commitAnalysis) return 0;

    const { frequency, recency, contributorDistribution, commitMessageQuality, branchActivity } = repo.enrichedData.commitAnalysis;
    
    // Normalize frequency (0-10 commits per week -> 0-1 score)
    const frequencyScore = Math.min(frequency / 5, 1); // 5 commits/week = perfect score
    
    // Normalize recency (0-365 days -> 1-0 score, inverted)
    const recencyScore = Math.max(0, 1 - (recency / 30)); // 30 days = 0 score
    
    // Combine all factors
    const activityScore = (
      frequencyScore * 0.3 +
      recencyScore * 0.3 +
      contributorDistribution * 0.2 +
      commitMessageQuality * 0.1 +
      branchActivity * 0.1
    );
    
    return Math.min(activityScore, 1);
  }

  /**
   * Calculate issue response score using enriched data
   */
  private calculateIssueResponseScore(repo: RepositoryDetails): number {
    if (!repo.enrichedData?.issueAnalysis) return 0;

    const { responseTime, resolutionRate, maintainerActivity, communityEngagement, issueQuality, labelUsage } = repo.enrichedData.issueAnalysis;
    
    // Normalize response time (0-168 hours -> 1-0 score, inverted)
    const responseScore = Math.max(0, 1 - (responseTime / 24)); // 24 hours = 0 score
    
    // Combine all factors
    const responseQualityScore = (
      responseScore * 0.3 +
      resolutionRate * 0.25 +
      maintainerActivity * 0.2 +
      communityEngagement * 0.15 +
      issueQuality * 0.05 +
      labelUsage * 0.05
    );
    
    return Math.min(responseQualityScore, 1);
  }

  /**
   * Calculate dependency health score using enriched data
   */
  private calculateDependencyHealthScore(repo: RepositoryDetails): number {
    if (!repo.enrichedData?.dependencyAnalysis) return 0;

    const { healthScore, securityScore, updateFrequency, dependencyCount, outdatedDependencies, licenseCompatibility } = repo.enrichedData.dependencyAnalysis;
    
    // Calculate outdated ratio
    const outdatedRatio = dependencyCount > 0 ? outdatedDependencies / dependencyCount : 0;
    const outdatedScore = Math.max(0, 1 - outdatedRatio); // Lower outdated ratio = better score
    
    // Combine all factors
    const dependencyScore = (
      healthScore * 0.3 +
      securityScore * 0.25 +
      updateFrequency * 0.15 +
      outdatedScore * 0.2 +
      licenseCompatibility * 0.1
    );
    
    return Math.min(dependencyScore, 1);
  }

  /**
   * Calculate README quality score using enriched data
   */
  private calculateReadmeQualityScore(repo: RepositoryDetails): number {
    if (!repo.enrichedData?.readmeAnalysis) return 0;

    const { contentQuality, learningResources, setupDifficulty } = repo.enrichedData.readmeAnalysis;
    
    // Normalize learning resources (0-10 -> 0-1 score)
    const learningScore = Math.min(learningResources / 5, 1); // 5 resources = perfect score
    
    // Invert setup difficulty (easier setup = better score)
    const setupScore = Math.max(0, 1 - setupDifficulty);
    
    // Combine all factors
    const readmeScore = (
      contentQuality * 0.5 +
      learningScore * 0.3 +
      setupScore * 0.2
    );
    
    return Math.min(readmeScore, 1);
  }

  /**
   * Calculate skill match score using enriched data
   */
  private calculateSkillMatchScore(repo: RepositoryDetails, skills: NormalizedSkill[]): number {
    if (!repo.enrichedData?.readmeAnalysis?.skillKeywords || !skills.length) return 0;

    const readmeSkills = repo.enrichedData.readmeAnalysis.skillKeywords;
    const userSkills = skills.map(skill => skill.normalized.toLowerCase());
    const userExpandedSkills = skills.flatMap(skill => skill.expanded.map(s => s.toLowerCase()));
    
    let matches = 0;
    let totalSkills = userSkills.length;
    
    // Check direct matches
    for (const skill of userSkills) {
      if (readmeSkills.some(readmeSkill => readmeSkill.toLowerCase().includes(skill) || skill.includes(readmeSkill.toLowerCase()))) {
        matches += 1;
      }
    }
    
    // Check expanded skill matches
    for (const expandedSkill of userExpandedSkills) {
      if (readmeSkills.some(readmeSkill => readmeSkill.toLowerCase().includes(expandedSkill) || expandedSkill.includes(readmeSkill.toLowerCase()))) {
        matches += 0.5; // Half weight for expanded matches
      }
    }
    
    return totalSkills > 0 ? Math.min(matches / totalSkills, 1) : 0;
  }
}

// Create singleton instance
const repositoryScorer = new RepositoryScorer();

export default repositoryScorer;
export type { RepositoryScore, ScoringOptions, ScoringWeights };
