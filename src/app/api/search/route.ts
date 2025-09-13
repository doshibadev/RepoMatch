import { NextRequest, NextResponse } from 'next/server';
import githubClient from '@/lib/github';
import skillNormalizer from '@/lib/skills';
import repositoryScorer from '@/lib/scoring';
import cacheManager from '@/lib/cache';

interface SearchRequest {
  skills: string[];
  mode?: 'profile-building' | 'learning' | 'quick-wins';
  limit?: number;
  page?: number;
  sort?: 'relevance' | 'stars' | 'activity' | 'opportunity';
  includeExplanation?: boolean;
  feelingLucky?: boolean;
  starRange?: {
    min?: number;
    max?: number;
  };
}

interface SearchResponse {
  repositories: Array<{
    id: number;
    name: string;
    full_name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    topics: string[];
    goodFirstIssues: number;
    lastUpdated: string;
    scores: {
      relevance: number;
      quality: number;
      opportunity: number;
      final: number;
    };
    explanation?: string;
    opportunities: Array<{
      type: string;
      count: number;
      url: string;
    }>;
  }>;
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    searchTime: number;
    cached: boolean;
    skills: {
      input: string[];
      normalized: Array<{
        original: string;
        normalized: string;
        category: string;
        weight: number;
      }>;
      expanded: string[];
    };
    mode: string;
    sort: string;
    filters: {
      starRange?: { min?: number; max?: number };
    };
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: SearchRequest = await request.json();
    
    // Validate request
    if (!body.skills || !Array.isArray(body.skills) || body.skills.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Skills array is required and must not be empty'
      }, { status: 400 });
    }

    const {
      skills,
      mode = 'profile-building',
      limit = 20,
      page = 1,
      sort = 'relevance',
      includeExplanation = false,
      feelingLucky = false,
      starRange
    } = body;

    // Normalize skills
    const normalizedSkills = await skillNormalizer.normalizeSkills(skills);
    const expandedSkills = skillNormalizer.getExpandedSkills(normalizedSkills);

    // Handle "I'm Feeling Lucky" mode
    if (feelingLucky) {
      return await handleFeelingLucky(expandedSkills, mode, startTime);
    }

    // Choose search strategy based on mode
    const searchOptions = {
      perPage: Math.min(limit * 3, 150), // Get more results for better diversity
      page: 1,
      sort: 'stars' as const,
      order: 'desc' as const
    };

    let searchResult;
    
    // Use different search strategies for different modes
    if (mode === 'quick-wins') {
      // Quick-wins: Prioritize issue-level search for contribution opportunities
      try {
        searchResult = await githubClient.searchIssuesBySkills(skills, searchOptions);
        // If issue search returns few results, fall back to regular search
        if (searchResult.repositories.length < 5) {
          searchResult = await githubClient.searchRepositories(skills, searchOptions);
        }
      } catch (error) {
        console.warn('Issue search failed, falling back to repository search:', error);
        searchResult = await githubClient.searchRepositories(skills, searchOptions);
      }
    } else if (mode === 'learning') {
      // Learning: Use educational-focused search with more results for diversity
      const learningOptions = {
        ...searchOptions,
        perPage: Math.min(limit * 4, 200), // Get more results for better diversity
        sort: 'updated' as const, // Prioritize recently active repos
        order: 'desc' as const
      };
      searchResult = await githubClient.searchRepositories(skills, learningOptions);
    } else {
      // Profile-building: Use popularity-focused search
      const profileOptions = {
        ...searchOptions,
        perPage: Math.min(limit * 2, 100), // Moderate number of results
        sort: 'stars' as const, // Prioritize popular repos
        order: 'desc' as const
      };
      searchResult = await githubClient.searchRepositories(skills, profileOptions);
    }

    if (!searchResult.repositories || searchResult.repositories.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          repositories: [],
          metadata: {
            total: 0,
            page,
            limit,
            hasMore: false,
            searchTime: Date.now() - startTime,
            cached: false,
            skills: {
              input: skills,
              normalized: normalizedSkills.map(s => ({
                original: s.original,
                normalized: s.normalized,
                category: s.category,
                weight: s.weight
              })),
              expanded: expandedSkills
            },
            mode,
            sort
          }
        }
      });
    }

    // Apply user-specified filters before scoring
    let filteredRepos = searchResult.repositories as any[];

    // Apply mode-specific pre-filtering for better differentiation
    filteredRepos = applyModeSpecificFiltering(filteredRepos, mode);

    // Filter by star range if specified
    if (starRange) {
      filteredRepos = filteredRepos.filter(repo => {
        const stars = repo.stargazers_count;
        if (starRange.min !== undefined && stars < starRange.min) return false;
        if (starRange.max !== undefined && stars > starRange.max) return false;
        return true;
      });
    }

    // Score repositories
    const scoredRepos = repositoryScorer.scoreRepositories(
      filteredRepos,
      normalizedSkills,
      { mode }
    );

    // Sort by requested criteria
    const sortedRepos = sortRepositories(scoredRepos, sort);

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRepos = sortedRepos.slice(startIndex, endIndex);

    // Format response
    const repositories = paginatedRepos.map(({ repo, score }) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      goodFirstIssues: repo.goodFirstIssues || 0,
      lastUpdated: repo.updated_at,
      scores: {
        relevance: Math.round(score.relevance * 100) / 100,
        quality: Math.round(score.quality * 100) / 100,
        opportunity: Math.round(score.opportunity * 100) / 100,
        final: Math.round(score.final * 100) / 100
      },
      explanation: includeExplanation ? repositoryScorer.getScoringExplanation(repo, score) : undefined,
      opportunities: generateOpportunities(repo)
    }));

    const response: SearchResponse = {
      repositories,
        metadata: {
          total: searchResult.total,
          page,
          limit,
          hasMore: endIndex < sortedRepos.length,
          searchTime: Date.now() - startTime,
          cached: false, // TODO: Implement cache detection
          skills: {
            input: skills,
            normalized: normalizedSkills.map(s => ({
              original: s.original,
              normalized: s.normalized,
              category: s.category,
              weight: s.weight
            })),
            expanded: expandedSkills
          },
          mode,
          sort,
          filters: {
            starRange
          }
        }
    };

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * Handle "I'm Feeling Lucky" mode - return random high-quality repositories
 */
