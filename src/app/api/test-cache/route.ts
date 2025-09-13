import { NextRequest, NextResponse } from 'next/server';
import cacheManager from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'test';

    switch (action) {
      case 'test':
        return await testCache();
      case 'stats':
        return await getCacheStats();
      case 'health':
        return await getCacheHealth();
      case 'memory':
        return await getMemoryUsage();
      case 'clear':
        return await clearCache();
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: test, stats, health, memory, clear'
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Test cache API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function testCache() {
  const testData = {
    repositories: [
      { id: 1, name: 'test-repo', stars: 100 },
      { id: 2, name: 'another-repo', stars: 200 }
    ],
    skills: ['javascript', 'react'],
    timestamp: new Date().toISOString()
  };

  // Test search cache
  const searchKey = ['javascript', 'react'];
  const searchOptions = { perPage: 10, page: 1 };

  // Set cache
  await cacheManager.setSearchResults(searchKey, searchOptions, testData);
  
  // Get cache
  const cachedData = await cacheManager.getSearchResults(searchKey, searchOptions);

  // Test skill cache
  await cacheManager.setSkillNormalization(searchKey, { normalized: ['javascript', 'react'] });
  const cachedSkills = await cacheManager.getSkillNormalization(searchKey);

  return NextResponse.json({
    success: true,
    data: {
      test: {
        searchCache: {
          set: true,
          retrieved: cachedData !== null,
          dataMatch: JSON.stringify(cachedData) === JSON.stringify(testData)
        },
        skillCache: {
          set: true,
          retrieved: cachedSkills !== null,
          hasData: !!cachedSkills
        }
      },
      stats: cacheManager.getStats()
    }
  });
}

async function getCacheStats() {
  const stats = cacheManager.getStats();
  const ttlConfig = cacheManager.getTTLConfig();

  return NextResponse.json({
    success: true,
    data: {
      stats,
      ttlConfig
    }
  });
}

async function getCacheHealth() {
  const health = await cacheManager.getHealth();
  
  return NextResponse.json({
    success: true,
    data: {
      health,
      timestamp: new Date().toISOString()
    }
  });
}

async function getMemoryUsage() {
  const memory = await cacheManager.getMemoryUsage();
  
  return NextResponse.json({
    success: true,
    data: {
      memory,
      timestamp: new Date().toISOString()
    }
  });
}

async function clearCache() {
  await cacheManager.clearAll();
  
  return NextResponse.json({
    success: true,
    data: {
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    }
  });
}
