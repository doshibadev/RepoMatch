import { NextRequest, NextResponse } from 'next/server';
import githubClient from '@/lib/github';
import skillNormalizer from '@/lib/skills';
import repositoryScorer from '@/lib/scoring';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skillsParam = searchParams.get('skills');
    const mode = searchParams.get('mode') as 'profile-building' | 'learning' | 'quick-wins' || 'profile-building';
    
    if (!skillsParam) {
      return NextResponse.json({
        success: false,
        error: 'Skills parameter is required'
      }, { status: 400 });
    }

    const skills = skillsParam.split(',').map(s => s.trim());
    
    // Normalize skills
    const normalizedSkills = await skillNormalizer.normalizeSkills(skills);
    
    // Search for repositories
    const searchResult = await githubClient.searchRepositories(skills, {
      perPage: 5,
      page: 1
    });

    // Score repositories
    const scoredRepos = repositoryScorer.scoreRepositories(
      searchResult.repositories as any[],
      normalizedSkills,
      { mode }
    );

    // Format results
    const results = scoredRepos.map(({ repo, score }) => ({
      repository: {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics,
        url: repo.html_url,
        goodFirstIssues: repo.goodFirstIssues
      },
      scores: {
        relevance: Math.round(score.relevance * 100) / 100,
        quality: Math.round(score.quality * 100) / 100,
        opportunity: Math.round(score.opportunity * 100) / 100,
        final: Math.round(score.final * 100) / 100
      },
      breakdown: {
        languageMatch: Math.round(score.breakdown.languageMatch * 100) / 100,
        topicMatch: Math.round(score.breakdown.topicMatch * 100) / 100,
        readmeMatch: Math.round(score.breakdown.readmeMatch * 100) / 100,
        starsScore: Math.round(score.breakdown.starsScore * 100) / 100,
        activityScore: Math.round(score.breakdown.activityScore * 100) / 100,
        documentationScore: Math.round(score.breakdown.documentationScore * 100) / 100,
        issueScore: Math.round(score.breakdown.issueScore * 100) / 100,
        contributorScore: Math.round(score.breakdown.contributorScore * 100) / 100
      },
      explanation: repositoryScorer.getScoringExplanation(repo, score)
    }));

    return NextResponse.json({
      success: true,
      data: {
        input: {
          skills,
          normalizedSkills: normalizedSkills.map(s => ({
            original: s.original,
            normalized: s.normalized,
            category: s.category,
            weight: s.weight
          })),
          mode
        },
        results,
        total: searchResult.total
      }
    });
  } catch (error: any) {
    console.error('Test scoring API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
