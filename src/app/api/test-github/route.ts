import { NextRequest, NextResponse } from 'next/server';
import githubClient from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    // Test the GitHub client with a simple search
    const searchParams = request.nextUrl.searchParams;
    const skills = searchParams.get('skills')?.split(',') || ['javascript'];
    
    const result = await githubClient.searchRepositories(skills, {
      perPage: 5,
      page: 1
    });

    // Also check rate limit
    const rateLimit = await githubClient.getRateLimit();

    return NextResponse.json({
      success: true,
      data: {
        repositories: result.repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          language: repo.language,
          topics: repo.topics,
          url: repo.html_url
        })),
        total: result.total,
        rateLimit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit
        }
      }
    });
  } catch (error: any) {
    console.error('Test GitHub API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
