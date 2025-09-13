import { NextRequest, NextResponse } from 'next/server';
import githubClient from '@/lib/github';

interface TrendingRequest {
  language?: string;
  since?: 'daily' | 'weekly' | 'monthly';
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || '';
    const since = (searchParams.get('since') as 'daily' | 'weekly' | 'monthly') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '20');

    const repositories = await githubClient.getTrendingRepositories(language, since);

    // Format and limit results
    const formattedRepos = repositories.slice(0, limit).map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      lastUpdated: repo.updated_at,
      createdAt: repo.created_at,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        url: repo.owner.html_url
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        repositories: formattedRepos,
        metadata: {
          language: language || 'all',
          since,
          limit,
          total: repositories.length,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Trending API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch trending repositories'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TrendingRequest = await request.json();
    
    const {
      language = '',
      since = 'weekly',
      limit = 20
    } = body;

    const repositories = await githubClient.getTrendingRepositories(language, since);

    // Format and limit results
    const formattedRepos = repositories.slice(0, limit).map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      lastUpdated: repo.updated_at,
      createdAt: repo.created_at,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        url: repo.owner.html_url
      }
    }));

    return NextResponse.json({
      success: true,
      data: {
        repositories: formattedRepos,
        metadata: {
          language: language || 'all',
          since,
          limit,
          total: repositories.length,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Trending API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch trending repositories'
    }, { status: 500 });
  }
}