async function handleFeelingLucky(
  expandedSkills: string[],
  mode: string,
  startTime: number
): Promise<NextResponse> {
  try {
    // Get trending repositories
    const trendingRepos = await githubClient.getTrendingRepositories('', 'weekly');
    
    // Filter by skills if provided
    const filteredRepos = expandedSkills.length > 0 
      ? trendingRepos.filter(repo => 
          expandedSkills.some(skill => 
            repo.language?.toLowerCase().includes(skill.toLowerCase()) ||
            repo.topics?.some((topic: string) => 
              topic.toLowerCase().includes(skill.toLowerCase())
            ) ||
            repo.description?.toLowerCase().includes(skill.toLowerCase())
          )
        )
      : trendingRepos;

    // Get random selection
    const randomRepos = filteredRepos
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const repositories = randomRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      goodFirstIssues: 0, // Would need additional API call
      lastUpdated: repo.updated_at,
      scores: {
        relevance: 0.8, // High relevance for trending
        quality: 0.9,   // High quality for trending
        opportunity: 0.7, // Good opportunity for trending
        final: 0.8
      },
      explanation: 'Trending repository with high community interest',
      opportunities: generateOpportunities(repo)
    }));

    return NextResponse.json({
      success: true,
      data: {
        repositories,
        metadata: {
          total: filteredRepos.length,
          page: 1,
          limit: 5,
          hasMore: false,
          searchTime: Date.now() - startTime,
          cached: false,
          skills: {
            input: [],
            normalized: [],
            expanded: expandedSkills
          },
          mode: 'feeling-lucky',
          sort: 'random'
        }
      }
    });
  } catch (error: any) {
    console.error('Feeling lucky error:', error);
    throw error;
  }
}

/**
 * Sort repositories by the requested criteria
 */
function sortRepositories(
  scoredRepos: Array<{ repo: any; score: any }>,
  sort: string
): Array<{ repo: any; score: any }> {
  switch (sort) {
    case 'stars':
      return scoredRepos.sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);
    case 'activity':
      return scoredRepos.sort((a, b) => 
        new Date(b.repo.updated_at).getTime() - new Date(a.repo.updated_at).getTime()
      );
    case 'opportunity':
      return scoredRepos.sort((a, b) => b.score.opportunity - a.score.opportunity);
    case 'relevance':
    default:
      return scoredRepos.sort((a, b) => b.score.final - a.score.final);
  }
}


/**
 * Apply mode-specific pre-filtering to repositories
 */
function applyModeSpecificFiltering(repos: any[], mode: string): any[] {
  switch (mode) {
    case 'learning':
      // Learning mode: Filter for repos with educational value
      return repos.filter(repo => {
        // Must have some documentation
        if (!repo.description || repo.description.length < 30) return false;
        
        // Prefer repos with good first issues or educational content
        const hasEducationalContent = 
          repo.goodFirstIssues > 0 ||
          (repo.description && (
            repo.description.toLowerCase().includes('tutorial') ||
            repo.description.toLowerCase().includes('example') ||
            repo.description.toLowerCase().includes('learn') ||
            repo.description.toLowerCase().includes('beginner')
          )) ||
          (repo.topics && repo.topics.some((topic: string) => 
            ['tutorial', 'example', 'learning', 'beginner', 'documentation', 'education'].includes(topic.toLowerCase())
          ));
        
        return hasEducationalContent;
      });

    case 'quick-wins':
      // Quick wins mode: Filter for repos with contribution opportunities
      return repos.filter(repo => {
        // Must have open issues
        if (repo.open_issues_count === 0) return false;
        
        // Must not be overwhelming
        if (repo.open_issues_count > 500) return false;
        
        // Must be reasonably active (updated within last 6 months)
        const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 180) return false;
        
        // Prefer repos with good first issues
        return repo.goodFirstIssues > 0 || repo.open_issues_count <= 100;
      });

    case 'profile-building':
      // Profile building mode: Filter for high-impact projects
      return repos.filter(repo => {
        // Must have reasonable visibility
        if (repo.stargazers_count < 50) return false;
        
        // Must not be too new (less than 30 days old)
        const daysSinceCreated = (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 30) return false;
        
        // Must have some description
        if (!repo.description || repo.description.length < 20) return false;
        
        return true;
      });

    default:
      return repos;
  }
}

/**
 * Generate opportunity information for a repository
 */
function generateOpportunities(repo: any): Array<{ type: string; count: number; url: string }> {
  const opportunities = [];

  if (repo.goodFirstIssues > 0) {
    opportunities.push({
      type: 'good-first-issue',
      count: repo.goodFirstIssues,
      url: `${repo.html_url}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`
    });
  }

  if (repo.open_issues_count > 0) {
    opportunities.push({
      type: 'open-issues',
      count: repo.open_issues_count,
      url: `${repo.html_url}/issues`
    });
  }

  if (repo.forks_count > 0) {
    opportunities.push({
      type: 'fork-opportunities',
      count: repo.forks_count,
      url: `${repo.html_url}/forks`
    });
  }

  return opportunities;
}

/**
 * GET endpoint for simple search queries
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skillsParam = searchParams.get('skills');
  const mode = searchParams.get('mode') as 'profile-building' | 'learning' | 'quick-wins' || 'profile-building';
  const limit = parseInt(searchParams.get('limit') || '20');
  const feelingLucky = searchParams.get('feelingLucky') === 'true';

  if (!skillsParam) {
    return NextResponse.json({
      success: false,
      error: 'Skills parameter is required'
    }, { status: 400 });
  }

  const skills = skillsParam.split(',').map(s => s.trim());

  // Convert GET to POST format
  const body: SearchRequest = {
    skills,
    mode,
    limit,
    feelingLucky
  };

  // Create a mock request object
  const mockRequest = {
    json: async () => body
  } as NextRequest;

  return POST(mockRequest);
}
